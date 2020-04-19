import { Game } from "skipbo-common";

export default class GameClient {
  newGame(): Promise<Game> {
    return new Promise<Game>(() => new Game());
  }
}
