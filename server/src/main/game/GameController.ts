import Game from "./Game";
import EntityController from "../server/EntityController";

export default class GameController extends EntityController<Game>{

    constructor() {
        super();
    }

    entity(): Game {
        return new Game();
    }



}