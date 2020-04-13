import EntityService from "../common/EntityService";
import Player from "./Player";
import Game from "../game/Game";
import EntityServiceFactory from "../common/EntityServiceFactory";

export default class PlayerEntityService extends EntityService<Player> {

    constructor() {
        super(Player.ENTITY_NAME, () => {
            return new Player()
        });
    }

    createNew(player: Player):Player {
        return PlayerEntityService.createNewPlayerOrSpectator(player,this.getEntityName(),this.entities);
    }

    static createNewPlayerOrSpectator(player:Player, entityName: string, entityRepository: Map<string, Player>){
        if (!player.gameid) {
            throw new Error(`Must specify game for ${entityName} to be added to`);
        }

        const gameService = EntityServiceFactory.getEntityService(new Game().entityName);
        const game:Game = <Game>gameService.getById(player.gameid);

        if(!game){
            throw new Error(`Game: ${player.gameid} does not exist`);
        }

        game.addPlayer(player);

        entityRepository.set(player.id,player);

        return player;
    }
}