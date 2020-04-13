import SkipBoServer from "../../main/server/SkipBoServer";
import {createAndReadTests, deleteTests} from "../common/ControllerTests";
import Game from "../../main/game/Game";
import supertest, {Response} from "supertest";
import {clearAllEntities} from "../common/EntityUtils";
import Spectator from "../../main/spectator/Specatator";

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

    const createPlayer = () => {
        counter++;
        const player = <Spectator>{name:"Spectator " + counter};
        player.gameid = game.id;
        return player;
    };

    createAndReadTests(server, entityName, createPlayer);

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

    deleteTests(server, entityName, createPlayer);

});

async function createNewGame(server: SkipBoServer):Promise<Game> {
    await supertest(server.server).post("/game");
    const getResponse = await supertest(server.server).get("/game");
    const game = <Game>getResponse.body[0];
    return game;
}
