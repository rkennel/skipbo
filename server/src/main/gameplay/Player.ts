import { Card } from "./Card";

export default class Player {

  name: string;

  stockpile: Card[] = [];

  hand: Card[] = [];

  discardPiles: Card[][] = [[], [], [], []];

  constructor(name: string) {
    this.name = name;
  }

}
