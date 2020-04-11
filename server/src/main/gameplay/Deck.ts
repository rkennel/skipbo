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

  dealStockpiles(numberOfPlayers: number): Card[][] {
    function determineNumberOfCardsPerPlayer(numberOfPlayers: number) {
      if (numberOfPlayers < 5) {
        return 30;
      } else {
        return 20;
      }
    }

    if (numberOfPlayers < 2 || numberOfPlayers > 6) {
      throw new Error("Select 2-6 players");
    }

    this.shuffle();

    const stockPiles: Card[][] = [];
    for (let i = 0; i < numberOfPlayers; i++) {
      stockPiles[i] = [];
    }

    const numberOfCardsToDeal: number =
      numberOfPlayers * determineNumberOfCardsPerPlayer(numberOfPlayers);

    for (let i = 0; i < numberOfCardsToDeal; i++) {
      const playerToDealToIndex = i % numberOfPlayers;
      stockPiles[playerToDealToIndex].push(this.cards[i]);
    }

    this.cards.splice(0, numberOfCardsToDeal);

    return stockPiles;
  }

  dealNextCard(): Card {
    if (this.cards.length === 0) {
      throw new Error("Deck is out of gameplay");
    }

    const card: Card = this.cards[0];

    this.cards.splice(0, 1);

    return card;
  }

  numberOfCardsRemaining(): number {
    return this.cards.length;
  }
}
