import Player from "./Player";
import Entity from "./Entity";
import Deck from "./Deck";
import {Card} from "./Card"
import Spectator from "./Specatator";
import {generateUniqueId} from "./UniqueIdGenerator";

export default class Game implements Entity {

  static ENTITY_NAME: string = "game";

  players: Player[] = [];
  spectators: Spectator[] = [];
  deck: Deck = new Deck();
  buildingPiles: Card[][] = [[], [], [], []];
  id: string;
  entityName: string = Game.ENTITY_NAME;

  constructor() {
    this.id = generateUniqueId();
  }

  start() {
    const stockPiles: Card[][] = this.deck.dealStockpiles(this.players.length);

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
