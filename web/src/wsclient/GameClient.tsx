import {Game} from "skipbo-common";

export default class GameClient {

    newGame():Game {
        return new Game();
    }

}