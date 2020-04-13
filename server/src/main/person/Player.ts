import { Card } from "../gameplay/Card";
import Entity from "../entity/Entity";
import {generateUniqueId} from "../entity/UniqueIdGenerator";

export default class Player implements Entity{

  static ENTITY_NAME: string = "player";

  id: string;
  name: string;
  gameid: string;

  entityName = "player";

  stockpile: Card[] = [];

  hand: Card[] = [];

  discardPiles: Card[][] = [[], [], [], []];

  constructor(name: string="marty") {
    this.name = name;
    this.id = generateUniqueId();
  }

}


