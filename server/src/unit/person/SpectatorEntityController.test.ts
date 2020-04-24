import { personEntityTests } from "./PersonEntityControllerTests";
import { Spectator } from "skipbo-common";

describe("Spectator Rest Services", () => {
  personEntityTests(Spectator.ENTITY_NAME);
});
