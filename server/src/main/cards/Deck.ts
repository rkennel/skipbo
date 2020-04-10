import { Card } from "./Card";
import { cloneDeep } from "lodash";

export default class Deck {
  cards: Card[] = [];

  constructor() {
    this.addCardsToDeck(Card.ONE, 12);
    this.addCardsToDeck(Card.TWO, 12);
    this.addCardsToDeck(Card.THREE, 12);
    this.addCardsToDeck(Card.FOUR, 12);
    this.addCardsToDeck(Card.FIVE, 12);
    this.addCardsToDeck(Card.SIX, 12);
    this.addCardsToDeck(Card.SEVEN, 12);
    this.addCardsToDeck(Card.EIGHT, 12);
    this.addCardsToDeck(Card.NINE, 12);
    this.addCardsToDeck(Card.TEN, 12);
    this.addCardsToDeck(Card.ELEVEN, 12);
    this.addCardsToDeck(Card.TWELVE, 12);
    this.addCardsToDeck(Card.SKIP_BO, 18);
  }

  addCardsToDeck(cardType: Card, numberOfCards: number) {
    for (let i = 0; i < numberOfCards; i++) {
      this.cards.push(cardType);
    }
  }

  printCards() {
    let output: string = "";
    for (let i = 0; i < this.cards.length; i++) {
      output = output + `${i}: ${this.cards[i]}\n`;
    }
    console.log(output);
  }

  shuffle() {
    const clonedCards = cloneDeep(this.cards);
    const newCards: Card[] = [];

    while (clonedCards.length > 0) {
      const randomIndex: number = Math.floor(
        Math.random() * clonedCards.length
      );
      newCards.push(clonedCards[randomIndex]);
      clonedCards.splice(randomIndex, 1);
    }

    this.cards = newCards;
  }
}
