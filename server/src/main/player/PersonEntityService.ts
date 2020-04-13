import EntityService from "../common/EntityService";
import Player from "./Player";
import Game from "../game/Game";
import EntityServiceFactory from "../common/EntityServiceFactory";
import {generateUniqueId} from "../common/UniqueIdGenerator";

function getGameEntityService():EntityService<Game> {
    return <EntityService<Game>>EntityServiceFactory.getEntityService(Game.ENTITY_NAME);
}

export default class PersonEntityService<T extends Player> extends EntityService<T> {

    createNew(player: T):T {
        if (!player.gameid) {
            throw new Error(`Must specify game for ${this.getEntityName()} to be added to`);
        }

        const gameService = EntityServiceFactory.getEntityService(new Game().entityName);
        const game:Game = <Game>gameService.getById(player.gameid);

        if(!game){
            throw new Error(`Game: ${player.gameid} does not exist`);
        }

        player.id = generateUniqueId();

        game.addPlayer(player);

        this.entities.set(player.id,player);

        return player;
    }

    deleteById(id:string) {
        function removePersonFromGame(person:T) {
            const game:Game = getGameEntityService().getById(entity.gameid);
            game.removePlayer(person);
            game.removeSpectator(person);
        }

        const entity:T = this.entities.get(id);

        if(entity){
            removePersonFromGame(entity);
            this.entities.delete(id);
        }
    }

    deleteAll(){
        const games = getGameEntityService().getAll();

        for(let game of games){
            if(this.getEntityName()===Player.ENTITY_NAME){
                game.removeAllPlayers();
            }
            else{
                game.removeAllSpectators();
            }
        }

        this.entities.clear();
    }


    validateUpdates(currentEntity: T, updatedEntity: T) {
        if(currentEntity.gameid!=updatedEntity.gameid){
            throw new Error("Cannot update game id via this method");
        }
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