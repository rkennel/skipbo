import { personEntityTests } from "./PersonEntityControllerTests";
import { Player } from "skipbo-common";

describe("Player Rest Services", () => {
  personEntityTests(Player.ENTITY_NAME);
});
