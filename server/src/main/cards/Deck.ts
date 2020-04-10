import { Card } from "./Card";

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
}
