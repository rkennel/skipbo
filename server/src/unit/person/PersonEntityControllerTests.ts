import SkipBoServer from "../../main/server/SkipBoServer";
import {createAndReadTests, deleteTests, updateTests} from "../common/ControllerTests";
import Game from "../../main/game/Game";
import supertest, {Response} from "supertest";
import {clearAllEntities, clearAllPlayersAndSpectators} from "../entity/EntityUtils";
import Spectator from "../../main/person/Specatator";
import Player from "../../main/person/Player";
import {Card} from "../../main/gameplay/Card";
import Entity from "../../main/entity/Entity";
import Person from "../../main/person/Person";

export function personEntityTests(entityName: string) {

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

    const createPerson = () => {
        counter++;
        let person: Person;

        if (entityName === Player.ENTITY_NAME) {
            person = <Player>{name: entityName.toUpperCase() + " " + counter};
        } else {
            person = <Spectator>{name: entityName.toUpperCase() + " " + counter};
        }

        person.gameid = game.id;
        return person;
    };

    const updatePerson = (entity: Entity) => {
        const person: Person = <Person>entity;
        person.name = `${person.name} modified`;
        return person;
    };

    describe("Create and Read Tests", () => {
        createAndReadTests(server, entityName, createPerson);

        it("Fails to add spectator if a game id is not specified", async () => {
            const person = createPerson();
            person.gameid = undefined;
            const response: Response = await supertest(server.server).post(`/${entityName}`).send(person).set('Accept', 'application/json');

            expect(response.status).toEqual(400);
            expect(response.body.httpStatus).toEqual(400);
            expect(response.body.errorMessage).toEqual(`Must specify game for ${entityName} to be added to`);
        });

        it("Fails to add spectator if a game id specified does not exist", async () => {
            const person = createPerson();
            person.gameid = "doesnotexist";

            const response: Response = await supertest(server.server).post(`/${entityName}`).send(person).set('Accept', 'application/json');

            expect(response.status).toEqual(400);
            expect(response.body.httpStatus).toEqual(400);
            expect(response.body.errorMessage).toEqual(`Game: ${person.gameid} does not exist`);
        });
    });

    describe("Update tests", () => {
        updateTests(server, entityName, createPerson, updatePerson);

        let person: Person;

        beforeEach(async () => {
            clearAllPlayersAndSpectators();
            person = await createSpectatorOnServer(server, entityName, createPerson());
        });

        describe("Cheater trying to update something other than their name", () => {

            it("Updating game id throws a 400 error", async () => {
                person.gameid = "newgameid";
                const putResponse = await supertest(server.server).put(`/${entityName}/${person.id}`).send(person);

                expect(putResponse.status).toEqual(400);
                expect(putResponse.body.httpStatus).toEqual(400);
                expect(putResponse.body.errorMessage).toEqual(`Cannot update game id via this method`);
            });

            if (entityName === Player.ENTITY_NAME) {


                it("Updating stock pile cards throws a 400 error", async () => {
                    const player = <Player>person;
                    player.stockpile = [Card.SKIP_BO];

                    const putResponse = await supertest(server.server).put(`/${entityName}/${player.id}`).send(player);

                    expect(putResponse.status).toEqual(400);
                    expect(putResponse.body.httpStatus).toEqual(400);
                    expect(putResponse.body.errorMessage).toEqual(`Cannot update player stockpiles via this method`);
                });

                it("Updating hand cards throws a 400 error", async () => {
                    const player = <Player>person;
                    player.hand = [Card.SKIP_BO];

                    const putResponse = await supertest(server.server).put(`/${entityName}/${player.id}`).send(player);

                    expect(putResponse.status).toEqual(400);
                    expect(putResponse.body.httpStatus).toEqual(400);
                    expect(putResponse.body.errorMessage).toEqual(`Cannot update player hand via this method`);
                });

                it("Updating discard pile cards throws a 400 error", async () => {
                    const player = <Player>person;
                    player.discardPiles = [
                        [Card.SKIP_BO],
                        [Card.SKIP_BO],
                        [Card.SKIP_BO],
                        [Card.SKIP_BO]
                    ];

                    const putResponse = await supertest(server.server).put(`/${entityName}/${player.id}`).send(player);

                    expect(putResponse.status).toEqual(400);
                    expect(putResponse.body.httpStatus).toEqual(400);
                    expect(putResponse.body.errorMessage).toEqual(`Cannot update player discard piles via this method`);
                });

            }
        });

    });

    describe("Delete Tests", () => {
        deleteTests(server, entityName, createPerson);
    });
};

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