import Player from "../gameplay/Player";
import Deck from "../gameplay/Deck";
import { Card } from "../gameplay/Card";
import { isEqual } from "lodash";

export default class Game implements Entity {
  players: Player[] = [];
  spectators: Player[] = [];
  deck: Deck = new Deck();
  buildingPiles: Card[][] = [[], [], [], []];
  id: string;

  constructor() {
    this.id = this.generateUniqueId();
  }

  private generateUniqueId(): string {
    const availableCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";

    let id = "";
    for (let i = 0; i < 8; i++) {
      const randomIndex: number = Math.floor(
        Math.random() * availableCharacters.length
      );

      id = id + availableCharacters.charAt(randomIndex);
    }

    return id;
  }

  addPlayer(player: Player): void {
    if (this.players.length >= 6) {
      throw new Error("Maximum of 6 players is allowed");
    }

    this.addPerson(player, this.players, this.spectators);
  }

  private addPerson(
    player: Player,
    players: Player[],
    playersToRemoveFrom: Player[]
  ) {
    if (!players.includes(player)) {
      players.push(player);
      this.removePerson(player, playersToRemoveFrom);
    }
  }

  removePlayer(player: Player): void {
    this.removePerson(player, this.players);
  }

  private removePerson(player: Player, players: Player[]) {
    const index = this.findPlayerIndex(player, players);
    if (index > -1) {
      players.splice(index, 1);
    }
  }

  private findPlayerIndex(player: Player, players: Player[]): number {
    for (let i = 0; i < players.length; i++) {
      if (isEqual(player, players[i])) {
        return i;
      }
    }

    return -1;
  }

  addSpectator(player: Player): void {
    this.addPerson(player, this.spectators, this.players);
  }

  removeSpectator(player: Player) {
    this.removePerson(player, this.spectators);
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
