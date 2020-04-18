import EntityController from "../server/EntityController";
import {Server} from "restify";
import status from "statuses";
import {Game} from "skipbo-common";

export default class GameEntityController extends EntityController<Game> {

    constructor() {
        super(Game.ENTITY_NAME);
    }


    registerUpdateById(server: Server) {
        server.put(`/${this.getEntityName()}/:id`, (req, res, next) => {
            res.send(status("method not allowed"));
            next();
        });
    }
}