import { Card } from "./Card";
import Entity from "./Entity";
import {generateUniqueId} from "./UniqueIdGenerator";
import Person from "./Person";

export default class Player extends Person {

  static ENTITY_NAME: string = "player";

  stockpile: Card[] = [];

  hand: Card[] = [];

  discardPiles: Card[][] = [[], [], [], []];

  constructor(name: string="marty") {
    super(name);
    this.entityName = Player.ENTITY_NAME;
  }

}


