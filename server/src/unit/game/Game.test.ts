import { Game, Player } from "skipbo-common";
import GameEntityService from "../../main/game/GameEntityService";
import EntityServiceFactory from "../../main/entity/EntityServiceFactory";

describe("Playing the game", () => {
  describe("Game Identifier", () => {
    it("Generates a unique identifier", () => {
      const game = new Game();
      expect(game.id).toBeDefined();
    });

    it("The identifier is 8 characters long", () => {
      const game = new Game();
      expect(game.id.length).toEqual(8);
    });

    it("Generates a new id each time", () => {
      const games = [
        new Game(),
        new Game(),
        new Game(),
        new Game(),
        new Game(),
        new Game(),
        new Game(),
        new Game(),
        new Game(),
        new Game()
      ];

      validateEachIdWasCreatedOnlyOnce();

      function validateEachIdWasCreatedOnlyOnce() {
        for (let i = 0; i < games.length; i++) {
          let count = 0;
          for (let j = 0; j < games.length; j++) {
            if (games[i].id === games[j].id) {
              count++;
            }
          }

          expect(count).toEqual(1);
        }
      }
    });
  });

  describe("starting the game", () => {
    it("Errors out if no players are specified", () => {
      expect(() => {
        // @ts-ignore
        new Game().start();
      }).toThrow(new Error("Select 2-6 players"));
    });

    describe("Two Player Game", () => {
      const game: Game = new Game();
      addPlayerToGame(game, new Player("Ricky"));
      addPlayerToGame(game, new Player("Bobby"));
      game.start();

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
});

function addPlayerToGame(game: Game, player: Player) {
  const gameEntityService: GameEntityService = <GameEntityService>(
    EntityServiceFactory.getEntityService(Game.ENTITY_NAME)
  );
  gameEntityService.addPlayer(game, player);
}
