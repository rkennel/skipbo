import EntityService from "./EntityService";
import PlayerEntityService from "../person/PlayerEntityService";
import SpectatorEntityService from "../person/SpectatorEntityService";
import { Entity } from "skipbo-common";
import GameEntityService from "../game/GameEntityService";

export default class EntityServiceFactory {
  private static services: Map<
    string,
    EntityService<Entity>
  > = EntityServiceFactory.initializeServices();

  private static initializeServices(): Map<string, EntityService<Entity>> {
    function addService(service: EntityService<Entity>) {
      map.set(service.getEntityName(), service);
    }

    const map: Map<string, EntityService<Entity>> = new Map();
    addService(new GameEntityService());
    addService(new PlayerEntityService());
    addService(new SpectatorEntityService());
    return map;
  }

  static getEntityService(entityName: string): EntityService<Entity> {
    let service = this.services.get(entityName);

    if (!service) {
      service = new EntityService<Entity>(entityName, () => {
        throw new Error("Entity Service Not configured for: " + entityName);
      });
    }

    return service;
  }

  static getAllEntityServices() {
    return Array.from(EntityServiceFactory.services.values());
  }
}
