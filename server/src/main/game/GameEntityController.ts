import Game from "./Game";
import EntityController from "../server/EntityController";

export default class GameEntityController extends EntityController<Game>{

    constructor() {
        super(Game.ENTITY_NAME);
    }



}