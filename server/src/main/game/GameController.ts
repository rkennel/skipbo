import Game from "./Game";
import EntityController from "../server/EntityController";

export default class GameController extends EntityController<Game>{

    private static ENTITY_NAME:string = "game";

    constructor() {
        super();
    }

    entityName(): string {
        return GameController.ENTITY_NAME;
    }

}