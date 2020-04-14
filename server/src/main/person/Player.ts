import { Card } from "../gameplay/Card";
import Entity from "../entity/Entity";
import {generateUniqueId} from "../entity/UniqueIdGenerator";
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


