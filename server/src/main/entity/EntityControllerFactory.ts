import GameEntityController from "../game/GameEntityController";
import EntityController from "../server/EntityController";
import PlayerEntityController from "../person/PlayerEntityController";
import SpectatorEntityController from "../person/SpectatorEntityController";
import {Entity} from "skipbo-common";

export default class EntityControllerFactory {

    private static controllers: Map<string, EntityController<Entity>> = EntityControllerFactory.initializeControllers();

    private static initializeControllers():Map<string,EntityController<Entity>> {
        function addController(controller: EntityController<Entity>) {
            map.set(controller.getEntityName(),controller);
        }

        const map:Map<string,EntityController<Entity>> = new Map();
        addController(new GameEntityController());
        addController(new PlayerEntityController());
        addController(new SpectatorEntityController());
        return map;
    }

    static getAllControllers(){
        return Array.from(EntityControllerFactory.controllers.values());
    }

}