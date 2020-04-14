import Spectator from "../../main/person/Specatator";
import {personEntityTests} from "./PersonEntityControllerTests";

describe("Spectator Rest Services", () => {
    personEntityTests(Spectator.ENTITY_NAME);
});
