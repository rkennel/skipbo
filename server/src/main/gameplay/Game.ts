import Player from "./Player";
import Deck from "./Deck";
import { Card } from "./Card";

export default class Game {
  players: Player[];
  deck: Deck = new Deck();
  buildingPiles: Card[][] = [[], [], [], []];

  constructor(players: Player[]) {
    if (!players) {
      throw new Error("Select 2-6 players");
    }

    this.players = players;

    const stockPiles: Card[][] = this.deck.dealStockpiles(players.length);

    for (let i = 0; i < this.players.length; i++) {
      this.players[i].stockpile = stockPiles[i];
    }
  }

  leader(): string {
    let output: string = "Tie: " + this.players[0].name;
    for (let i = 1; i < this.players.length; i++) {
      output = output + ", " + this.players[i].name;
    }

    return output;
  }
}
