import SkipBoServer from "../../main/server/SkipBoServer";
import {createAndReadTests, deleteTests} from "../common/ControllerTests";
import Game from "../../main/game/Game";
import {clearAllEntities} from "../common/EntityUtils";

describe("Game Rest Services", () => {

    const entityName = new Game().entityName;
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

});
