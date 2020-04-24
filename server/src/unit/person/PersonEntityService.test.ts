import EntityServiceFactory from "../../main/entity/EntityServiceFactory";
import EntityService from "../../main/entity/EntityService";
import { clearAllEntities } from "../entity/EntityUtils";
import PlayerEntityService from "../../main/person/PlayerEntityService";
import { Game, Player } from "skipbo-common";
import GameEntityService from "../../main/game/GameEntityService";

describe("Person Entity Service", () => {
  const gameEntityService: EntityService<Game> = EntityServiceFactory.getEntityService(
    Game.ENTITY_NAME
  ) as GameEntityService;

  let game: Game,
    player: Player,
    player2: Player,
    gameId: string,
    playerId: string,
    playerEntityService: PlayerEntityService;

  describe("Deleting a player", () => {
    beforeAll(() => {
      clearAllEntities();

      game = gameEntityService.createNew();

      player = createPlayer(game, "MJ");
      player2 = createPlayer(game, "Scottie");

      playerId = player.id;
      gameId = game.id;

      playerEntityService = <PlayerEntityService>(
        EntityServiceFactory.getEntityService(Player.ENTITY_NAME)
      );
      playerEntityService.deleteById(playerId);
    });

    it("removes the player", () => {
      expect(playerEntityService.getById(playerId)).toBeUndefined();
    });

    it("removes the player from the game", () => {
      // @ts-ignore
      expect(gameEntityService.getById(gameId).players.length).toEqual(1);
    });
  });

  describe("Deleting all players", () => {
    let player2Id: string;

    beforeAll(() => {
      clearAllEntities();

      game = gameEntityService.createNew();

      player = createPlayer(game, "MJ");
      player2 = createPlayer(game, "Scottie");

      playerId = player.id;
      player2Id = player2.id;
      gameId = game.id;

      playerEntityService = <PlayerEntityService>(
        EntityServiceFactory.getEntityService(Player.ENTITY_NAME)
      );
      playerEntityService.deleteAll();
    });

    it("removes all players", () => {
      expect(playerEntityService.getById(playerId)).toBeUndefined();
      expect(playerEntityService.getById(player2Id)).toBeUndefined();
    });

    it("removes all players from the game", () => {
      // @ts-ignore
      expect(gameEntityService.getById(gameId).players.length).toEqual(0);
    });
  });
});

function createPlayer(game: Game, name: string): Player {
  const playerEntityService = <PlayerEntityService>(
    EntityServiceFactory.getEntityService(Player.ENTITY_NAME)
  );
  const player = new Player(name);
  player.gameid = game.id;
  return playerEntityService.createNew(player);
}
