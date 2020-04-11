import Deck from "../../main/gameplay/Deck";
import { Card } from "../../main/gameplay/Card";
import { cloneDeep } from "lodash";

describe("Card Deck Functionality", () => {
  describe("Fresh deck", () => {
    const deck: Deck = new Deck();
    validateAllCards(deck.cards);
  });

  describe("Shuffling a deck", () => {
    it("The gameplay should be in a different order than they previously were", () => {
      const deck: Deck = new Deck();

      const deckBefore = cloneDeep(deck);

      deck.shuffle();

      expect(deck.cards).not.toEqual(deckBefore.cards);
    });
  });

  describe("Dealing stockpile gameplay to players", () => {
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

      it("Shuffles the gameplay", () => {
        expect(shuffleSpy).toHaveBeenCalled();
      });

      it("Deals gameplay for two players", () => {
        expect(playersHands.length).toEqual(2);
      });

      it("Player 1 gets 30 gameplay", () => {
        expect(playersHands[0].length).toEqual(30);
      });

      it("Player 2 gets 30 gameplay", () => {
        expect(playersHands[1].length).toEqual(30);
      });

      it("The deck only has 102 gameplay left", () => {
        expect(deck.cards.length).toEqual(102);
      });

      describe("Combined gameplay across players stock pile and deck is 162 12 of each number card and 18 skip-bo gameplay", () => {
        const allCards: Card[] = combineDeckAndPlayersHands(deck, playersHands);
        validateAllCards(allCards);
      });
    });

    describe("Three players", () => {
      const deck: Deck = new Deck();
      const shuffleSpy = jest.spyOn(deck, "shuffle");

      const playersHands: Card[][] = deck.dealStockpiles(3);

      it("Shuffles the gameplay", () => {
        expect(shuffleSpy).toHaveBeenCalled();
      });

      it("Deals gameplay for three players", () => {
        expect(playersHands.length).toEqual(3);
      });

      it("Player 1 gets 30 gameplay", () => {
        expect(playersHands[0].length).toEqual(30);
      });

      it("Player 2 gets 30 gameplay", () => {
        expect(playersHands[1].length).toEqual(30);
      });

      it("Player 3 gets 30 gameplay", () => {
        expect(playersHands[2].length).toEqual(30);
      });

      it("The deck only has 72 gameplay left", () => {
        expect(deck.cards.length).toEqual(72);
      });

      describe("Combined gameplay across players stock pile and deck is 162 12 of each number card and 18 skip-bo gameplay", () => {
        const allCards: Card[] = combineDeckAndPlayersHands(deck, playersHands);
        validateAllCards(allCards);
      });
    });

    describe("Four players", () => {
      const deck: Deck = new Deck();
      const shuffleSpy = jest.spyOn(deck, "shuffle");

      const playersHands: Card[][] = deck.dealStockpiles(4);

      it("Shuffles the gameplay", () => {
        expect(shuffleSpy).toHaveBeenCalled();
      });

      it("Deals gameplay for four players", () => {
        expect(playersHands.length).toEqual(4);
      });

      it("Player 1 gets 30 gameplay", () => {
        expect(playersHands[0].length).toEqual(30);
      });

      it("Player 2 gets 30 gameplay", () => {
        expect(playersHands[1].length).toEqual(30);
      });

      it("Player 3 gets 30 gameplay", () => {
        expect(playersHands[2].length).toEqual(30);
      });

      it("Player 4 gets 30 gameplay", () => {
        expect(playersHands[3].length).toEqual(30);
      });

      it("The deck only has 72 gameplay left", () => {
        expect(deck.cards.length).toEqual(42);
      });

      describe("Combined gameplay across players stock pile and deck is 162 12 of each number card and 18 skip-bo gameplay", () => {
        const allCards: Card[] = combineDeckAndPlayersHands(deck, playersHands);
        validateAllCards(allCards);
      });
    });

    describe("Five players", () => {
      const deck: Deck = new Deck();
      const shuffleSpy = jest.spyOn(deck, "shuffle");

      const playersHands: Card[][] = deck.dealStockpiles(5);

      it("Shuffles the gameplay", () => {
        expect(shuffleSpy).toHaveBeenCalled();
      });

      it("Deals gameplay for five players", () => {
        expect(playersHands.length).toEqual(5);
      });

      it("Player 1 gets 20 gameplay", () => {
        expect(playersHands[0].length).toEqual(20);
      });

      it("Player 2 gets 20 gameplay", () => {
        expect(playersHands[1].length).toEqual(20);
      });

      it("Player 3 gets 20 gameplay", () => {
        expect(playersHands[2].length).toEqual(20);
      });

      it("Player 4 gets 20 gameplay", () => {
        expect(playersHands[3].length).toEqual(20);
      });

      it("Player 5 gets 20 gameplay", () => {
        expect(playersHands[4].length).toEqual(20);
      });

      it("The deck only has 62 gameplay left", () => {
        expect(deck.cards.length).toEqual(62);
      });

      describe("Combined gameplay across players stock pile and deck is 162 12 of each number card and 18 skip-bo gameplay", () => {
        const allCards: Card[] = combineDeckAndPlayersHands(deck, playersHands);
        validateAllCards(allCards);
      });
    });

    describe("Six players", () => {
      const deck: Deck = new Deck();
      const shuffleSpy = jest.spyOn(deck, "shuffle");

      const playersHands: Card[][] = deck.dealStockpiles(6);

      it("Shuffles the gameplay", () => {
        expect(shuffleSpy).toHaveBeenCalled();
      });

      it("Deals gameplay for six players", () => {
        expect(playersHands.length).toEqual(6);
      });

      it("Player 1 gets 20 gameplay", () => {
        expect(playersHands[0].length).toEqual(20);
      });

      it("Player 2 gets 20 gameplay", () => {
        expect(playersHands[1].length).toEqual(20);
      });

      it("Player 3 gets 20 gameplay", () => {
        expect(playersHands[2].length).toEqual(20);
      });

      it("Player 4 gets 20 gameplay", () => {
        expect(playersHands[3].length).toEqual(20);
      });

      it("Player 5 gets 20 gameplay", () => {
        expect(playersHands[4].length).toEqual(20);
      });

      it("Player 6 gets 20 gameplay", () => {
        expect(playersHands[5].length).toEqual(20);
      });

      it("The deck only has 42 gameplay left", () => {
        expect(deck.cards.length).toEqual(42);
      });

      describe("Combined gameplay across players stock pile and deck is 162 12 of each number card and 18 skip-bo gameplay", () => {
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

    it("Provides an accurate count of gameplay remaining", () => {
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

    describe("If no gameplay remain, then it throws an exception", () => {
      const deck: Deck = new Deck();
      deck.cards = [];

      expect(() => {
        deck.dealNextCard();
      }).toThrow(new Error("Deck is out of gameplay"));
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

  it("There are 162 total gameplay", () => {
    expect(cards.length).toEqual(162);
  });

  it("There are exactly 12 ONE gameplay", () => {
    expect(numberOfCards(cards, Card.ONE)).toEqual(12);
  });

  it("There are exactly 12 TWO gameplay", () => {
    expect(numberOfCards(cards, Card.TWO)).toEqual(12);
  });

  it("There are exactly 12 THREE gameplay", () => {
    expect(numberOfCards(cards, Card.THREE)).toEqual(12);
  });

  it("There are exactly 12 FOUR gameplay", () => {
    expect(numberOfCards(cards, Card.FOUR)).toEqual(12);
  });

  it("There are exactly 12 FIVE gameplay", () => {
    expect(numberOfCards(cards, Card.FIVE)).toEqual(12);
  });

  it("There are exactly 12 SIX gameplay", () => {
    expect(numberOfCards(cards, Card.SIX)).toEqual(12);
  });

  it("There are exactly 12 SEVEN gameplay", () => {
    expect(numberOfCards(cards, Card.SEVEN)).toEqual(12);
  });

  it("There are exactly 12 EIGHT gameplay", () => {
    expect(numberOfCards(cards, Card.EIGHT)).toEqual(12);
  });

  it("There are exactly 12 NINE gameplay", () => {
    expect(numberOfCards(cards, Card.NINE)).toEqual(12);
  });

  it("There are exactly 12 TEN gameplay", () => {
    expect(numberOfCards(cards, Card.TEN)).toEqual(12);
  });

  it("There are exactly 12 ELEVEN gameplay", () => {
    expect(numberOfCards(cards, Card.ELEVEN)).toEqual(12);
  });

  it("There are exactly 12 TWELVE gameplay", () => {
    expect(numberOfCards(cards, Card.TWELVE)).toEqual(12);
  });

  it("There are exactly 18 SKIP_BO gameplay", () => {
    expect(numberOfCards(cards, Card.SKIP_BO)).toEqual(18);
  });
}
