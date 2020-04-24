import EntityServiceFactory from "../../main/entity/EntityServiceFactory";
import { Player, Spectator } from "skipbo-common";

export function clearAllEntities() {
  const services = EntityServiceFactory.getAllEntityServices();

  for (let service of services) {
    service.deleteAll();
  }
}

export function clearAllPlayersAndSpectators() {
  const playerEntityService = EntityServiceFactory.getEntityService(
    Player.ENTITY_NAME
  );
  const spectatorEntityService = EntityServiceFactory.getEntityService(
    Spectator.ENTITY_NAME
  );

  playerEntityService.deleteAll();
  spectatorEntityService.deleteAll();
}
