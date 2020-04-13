import GameController from "../game/GameController";
import EntityController from "../server/EntityController";
import Entity from "./Entity";
import EntityService from "./EntityService";
import Game from "../game/Game";
import PlayerEntityService from "../../unit/player/PlayerEntityService";
import Player from "../player/Player";

export default class EntityServiceFactory {

    private static services: Map<string, EntityService<Entity>> = EntityServiceFactory.initializeServices();

    private static initializeServices():Map<string,EntityService<Entity>> {

        function addService(service: EntityService<Entity>) {
            map.set(service.entityName(),service);
        }

        const map:Map<string,EntityService<Entity>> = new Map();
        addService(new EntityService<Game>(new Game(),()=>new Game()));
        addService(new PlayerEntityService());
        return map;
    }

    static getEntityService(entityName:string):EntityService<Entity>{
        return this.services.get(entityName);
    }

    static getAllEntityServices(){
        return Array.from(EntityServiceFactory.services.values());
    }

}