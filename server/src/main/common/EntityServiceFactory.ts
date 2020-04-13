import GameEntityController from "../game/GameEntityController";
import EntityController from "../server/EntityController";
import Entity from "./Entity";
import EntityService from "./EntityService";
import Game from "../game/Game";
import PlayerEntityService from "../player/PlayerEntityService";
import Player from "../player/Player";
import SpectatorEntityService from "../spectator/SpectatorEntityService";

export default class EntityServiceFactory {

    private static services: Map<string, EntityService<Entity>> = EntityServiceFactory.initializeServices();

    private static initializeServices():Map<string,EntityService<Entity>> {

        function addService(service: EntityService<Entity>) {
            map.set(service.getEntityName(),service);
        }

        const map:Map<string,EntityService<Entity>> = new Map();
        addService(new EntityService<Game>(Game.ENTITY_NAME,()=>new Game()));
        addService(new PlayerEntityService());
        addService(new SpectatorEntityService());
        return map;
    }

    static getEntityService(entityName:string):EntityService<Entity>{
        return this.services.get(entityName);
    }

    static getAllEntityServices(){
        return Array.from(EntityServiceFactory.services.values());
    }

}