import { Card } from "./Card";
import Entity from "./Entity";
import {generateUniqueId} from "./UniqueIdGenerator";

export default abstract class Person implements Entity{

  id: string;
  name: string;
  gameid?: string;

  entityName = "#####INSERT ENTITY NAME HERE#####";

  constructor(name: string="marty") {
    this.name = name;
    this.id = generateUniqueId();
  }

}


