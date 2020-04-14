import {personEntityTests} from "./PersonEntityControllerTests";
import Player from "../../main/person/Player";

describe("Player Rest Services", () => {
    personEntityTests(Player.ENTITY_NAME);
});

