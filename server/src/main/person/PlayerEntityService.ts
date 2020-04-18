import PersonEntityService from "./PersonEntityService";
import Game from "../game/Game";
import {isEqual} from "lodash";
import {Player} from "skipbo-common";

export default class PlayerEntityService extends PersonEntityService<Player> {

    constructor() {
        super(Player.ENTITY_NAME, () => {
            return new Player()
        });
    }

    validateNewCreation(player: Player):Player {
        if(!(isEqual(player.stockpile,[])||(!player.stockpile))){
            throw new Error("Cannot set player stockpiles via this method");
        }
        if(!(isEqual(player.hand,[])||(!player.hand))){
            throw new Error("Cannot set player hand via this method");
        }
        if(!(isEqual(player.discardPiles,[[],[],[],[]])||(!player.discardPiles))){
            throw new Error("Cannot set player discard piles via this method");
        }

        return(super.validateNewCreation(player));
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
            throw new Error("Cannot set player stockpiles via this method");
        }
        if(currentEntity.hand!=updatedEntity.hand){
            throw new Error("Cannot set player hand via this method");
        }
        if(currentEntity.discardPiles!=updatedEntity.discardPiles){
            throw new Error("Cannot set player discard piles via this method");
        }
    }


}