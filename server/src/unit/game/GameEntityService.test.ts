import { DuplicateError } from "../../main/common/Errors";
import { Game, Player, Spectator } from "skipbo-common";
import GameEntityService from "../../main/game/GameEntityService";

describe("Playing the game", () => {
  const service: GameEntityService = new GameEntityService();

  describe("adding and removing players from the game", () => {
    describe("Active Players", () => {
      it("When player is added to the game, the game id is automatically assigned", () => {
        const game = new Game();
        const player = new Player("Alan");

        service.addPlayer(game, player);

        expect(player.gameid).toEqual(game.id);
      });

      it("Throws an error if more than 6 players are added to the game", () => {
        const game = new Game();
        service.addPlayer(game, new Player("Ross"));
        service.addPlayer(game, new Player("Chandler"));
        service.addPlayer(game, new Player("Joey"));
        service.addPlayer(game, new Player("Monica"));
        service.addPlayer(game, new Player("Phoebe"));
        service.addPlayer(game, new Player("Rachel"));

        expect(() => {
          service.addPlayer(game, new Player("Gunther"));
        }).toThrow(new Error("Maximum of 6 players is allowed"));
      });

      it("If player already in the game is added then throw duplicate player error", () => {
        const game = new Game();
        const player = new Player("MJ");

        service.addPlayer(game, player);

        expect(() => {
          service.addPlayer(game, player);
        }).toThrow(
          new DuplicateError(
            `Player name must be unique to the game. a player named "${player.name}" already exists`
          )
        );
      });

      it("If player is in the spectator group then throw error when trying to add to player group", () => {
        const game = new Game();
        const player = new Player("MJ");

        service.addSpectator(game, player);

        expect(() => {
          service.addPlayer(game, player);
        }).toThrow(
          new DuplicateError(
            `Player name must be unique to the game. a player named "${player.name}" already exists`
          )
        );
      });

      it("Removing player results in the player no longer being in the active player group", () => {
        const game = new Game();
        const player = new Player("MJ");

        service.addPlayer(game, player);
        service.removePlayer(game, player);

        expect(game.players.length).toEqual(0);
        expect(game.players.includes(player)).toBe(false);
      });

      it("Removing player results in the game id being set to undefined", () => {
        const game = new Game();
        const player = new Player("MJ");

        service.addPlayer(game, player);
        service.removePlayer(game, player);

        expect(player.gameid).toBeUndefined();
      });

      it("Removing player not in the game has no effect", () => {
        const game = new Game();
        const player = new Player("MJ");
        const player2 = new Player("Mailman");

        service.addPlayer(game, player);
        service.removePlayer(game, player2);

        expect(game.players.length).toEqual(1);
        expect(game.players.includes(player)).toBe(true);
        expect(game.players.includes(player2)).toBe(false);
      });
    });

    describe("Spectators", () => {
      it("When spectator is added to the game, the game id is automatically assigned", () => {
        const game = new Game();
        const spectator = new Spectator("Hastings");

        service.addSpectator(game, spectator);

        expect(spectator.gameid).toEqual(game.id);
      });

      it("If player already a spectator then throw duplicate player exception", () => {
        const game = new Game();
        const spectator = new Spectator("Hastings");

        service.addSpectator(game, spectator);

        expect(() => {
          service.addSpectator(game, spectator);
        }).toThrow(
          new DuplicateError(
            `Player name must be unique to the game. a player named "${spectator.name}" already exists`
          )
        );
      });

      it("If player is in the game then throw duplicate player error", () => {
        const game = new Game();
        const player = new Player("Hastings");

        service.addPlayer(game, player);

        expect(() => {
          service.addSpectator(game, player);
        }).toThrow(
          new DuplicateError(
            `Player name must be unique to the game. a player named "${player.name}" already exists`
          )
        );
      });

      it("Removing spectator results in the player no longer being in the spectator group", () => {
        const game = new Game();
        const spectator = new Spectator("Hastings");

        service.addSpectator(game, spectator);
        service.removeSpectator(game, spectator);

        expect(game.spectators.length).toEqual(0);
        expect(game.spectators.includes(spectator)).toBe(false);
      });

      it("Removing spectator results in the game id being set to undefined", () => {
        const game = new Game();
        const spectator = new Spectator("Hastings");

        service.addSpectator(game, spectator);
        service.removeSpectator(game, spectator);

        expect(spectator.gameid).toBeUndefined();
      });

      it("Removing spectator not spectating has no effect", () => {
        const game = new Game();
        const spectator = new Spectator("Hastings");

        service.removeSpectator(game, spectator);

        expect(game.spectators.length).toEqual(0);
        expect(game.spectators.includes(spectator)).toBe(false);
      });
    });
  });

  // describe("starting the game", () => {
  //     it("Errors out if no players are specified", () => {
  //         expect(() => {
  //             // @ts-ignore
  //             new Game().start();
  //         }).toThrow(new Error("Select 2-6 players"));
  //     });
  //
  //     describe("Two Player Game", () => {
  //         const game: Game = new Game();
  //         game.addPlayer(new Player("Ricky"));
  //         game.addPlayer(new Player("Bobby"));
  //         game.start();
  //
  //         it("Game has two players", () => {
  //             expect(game.players.length).toEqual(2);
  //         });
  //
  //         it("Each player has 30 cards in their stock pile", () => {
  //             expect(game.players[0].stockpile.length).toEqual(30);
  //             expect(game.players[1].stockpile.length).toEqual(30);
  //         });
  //
  //         it("Each player has 0 cards in their hand", () => {
  //             expect(game.players[0].hand.length).toEqual(0);
  //             expect(game.players[1].hand.length).toEqual(0);
  //         });
  //
  //         it("Each player has 0 cards in each discard pile", () => {
  //             for (let i = 0; i < game.players.length; i++) {
  //                 for (let j = 0; j < 4; j++) {
  //                     expect(game.players[i].discardPiles[j].length).toEqual(0);
  //                 }
  //             }
  //         });
  //
  //         it("There are 4 building piles with 0 cards in each", () => {
  //             for (let i = 0; i < 4; i++) {
  //                 expect(game.buildingPiles[i].length).toEqual(0);
  //             }
  //         });
  //
  //         it("The leader is: Tie between Ricky and Bobby", () => {
  //             expect(game.leader()).toEqual("Tie: Ricky, Bobby");
  //         });
  //     });
  // });
});
