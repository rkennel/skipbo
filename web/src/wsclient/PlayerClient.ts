import { Player } from "skipbo-common";

export default class PlayerClient {
  newPlayer(name: string, gameid: string): Player {
    const player: Player = new Player(name);
    player.gameid = gameid;
    return player;
  }
}
