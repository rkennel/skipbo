import PersonEntityService from "./PersonEntityService";
import { isEqual } from "lodash";
import { Game, Player } from "skipbo-common";
import GameEntityService from "../game/GameEntityService";
import EntityServiceFactory from "../entity/EntityServiceFactory";

export default class PlayerEntityService extends PersonEntityService<Player> {
  constructor() {
    super(Player.ENTITY_NAME, () => {
      return new Player();
    });
  }

  validateNewCreation(player: Player): Player {
    if (!(isEqual(player.stockpile, []) || !player.stockpile)) {
      throw new Error("Cannot set player stockpiles via this method");
    }
    if (!(isEqual(player.hand, []) || !player.hand)) {
      throw new Error("Cannot set player hand via this method");
    }
    if (
      !(isEqual(player.discardPiles, [[], [], [], []]) || !player.discardPiles)
    ) {
      throw new Error("Cannot set player discard piles via this method");
    }

    return super.validateNewCreation(player);
  }

  addPersonToGame(player: Player, game: Game): Player {
    const gameEntityService: GameEntityService = this.getGameEntityService();
    gameEntityService.addPlayer(game, player);
    return player;
  }

  removePersonFromGame(player: Player, game: Game): Player {
    const gameEntityService = this.getGameEntityService();
    gameEntityService.removePlayer(game, player);
    return player;
  }

  validateUpdates(currentEntity: Player, updatedEntity: Player) {
    super.validateUpdates(currentEntity, updatedEntity);

    if (currentEntity.stockpile != updatedEntity.stockpile) {
      throw new Error("Cannot set player stockpiles via this method");
    }
    if (currentEntity.hand != updatedEntity.hand) {
      throw new Error("Cannot set player hand via this method");
    }
    if (currentEntity.discardPiles != updatedEntity.discardPiles) {
      throw new Error("Cannot set player discard piles via this method");
    }
  }
}
