import { Card } from "../gameplay/Card";
import Entity from "../common/Entity";
import {generateUniqueId} from "../common/UniqueIdGenerator";

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


