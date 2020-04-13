import Game from "../../main/game/Game";
import Player from "../../main/player/Player";
import {clearAllEntities} from "../common/EntityUtils";

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

  describe("adding and removing players from the game", () => {
    describe("Active Players", () => {

      it("When player is added to the game, the game id is automatically assigned",()=>{
        const game = new Game();
        const player = new Player("Alan");

        game.addPlayer(player);

        expect(player.gameid).toEqual(game.id);
      });

      it("Throws an error if more than 6 players are added to the game", () => {
        const game = new Game();
        game.addPlayer(new Player("Ross"));
        game.addPlayer(new Player("Chandler"));
        game.addPlayer(new Player("Joey"));
        game.addPlayer(new Player("Monica"));
        game.addPlayer(new Player("Phoebe"));
        game.addPlayer(new Player("Rachel"));

        expect(() => {
          game.addPlayer(new Player("Gunther"));
        }).toThrow(new Error("Maximum of 6 players is allowed"));
      });

      it("If player already in the game is added then there is no effect", () => {
        const game = new Game();
        const player = new Player("MJ");

        game.addPlayer(player);
        game.addPlayer(player);

        expect(game.players.length).toEqual(1);
        expect(game.players.includes(player)).toBe(true);
      });

      it("If player was in the spectator group then remove player from the spectator group", () => {
        const game = new Game();
        const player = new Player("MJ");

        game.addSpectator(player);
        game.addPlayer(player);

        expect(game.players.length).toEqual(1);
        expect(game.players.includes(player)).toBe(true);
        expect(game.spectators.length).toEqual(0);
        expect(game.spectators.includes(player)).toBe(false);
      });

      it("Removing player results in the player no longer being in the active player group", () => {
        const game = new Game();
        const player = new Player("MJ");

        game.addPlayer(player);
        game.removePlayer(player);

        expect(game.players.length).toEqual(0);
        expect(game.players.includes(player)).toBe(false);
      });

      it("Removing player results in the game id being set to undefined", () => {
        const game = new Game();
        const player = new Player("MJ");

        game.addPlayer(player);
        game.removePlayer(player);

        expect(player.gameid).toBeUndefined();
      });


      it("Removing player not in the game has no effect", () => {
        const game = new Game();
        const player = new Player("MJ");
        const player2 = new Player("Mailman");

        game.addPlayer(player);
        game.removePlayer(player2);

        expect(game.players.length).toEqual(1);
        expect(game.players.includes(player)).toBe(true);
        expect(game.players.includes(player2)).toBe(false);
      });
    });

    describe("Spectators", () => {

      it("When spectator is added to the game, the game id is automatically assigned",()=>{
        const game = new Game();
        const player = new Player("Alan");

        game.addSpectator(player);

        expect(player.gameid).toEqual(game.id);
      });

      it("If player already a spectator is added then there is no effect", () => {
        const game = new Game();
        const player = new Player("Hastings");

        game.addSpectator(player);
        game.addSpectator(player);

        expect(game.spectators.length).toEqual(1);
        expect(game.spectators.includes(player)).toBe(true);
      });

      it("If player was in the game then remove player from the game", () => {
        const game = new Game();
        const player = new Player("Hastings");

        game.addPlayer(player);
        game.addSpectator(player);

        expect(game.spectators.length).toEqual(1);
        expect(game.spectators.includes(player)).toBe(true);
        expect(game.players.length).toEqual(0);
        expect(game.players.includes(player)).toBe(false);
      });

      it("Removing spectator results in the player no longer being in the spectator group", () => {
        const game = new Game();
        const player = new Player("Hastings");

        game.addSpectator(player);
        game.removeSpectator(player);

        expect(game.spectators.length).toEqual(0);
        expect(game.spectators.includes(player)).toBe(false);
      });

      it("Removing spectator results in the game id being set to undefined", () => {
        const game = new Game();
        const player = new Player("Hastings");

        game.addPlayer(player);
        game.removeSpectator(player);

        expect(player.gameid).toBeUndefined();
      });

      it("Removing spectator not spectating has no effect", () => {
        const game = new Game();
        const player = new Player("Laimbeer");
        const player2 = new Player("Hastings");

        game.addPlayer(player);
        game.addSpectator(player2);

        game.removeSpectator(player);

        expect(game.spectators.length).toEqual(1);
        expect(game.spectators.includes(player)).toBe(false);
        expect(game.spectators.includes(player2)).toBe(true);
      });
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
      game.addPlayer(new Player("Ricky"));
      game.addPlayer(new Player("Bobby"));
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
