import Player from "../person/Player";
import Deck from "../gameplay/Deck";
import { Card } from "../gameplay/Card";
import { isEqual } from "lodash";
import Entity from "../entity/Entity";
import {generateUniqueId} from "../entity/UniqueIdGenerator";
import {DuplicateError} from "../common/Errors";

export default class Game implements Entity {

  static ENTITY_NAME: string = "game";

  players: Player[] = [];
  spectators: Player[] = [];
  deck: Deck = new Deck();
  buildingPiles: Card[][] = [[], [], [], []];
  id: string;
  entityName: string = Game.ENTITY_NAME;

  constructor() {
    this.id = generateUniqueId();
  }

  addPlayer(player: Player): void {
    if (this.players.length >= 6) {
      throw new Error("Maximum of 6 players is allowed");
    }

    this.addPerson(player, this.players);
  }

  private validatePlayerNameUniqueness(person: Player) {
    const people = this.players.concat(this.spectators);

    for(let p of people){
      if(p.name===person.name){
        throw new DuplicateError(`Player name must be unique to the game. a player named "${person.name}" already exists`);
      }
    }

  }

  private addPerson(
    player: Player,
    players: Player[],
  ) {

    this.validatePlayerNameUniqueness(player);

    if (!players.includes(player)) {
      players.push(player);
    }
    player.gameid=this.id;
  }

  removeAllPlayers() {
    for(let player of this.players){
      player.id = undefined;
    }
    this.players = [];
  }

  removePlayer(player: Player): void {
    this.removePerson(player, this.players);
  }

  private removePerson(player: Player, players: Player[]) {
    const index = this.findPlayerIndex(player, players);
    if (index > -1) {
      players.splice(index, 1);
    }
    player.gameid = undefined;
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
    this.addPerson(player, this.spectators);
  }

  removeAllSpectators() {
    for(let player of this.spectators){
      player.id = undefined;
    }
    this.spectators = [];
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
