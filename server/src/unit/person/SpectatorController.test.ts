import SkipBoServer from "../../main/server/SkipBoServer";
import {createAndReadTests, deleteTests, updateTests} from "../common/ControllerTests";
import Game from "../../main/game/Game";
import supertest, {Response} from "supertest";
import {clearAllEntities, clearAllPlayersAndSpectators} from "../entity/EntityUtils";
import Spectator from "../../main/person/Specatator";
import Player from "../../main/person/Player";
import {Card} from "../../main/gameplay/Card";
import Entity from "../../main/entity/Entity";

describe("Player Rest Services", () => {

    const entityName = "spectator";
    const server: SkipBoServer = new SkipBoServer();

    let game: Game;
    let counter: number = 0;

    beforeAll(async () => {
        clearAllEntities();
        server.start();
        game = await createNewGame(server);
    });

    afterAll(() => {
        server.stop();
        clearAllEntities();
    });

    const createSpectator = () => {
        counter++;
        const spectator = <Spectator>{name: "Spectator " + counter};
        spectator.gameid = game.id;
        return spectator;
    };

    const updateSpectator = (entity: Entity) => {
        const spectator: Spectator = <Spectator>entity;
        spectator.name = `${spectator.name} modified`;
        return spectator;
    };

    describe("Create and Read Tests", () => {
        createAndReadTests(server, entityName, createSpectator);

        it("Fails to add spectator if a game id is not specified", async () => {
            const spectator = new Spectator("Pelé");
            const response: Response = await supertest(server.server).post(`/${entityName}`).send(spectator).set('Accept', 'application/json');

            expect(response.status).toEqual(400);
            expect(response.body.httpStatus).toEqual(400);
            expect(response.body.errorMessage).toEqual("Must specify game for spectator to be added to");
        });

        it("Fails to add spectator if a game id specified does not exist", async () => {
            const spectator = new Spectator("Pelé");
            spectator.gameid = "doesnotexist";

            const response: Response = await supertest(server.server).post(`/${entityName}`).send(spectator).set('Accept', 'application/json');

            expect(response.status).toEqual(400);
            expect(response.body.httpStatus).toEqual(400);
            expect(response.body.errorMessage).toEqual(`Game: ${spectator.gameid} does not exist`);
        });
    });

    describe("Update tests", () => {
        updateTests(server, entityName, createSpectator, updateSpectator);

        let player: Spectator;

        beforeEach(async () => {
            clearAllPlayersAndSpectators();
            player = await createSpectatorOnServer(server, Spectator.ENTITY_NAME, createSpectator());
        });

        describe("Cheater trying to update something other than their name", () => {

            it("Updating game id throws a 400 error", async () => {
                player.gameid = "newgameid";
                const putResponse = await supertest(server.server).put(`/${entityName}/${player.id}`).send(player);

                expect(putResponse.status).toEqual(400);
                expect(putResponse.body.httpStatus).toEqual(400);
                expect(putResponse.body.errorMessage).toEqual(`Cannot update game id via this method`);
            });

        });

    });

    describe("Delete Tests", () => {
        deleteTests(server, entityName, createSpectator);
    });
});

async function createNewGame(server: SkipBoServer): Promise<Game> {
    await supertest(server.server).post("/game");
    const getResponse = await supertest(server.server).get("/game");
    const game = <Game>getResponse.body[0];
    return game;
}


async function createSpectatorOnServer(server: SkipBoServer, entityName: string, spectator: Spectator): Promise<Spectator> {
    const postResponse = await supertest(server.server).post(`/${entityName}`).send(spectator).set('Accept', 'application/json');

    if (postResponse.status != 201) {
        throw new Error("Error creating spectator");
    }

    return <Spectator>postResponse.body;
}