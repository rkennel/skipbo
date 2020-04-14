import Player from "./Player";
import PersonEntityService from "./PersonEntityService";
import Game from "../game/Game";

export default class PlayerEntityService extends PersonEntityService<Player> {

    constructor() {
        super(Player.ENTITY_NAME, () => {
            return new Player()
        });
    }

    addPersonToGame(player: Player, game: Game): Player {
        game.addPlayer(player);
        return player;
    }

    removePersonFromGame(player: Player, game: Game): Player {
        game.removePlayer(player);
        return player;
    }

    validateUpdates(currentEntity: Player, updatedEntity: Player) {
        super.validateUpdates(currentEntity,updatedEntity);

        if(currentEntity.stockpile!=updatedEntity.stockpile){
            throw new Error("Cannot update player stockpiles via this method");
        }
        if(currentEntity.hand!=updatedEntity.hand){
            throw new Error("Cannot update player hand via this method");
        }
        if(currentEntity.discardPiles!=updatedEntity.discardPiles){
            throw new Error("Cannot update player discard piles via this method");
        }
    }


}