import EntityController from "../server/EntityController";
import Player from "./Player";

export default class PlayerEntityController extends EntityController<Player>{

    constructor() {
        super(Player.ENTITY_NAME);
    }

}