import { isEqual } from "lodash";
import {DuplicateError} from "../common/Errors";
import {Deck, Entity, generateUniqueId, Person, Player, Spectator} from "skipbo-common";
import {Card} from "skipbo-common/build/entities/Card";

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

  private validatePersonNameUniqueness(person: Person) {
    const people = this.players.concat(this.spectators);

    for(let p of people){
      if(p.name===person.name){
        throw new DuplicateError(`Player name must be unique to the game. a player named "${person.name}" already exists`);
      }
    }

  }

  private addPerson(
    person: Person,
    persons: Person[],
  ) {

    this.validatePersonNameUniqueness(person);

    if (!persons.includes(person)) {
      persons.push(person);
    }
    person.gameid=this.id;
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

  private removePerson(person: Person, persons: Person[]) {
    const index = this.findPlayerIndex(person, persons);
    if (index > -1) {
      persons.splice(index, 1);
    }
    person.gameid = undefined;
  }

  private findPlayerIndex(person: Person, persons: Person[]): number {
    for (let i = 0; i < persons.length; i++) {
      if (isEqual(person, persons[i])) {
        return i;
      }
    }

    return -1;
  }

  addSpectator(spectator: Spectator): void {
    this.addPerson(spectator, this.spectators);
  }

  removeAllSpectators() {
    for(let spectator of this.spectators){
      spectator.id = undefined;
    }

    this.spectators = [];
  }

  removeSpectator(spectator: Spectator) {
    this.removePerson(spectator, this.spectators);
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
