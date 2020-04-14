import EntityService from "../entity/EntityService";
import Player from "./Player";
import Game from "../game/Game";
import EntityServiceFactory from "../entity/EntityServiceFactory";
import {generateUniqueId} from "../entity/UniqueIdGenerator";
import Person from "./Person";

export default abstract class PersonEntityService<T extends Person> extends EntityService<T> {

    validateNewCreation(person: T):T {
        if (!person.gameid) {
            throw new Error(`Must specify game for ${this.getEntityName()} to be added to`);
        }

        const game:Game = this.getGameById(person.gameid);

        if(!game){
            throw new Error(`Game: ${person.gameid} does not exist`);
        }

        person.id = generateUniqueId();

        this.addPersonToGame(person,game);

        return person;
    }

    abstract addPersonToGame(person: T, game:Game): T;

    deleteById(id:string) {
        const entity:T = this.entities.get(id);

        const game:Game = this.getGameById(entity.gameid);

        if(entity && game){
            this.removePersonFromGame(entity,game);
            this.entities.delete(id);
        }
    }

    abstract removePersonFromGame(person: T, game: Game): T;

    deleteAll(){
        const games = this.getGameEntityService().getAll();

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
    }

    private  getGameEntityService():EntityService<Game> {
        return <EntityService<Game>>EntityServiceFactory.getEntityService(Game.ENTITY_NAME);
    }

    private getGameById(gameid:string):Game{
        return <Game>this.getGameEntityService().getById(gameid);
    }
}