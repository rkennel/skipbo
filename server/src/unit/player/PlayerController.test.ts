import SkipBoServer from "../../main/server/SkipBoServer";
import {createAndReadTests, deleteTests, updateTests} from "../common/ControllerTests";
import Game from "../../main/game/Game";
import Player from "../../main/player/Player";
import supertest, {Response} from "supertest";
import {clearAllEntities, clearAllPlayersAndSpectators} from "../common/EntityUtils";
import Entity from "../../main/common/Entity";
import {Card} from "../../main/gameplay/Card";

describe("Player Rest Services", () => {

    const entityName = Player.ENTITY_NAME;
    const server: SkipBoServer = new SkipBoServer();

    let game: Game;
    let counter: number = 0;

    beforeAll(async () => {
        clearAllEntities();
        server.start();
        game = await createNewGame(server);
    });

    beforeEach(() => {
        clearAllPlayersAndSpectators();
    });

    afterAll(() => {
        server.stop();
        clearAllEntities();
    });

    const createPlayer = () => {
        counter++;
        const player = <Player>{name: "Player " + counter};
        player.gameid = game.id;
        return player;
    };

    const updatePlayer = (entity: Entity) => {
        const player: Player = <Player>entity;
        player.name = `${player.name} modified`;
        return player;
    };

    describe("Create and Read Tests", () => {

        beforeEach(()=>{
            clearAllPlayersAndSpectators();
        });

        createAndReadTests(server, entityName, createPlayer);

        it("Fails to add player if a game id is not specified", async () => {
            const player = new Player("Pelé");
            const response: Response = await supertest(server.server).post(`/${entityName}`).send(player).set('Accept', 'application/json');

            expect(response.status).toEqual(400);
            expect(response.body.httpStatus).toEqual(400);
            expect(response.body.errorMessage).toEqual("Must specify game for player to be added to");
        });

        it("Fails to add player if a game id specified does not exist", async () => {
            const player = new Player("Pelé");
            player.gameid = "doesnotexist";

            const response: Response = await supertest(server.server).post(`/${entityName}`).send(player).set('Accept', 'application/json');

            expect(response.status).toEqual(400);
            expect(response.body.httpStatus).toEqual(400);
            expect(response.body.errorMessage).toEqual(`Game: ${player.gameid} does not exist`);
        });

        it("Games can only have up to six players", async () => {

            const game = await createNewGame(server);

            const players = [
                new Player("Lance"),
                new Player("Alan"),
                new Player("Lou"),
                new Player("Kirk"),
                new Player("Jack"),
                new Player("Chester")
            ];

            for (let player of players) {
                player.gameid = game.id;
                await createPlayerOnServer(server, entityName, player);
            }

            const player = new Player("Darrell");
            player.gameid = game.id;

            const response: Response = await supertest(server.server).post(`/${entityName}`).send(player).set('Accept', 'application/json');

            expect(response.status).toEqual(400);
            expect(response.body.httpStatus).toEqual(400);
            expect(response.body.errorMessage).toEqual(`Maximum of 6 players is allowed`);
        });

        it("Cannot add player with same name to the same game",async ()=>{
            const template = new Player("MJ");
            template.gameid = game.id;

            const mj = await createPlayerOnServer(server,Player.ENTITY_NAME,template);

            const clone = template;
            const response = await supertest(server.server).post(`/${entityName}`).send(clone).set('Accept', 'application/json');

            expect(response.status).toEqual(409);
            expect(response.body.httpStatus).toEqual(409);
            expect(response.body.errorMessage).toEqual(`Player name must be unique to the game. a player named "${mj.name}" already exists`);
        });

    });

    describe("Update tests", () => {
        updateTests(server, entityName, createPlayer, updatePlayer);

        let player: Player;

        beforeEach(async () => {
            clearAllPlayersAndSpectators();
            player = await createPlayerOnServer(server, Player.ENTITY_NAME, createPlayer());
        });

        describe("Cheater trying to update something other than their name", () => {

            it("Updating game id throws a 400 error", async () => {
                player.gameid = "newgameid";
                const putResponse = await supertest(server.server).put(`/${entityName}/${player.id}`).send(player);

                expect(putResponse.status).toEqual(400);
                expect(putResponse.body.httpStatus).toEqual(400);
                expect(putResponse.body.errorMessage).toEqual(`Cannot update game id via this method`);
            });


            it("Updating stock pile cards throws a 400 error", async () => {
                player.stockpile = [Card.SKIP_BO];

                const putResponse = await supertest(server.server).put(`/${entityName}/${player.id}`).send(player);

                expect(putResponse.status).toEqual(400);
                expect(putResponse.body.httpStatus).toEqual(400);
                expect(putResponse.body.errorMessage).toEqual(`Cannot update player stockpiles via this method`);
            });

            it("Updating hand cards throws a 400 error", async () => {
                player.hand = [Card.SKIP_BO];

                const putResponse = await supertest(server.server).put(`/${entityName}/${player.id}`).send(player);

                expect(putResponse.status).toEqual(400);
                expect(putResponse.body.httpStatus).toEqual(400);
                expect(putResponse.body.errorMessage).toEqual(`Cannot update player hand via this method`);
            });

            it("Updating discard pile cards throws a 400 error", async () => {
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
        });

    });

    describe("Delete tests", () => {
        deleteTests(server, entityName, createPlayer);
    });

});

async function createNewGame(server: SkipBoServer): Promise<Game> {
    await supertest(server.server).post("/game");
    const getResponse = await supertest(server.server).get("/game");
    const game = <Game>getResponse.body[0];
    return game;
}

async function createPlayerOnServer(server: SkipBoServer, entityName: string, player: Player): Promise<Player> {
    const postResponse = await supertest(server.server).post(`/${entityName}`).send(player).set('Accept', 'application/json');

    if (postResponse.status != 201) {
        throw new Error("Error creating player");
    }

    return <Player>postResponse.body;
}