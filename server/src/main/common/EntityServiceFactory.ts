import GameController from "../game/GameController";
import EntityController from "../server/EntityController";
import Entity from "./Entity";
import EntityService from "./EntityService";
import Game from "../game/Game";

export default class EntityServiceFactory {

    private static services: Map<string, EntityService<Entity>> = EntityServiceFactory.initializeServices();

    private static initializeServices():Map<string,EntityService<Entity>> {
        function addService(controller: EntityService<Entity>) {
            map.set(controller.entityName(),controller);
        }

        const map:Map<string,EntityService<Entity>> = new Map();
        addService(new EntityService(new Game()));
        return map;
    }

    static getEntityService(entityName:string):EntityService<Entity>{
        return this.services.get(entityName);
    }

}