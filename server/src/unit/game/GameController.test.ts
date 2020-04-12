import SkipBoServer from "../../main/server/SkipBoServer";
import supertest, {Response} from "supertest";
import GameController from "../../main/game/GameController";

describe("Game Rest Services", () => {

    const server: SkipBoServer = new SkipBoServer();
    beforeAll(() => {
        server.start();
    });

    afterAll(() => {
        server.stop();
    });

    it("Before any data has been added, get returns an empty list",async ()=>{
        const response: Response = await supertest(server.server).get("/game");
        expect(response.status).toEqual(200);
        expect(response.body).toEqual([]);
    });

    it("I can create a game",async ()=>{
        const response: Response = await supertest(server.server).post("/game");
        expect(response.status).toEqual(201);
        expect(response.body.id).toBeDefined();
    });

    it("I can create a game using a put",async ()=>{
        const response: Response = await supertest(server.server).put("/game");
        expect(response.status).toEqual(201);
        expect(response.body.id).toBeDefined();
    });

    it("After I create a game, getAll returns at least one game",async ()=>{

        const postResponse: Response = await supertest(server.server).post("/game");

        const getResponse: Response = await supertest(server.server).get("/game");
        expect(getResponse.status).toEqual(200);
        expect(getResponse.body.length).toBeGreaterThan(0);
    });

    it("After I create a game, I can retrieve the game",async ()=>{

        const postResponse: Response = await supertest(server.server).post("/game");
        const gameCreated = postResponse.body;

        const getResponse: Response = await supertest(server.server).get(`/game/${gameCreated.id}`);
        expect(getResponse.status).toEqual(200);
        expect(getResponse.body.id).toEqual(gameCreated.id);
    });

    it("If I ask for a game that does not exist, then it will return a 404",async ()=>{
        const getResponse: Response = await supertest(server.server).get(`/game/doesnotexist`);
        expect(getResponse.status).toEqual(404);
    });

    it("I can delete games that I have created",async ()=>{
        const postResponse: Response = await supertest(server.server).post("/game");
        const gameCreated = postResponse.body;

        const deleteResponse: Response = await supertest(server.server).delete(`/game/${gameCreated.id}`);
        expect(deleteResponse.status).toEqual(204);

        const getResponse: Response = await supertest(server.server).get(`/game/${gameCreated.id}`);
        expect(getResponse.status).toEqual(404);
    });

});