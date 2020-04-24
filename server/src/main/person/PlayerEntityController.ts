import EntityController from "../server/EntityController";
import { Player } from "skipbo-common";

export default class PlayerEntityController extends EntityController<Player> {
  constructor() {
    super(Player.ENTITY_NAME);
  }
}
