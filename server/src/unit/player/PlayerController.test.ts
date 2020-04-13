import SkipBoServer from "../../main/server/SkipBoServer";
import {createAndReadTests, deleteTests, updateTests} from "../common/ControllerTests";
import Game from "../../main/game/Game";
import Player from "../../main/player/Player";
import supertest, {Response} from "supertest";
import {clearAllEntities, clearAllPlayersAndSpectators} from "../common/EntityUtils";
import Entity from "../../main/common/Entity";

describe("Player Rest Services", () => {

    const entityName = new Player("Dikembe").entityName;
    const server: SkipBoServer = new SkipBoServer();

    let game: Game;
    let counter: number = 0;

    beforeAll(async () => {
        clearAllEntities();
        server.start();
        game = await createNewGame(server);
    });

    beforeEach(()=>{
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
            await supertest(server.server).post(`/${entityName}`).send(player).set('Accept', 'application/json');
        }

        const player = new Player("Darrell");
        player.gameid = game.id;

        const response: Response = await supertest(server.server).post(`/${entityName}`).send(player).set('Accept', 'application/json');

        expect(response.status).toEqual(400);
        expect(response.body.httpStatus).toEqual(400);
        expect(response.body.errorMessage).toEqual(`Maximum of 6 players is allowed`);
    });

    updateTests(server, entityName, createPlayer, updatePlayer);

    deleteTests(server, entityName, createPlayer);

});

async function createNewGame(server: SkipBoServer): Promise<Game> {
    await supertest(server.server).post("/game");
    const getResponse = await supertest(server.server).get("/game");
    const game = <Game>getResponse.body[0];
    return game;
}
