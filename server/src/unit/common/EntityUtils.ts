import EntityServiceFactory from "../../main/common/EntityServiceFactory";
import PlayerEntityService from "../../main/player/PlayerEntityService";
import Player from "../../main/player/Player";
import Spectator from "../../main/spectator/Specatator";

export function clearAllEntities(){

    const services = EntityServiceFactory.getAllEntityServices();

    for(let service of services){
        service.deleteAll();
    }

}

export function clearAllPlayersAndSpectators(){

    const playerEntityService = EntityServiceFactory.getEntityService(Player.ENTITY_NAME);
    const spectatorEntityService = EntityServiceFactory.getEntityService(Spectator.ENTITY_NAME);

    playerEntityService.deleteAll();
    spectatorEntityService.deleteAll();
}