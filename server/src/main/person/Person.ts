import { Card } from "../gameplay/Card";
import Entity from "../entity/Entity";
import {generateUniqueId} from "../entity/UniqueIdGenerator";

export default abstract class Person implements Entity{

  id: string;
  name: string;
  gameid: string;

  entityName = "#####INSERT ENTITY NAME HERE#####";

  constructor(name: string="marty") {
    this.name = name;
    this.id = generateUniqueId();
  }

}


