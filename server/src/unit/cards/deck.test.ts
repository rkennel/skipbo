import Deck from "../../main/cards/Deck";
import { Card } from "../../main/cards/Card";

function numberOfCards(deck: Deck, cardType: Card) {
  let count = 0;
  for (let card of deck.cards) {
    if (card === cardType) {
      count++;
    }
  }

  return count;
}

describe("Card Deck Functionality", () => {
  describe("Starting a new game", () => {
    it("The Deck has 162 cards before any of them are dealt", () => {
      const deck: Deck = new Deck();
      expect(deck.cards.length).toEqual(162);
    });

    it("The deck should have exactly 12 ONE cards", () => {
      const deck: Deck = new Deck();
      expect(numberOfCards(deck, Card.ONE)).toEqual(12);
    });

    it("The deck should have exactly 12 TWO cards", () => {
      const deck: Deck = new Deck();
      expect(numberOfCards(deck, Card.TWO)).toEqual(12);
    });

    it("The deck should have exactly 12 THREE cards", () => {
      const deck: Deck = new Deck();
      expect(numberOfCards(deck, Card.THREE)).toEqual(12);
    });
    it("The deck should have exactly 12 FOUR cards", () => {
      const deck: Deck = new Deck();
      expect(numberOfCards(deck, Card.FOUR)).toEqual(12);
    });
    it("The deck should have exactly 12 FIVE cards", () => {
      const deck: Deck = new Deck();
      expect(numberOfCards(deck, Card.FIVE)).toEqual(12);
    });
    it("The deck should have exactly 12 SIX cards", () => {
      const deck: Deck = new Deck();
      expect(numberOfCards(deck, Card.SIX)).toEqual(12);
    });
    it("The deck should have exactly 12 SEVEN cards", () => {
      const deck: Deck = new Deck();
      expect(numberOfCards(deck, Card.SEVEN)).toEqual(12);
    });
    it("The deck should have exactly 12 EIGHT cards", () => {
      const deck: Deck = new Deck();
      expect(numberOfCards(deck, Card.EIGHT)).toEqual(12);
    });
    it("The deck should have exactly 12 NINE cards", () => {
      const deck: Deck = new Deck();
      expect(numberOfCards(deck, Card.NINE)).toEqual(12);
    });
    it("The deck should have exactly 12 TEN cards", () => {
      const deck: Deck = new Deck();
      expect(numberOfCards(deck, Card.TEN)).toEqual(12);
    });
    it("The deck should have exactly 12 ELEVEN cards", () => {
      const deck: Deck = new Deck();
      expect(numberOfCards(deck, Card.ELEVEN)).toEqual(12);
    });
    it("The deck should have exactly 12 TWELVE cards", () => {
      const deck: Deck = new Deck();
      expect(numberOfCards(deck, Card.TWELVE)).toEqual(12);
    });
    it("The deck should have exactly 18 SKIP_BO cards", () => {
      const deck: Deck = new Deck();
      expect(numberOfCards(deck, Card.SKIP_BO)).toEqual(18);
    });
  });
});
