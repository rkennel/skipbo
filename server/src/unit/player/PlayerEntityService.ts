import EntityService from "../../main/common/EntityService";
import Player from "../../main/player/Player";
import {Next, Request, Response} from "restify";
import status from "statuses";
import {ErrorResponse} from "../../main/server/ErrorResponse";
import Game from "../../main/game/Game";
import EntityServiceFactory from "../../main/common/EntityServiceFactory";

export default class PlayerEntityService extends EntityService<Player> {

    constructor() {
        super(new Player(), () => {
            return new Player()
        });
    }

    createNew(player: Player):Player {

        if (!player.gameid) {
            throw new Error("Must specify game for player to be added to");
        }

        const gameService = EntityServiceFactory.getEntityService(new Game().entityName);
        const game:Game = <Game>gameService.getById(player.gameid);

        if(!game){
            throw new Error(`Game: ${player.gameid} does not exist`);
        }

        game.addPlayer(player);

        this.entities.set(player.id,player);

        return player;
    }
}