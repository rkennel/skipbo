import SkipBoServer from "../../main/server/SkipBoServer";
import {createAndReadTests, deleteTests} from "../common/ControllerTests";
import Game from "../../main/game/Game";
import {clearAllEntities} from "../common/EntityUtils";
import supertest, {Response} from "supertest";

describe("Game Rest Services", () => {

    const entityName = Game.ENTITY_NAME;
    const server: SkipBoServer = new SkipBoServer();
    beforeAll(() => {
        clearAllEntities();
        server.start();
    });

    afterAll(() => {
        server.stop();
        clearAllEntities();
    });

    createAndReadTests(server,entityName, undefined);

    deleteTests(server,entityName, undefined);

    it("Update method is not allowed on all games",async ()=>{
        const updateResponse: Response = await supertest(server.server).put(`/${entityName}`);
        expect(updateResponse.status).toEqual(405);
    });

});
