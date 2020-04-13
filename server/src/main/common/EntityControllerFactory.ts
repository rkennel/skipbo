import GameController from "../game/GameController";
import EntityController from "../server/EntityController";
import Entity from "./Entity";
import PlayerEntityController from "../player/PlayerEntityController";

export default class EntityControllerFactory {

    private static controllers: Map<string, EntityController<Entity>> = EntityControllerFactory.initializeControllers();

    private static initializeControllers():Map<string,EntityController<Entity>> {
        function addController(controller: EntityController<Entity>) {
            map.set(controller.entityName(),controller);
        }

        const map:Map<string,EntityController<Entity>> = new Map();
        addController(new GameController());
        addController(new PlayerEntityController());
        return map;
    }

    static getAllControllers(){
        return Array.from(EntityControllerFactory.controllers.values());
    }

}