import { cloneDeep } from "lodash";
import { Card, Deck } from "skipbo-common";

describe("Card Deck Functionality", () => {
  describe("Fresh deck", () => {
    const deck: Deck = new Deck();
    validateAllCards(deck.cards);
  });

  describe("Shuffling a deck", () => {
    it("The deck should be in a different order than they previously were", () => {
      const deck: Deck = new Deck();

      const deckBefore = cloneDeep(deck);

      deck.shuffle();

      expect(deck.cards).not.toEqual(deckBefore.cards);
    });
  });

  describe("Dealing stockpile to players", () => {
    describe("Validating the number of players", () => {
      it("does not allow one player", () => {
        const deck: Deck = new Deck();
        expect(() => {
          deck.dealStockpiles(1);
        }).toThrow(new Error("Select 2-6 players"));
      });

      it("does not allow more than six players", () => {
        const deck: Deck = new Deck();
        expect(() => {
          deck.dealStockpiles(7);
        }).toThrow(new Error("Select 2-6 players"));
      });
    });

    describe("Two players", () => {
      const deck: Deck = new Deck();
      const shuffleSpy = jest.spyOn(deck, "shuffle");

      const playersHands: Card[][] = deck.dealStockpiles(2);

      it("Shuffles the deck", () => {
        expect(shuffleSpy).toHaveBeenCalled();
      });

      it("Deals stockpile for two players", () => {
        expect(playersHands.length).toEqual(2);
      });

      it("Player 1 gets 30 cards", () => {
        expect(playersHands[0].length).toEqual(30);
      });

      it("Player 2 gets 30 cards", () => {
        expect(playersHands[1].length).toEqual(30);
      });

      it("The deck only has 102 cards left", () => {
        expect(deck.cards.length).toEqual(102);
      });

      describe("Combined cards across players stock pile and deck is 162 12 of each number card and 18 skip-bo gameplay", () => {
        const allCards: Card[] = combineDeckAndPlayersHands(deck, playersHands);
        validateAllCards(allCards);
      });
    });

    describe("Three players", () => {
      const deck: Deck = new Deck();
      const shuffleSpy = jest.spyOn(deck, "shuffle");

      const playersHands: Card[][] = deck.dealStockpiles(3);

      it("Shuffles the cards", () => {
        expect(shuffleSpy).toHaveBeenCalled();
      });

      it("Deals cards for three players", () => {
        expect(playersHands.length).toEqual(3);
      });

      it("Player 1 gets 30 cards", () => {
        expect(playersHands[0].length).toEqual(30);
      });

      it("Player 2 gets 30 cards", () => {
        expect(playersHands[1].length).toEqual(30);
      });

      it("Player 3 gets 30 cards", () => {
        expect(playersHands[2].length).toEqual(30);
      });

      it("The deck only has 72 cards left", () => {
        expect(deck.cards.length).toEqual(72);
      });

      describe("Combined cards across players stock pile and deck is 162 12 of each number card and 18 skip-bo cards", () => {
        const allCards: Card[] = combineDeckAndPlayersHands(deck, playersHands);
        validateAllCards(allCards);
      });
    });

    describe("Four players", () => {
      const deck: Deck = new Deck();
      const shuffleSpy = jest.spyOn(deck, "shuffle");

      const playersHands: Card[][] = deck.dealStockpiles(4);

      it("Shuffles the cards", () => {
        expect(shuffleSpy).toHaveBeenCalled();
      });

      it("Deals cards for four players", () => {
        expect(playersHands.length).toEqual(4);
      });

      it("Player 1 gets 30 cards", () => {
        expect(playersHands[0].length).toEqual(30);
      });

      it("Player 2 gets 30 cards", () => {
        expect(playersHands[1].length).toEqual(30);
      });

      it("Player 3 gets 30 cards", () => {
        expect(playersHands[2].length).toEqual(30);
      });

      it("Player 4 gets 30 cards", () => {
        expect(playersHands[3].length).toEqual(30);
      });

      it("The deck only has 72 cards left", () => {
        expect(deck.cards.length).toEqual(42);
      });

      describe("Combined cards across players stock pile and deck is 162 12 of each number card and 18 skip-bo cards", () => {
        const allCards: Card[] = combineDeckAndPlayersHands(deck, playersHands);
        validateAllCards(allCards);
      });
    });

    describe("Five players", () => {
      const deck: Deck = new Deck();
      const shuffleSpy = jest.spyOn(deck, "shuffle");

      const playersHands: Card[][] = deck.dealStockpiles(5);

      it("Shuffles the cards", () => {
        expect(shuffleSpy).toHaveBeenCalled();
      });

      it("Deals cards for five players", () => {
        expect(playersHands.length).toEqual(5);
      });

      it("Player 1 gets 20 cards", () => {
        expect(playersHands[0].length).toEqual(20);
      });

      it("Player 2 gets 20 cards", () => {
        expect(playersHands[1].length).toEqual(20);
      });

      it("Player 3 gets 20 cards", () => {
        expect(playersHands[2].length).toEqual(20);
      });

      it("Player 4 gets 20 cards", () => {
        expect(playersHands[3].length).toEqual(20);
      });

      it("Player 5 gets 20 cards", () => {
        expect(playersHands[4].length).toEqual(20);
      });

      it("The deck only has 62 cards left", () => {
        expect(deck.cards.length).toEqual(62);
      });

      describe("Combined cards across players stock pile and deck is 162 12 of each number card and 18 skip-bo cards", () => {
        const allCards: Card[] = combineDeckAndPlayersHands(deck, playersHands);
        validateAllCards(allCards);
      });
    });

    describe("Six players", () => {
      const deck: Deck = new Deck();
      const shuffleSpy = jest.spyOn(deck, "shuffle");

      const playersHands: Card[][] = deck.dealStockpiles(6);

      it("Shuffles the cards", () => {
        expect(shuffleSpy).toHaveBeenCalled();
      });

      it("Deals cards for six players", () => {
        expect(playersHands.length).toEqual(6);
      });

      it("Player 1 gets 20 cards", () => {
        expect(playersHands[0].length).toEqual(20);
      });

      it("Player 2 gets 20 cards", () => {
        expect(playersHands[1].length).toEqual(20);
      });

      it("Player 3 gets 20 cards", () => {
        expect(playersHands[2].length).toEqual(20);
      });

      it("Player 4 gets 20 cards", () => {
        expect(playersHands[3].length).toEqual(20);
      });

      it("Player 5 gets 20 cards", () => {
        expect(playersHands[4].length).toEqual(20);
      });

      it("Player 6 gets 20 cards", () => {
        expect(playersHands[5].length).toEqual(20);
      });

      it("The deck only has 42 cards left", () => {
        expect(deck.cards.length).toEqual(42);
      });

      describe("Combined cards across players stock pile and deck is 162 12 of each number card and 18 skip-bo cards", () => {
        const allCards: Card[] = combineDeckAndPlayersHands(deck, playersHands);
        validateAllCards(allCards);
      });
    });
  });

  describe("Grab the next Card", () => {
    it("provides the next card in the pile", () => {
      const deck: Deck = new Deck();
      deck.dealStockpiles(6);

      const expectedCard = deck.cards[0];
      const actualCard = deck.dealNextCard();

      expect(actualCard).toEqual(expectedCard);
    });

    it("Provides an accurate count of cards remaining", () => {
      const deck: Deck = new Deck();
      deck.dealStockpiles(6);

      const numberOfCards = deck.cards.length;
      deck.dealNextCard();

      expect(deck.numberOfCardsRemaining()).toEqual(numberOfCards - 1);
    });

    describe("After dealing next card, full deck remains", () => {
      const deck: Deck = new Deck();
      const playersHands = deck.dealStockpiles(6);

      const card = deck.dealNextCard();
      playersHands[0].push(card);

      validateAllCards(combineDeckAndPlayersHands(deck, playersHands));
    });

    it("If no cards remain, then it throws an exception", () => {
      const deck: Deck = new Deck();
      deck.cards = [];

      expect(() => {
        deck.dealNextCard();
      }).toThrow(new Error("Deck is out of cards"));
    });
  });
});

function combineDeckAndPlayersHands(
  deck: Deck,
  playersHands: Card[][]
): Card[] {
  let combined = deck.cards;
  for (let i = 0; i < playersHands.length; i++) {
    combined = combined.concat(playersHands[i]);
  }

  return combined;
}

function validateAllCards(cards: Card[]): void {
  function numberOfCards(cards: Card[], cardType: Card): number {
    let count = 0;
    for (let card of cards) {
      if (card === cardType) {
        count++;
      }
    }

    return count;
  }

  it("There are 162 total cards", () => {
    expect(cards.length).toEqual(162);
  });

  it("There are exactly 12 ONE cards", () => {
    expect(numberOfCards(cards, Card.ONE)).toEqual(12);
  });

  it("There are exactly 12 TWO cards", () => {
    expect(numberOfCards(cards, Card.TWO)).toEqual(12);
  });

  it("There are exactly 12 THREE cards", () => {
    expect(numberOfCards(cards, Card.THREE)).toEqual(12);
  });

  it("There are exactly 12 FOUR cards", () => {
    expect(numberOfCards(cards, Card.FOUR)).toEqual(12);
  });

  it("There are exactly 12 FIVE cards", () => {
    expect(numberOfCards(cards, Card.FIVE)).toEqual(12);
  });

  it("There are exactly 12 SIX cards", () => {
    expect(numberOfCards(cards, Card.SIX)).toEqual(12);
  });

  it("There are exactly 12 SEVEN cards", () => {
    expect(numberOfCards(cards, Card.SEVEN)).toEqual(12);
  });

  it("There are exactly 12 EIGHT cards", () => {
    expect(numberOfCards(cards, Card.EIGHT)).toEqual(12);
  });

  it("There are exactly 12 NINE cards", () => {
    expect(numberOfCards(cards, Card.NINE)).toEqual(12);
  });

  it("There are exactly 12 TEN cards", () => {
    expect(numberOfCards(cards, Card.TEN)).toEqual(12);
  });

  it("There are exactly 12 ELEVEN cards", () => {
    expect(numberOfCards(cards, Card.ELEVEN)).toEqual(12);
  });

  it("There are exactly 12 TWELVE cards", () => {
    expect(numberOfCards(cards, Card.TWELVE)).toEqual(12);
  });

  it("There are exactly 18 SKIP_BO gameplay", () => {
    expect(numberOfCards(cards, Card.SKIP_BO)).toEqual(18);
  });
}
