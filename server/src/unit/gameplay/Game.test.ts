import Game from "../../main/gameplay/Game";
import Player from "../../main/gameplay/Player";

describe("Playing the game", () => {
  it("Errors out if no players are specified", () => {
    expect(() => {
      // @ts-ignore
      new Game();
    }).toThrow(new Error("Select 2-6 players"));
  });

  describe("Two Player Game", () => {
    const players: Player[] = [new Player("Ricky"), new Player("Bobby")];

    const game: Game = new Game(players);

    it("Game has two players", () => {
      expect(game.players.length).toEqual(2);
    });

    it("Each player has 30 cards in their stock pile", () => {
      expect(game.players[0].stockpile.length).toEqual(30);
      expect(game.players[1].stockpile.length).toEqual(30);
    });

    it("Each player has 0 cards in their hand", () => {
      expect(game.players[0].hand.length).toEqual(0);
      expect(game.players[1].hand.length).toEqual(0);
    });

    it("Each player has 0 cards in each discard pile", () => {
      for (let i = 0; i < game.players.length; i++) {
        for (let j = 0; j < 4; j++) {
          expect(game.players[i].discardPiles[j].length).toEqual(0);
        }
      }
    });

    it("There are 4 building piles with 0 cards in each", () => {
      for (let i = 0; i < 4; i++) {
        expect(game.buildingPiles[i].length).toEqual(0);
      }
    });

    it("The leader is: Tie between Ricky and Bobby", () => {
      expect(game.leader()).toEqual("Tie: Ricky, Bobby");
    });
  });
});
