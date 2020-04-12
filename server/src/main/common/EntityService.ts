import Entity from "./Entity";
import {Next, Request, Response} from "restify";
import Game from "../game/Game";
import status from "statuses";

export default class EntityService<T extends Entity> {

    private entities: Map<string, Game> = new Map();
    private entity: T;

    constructor(entity:T){
        this.entity=entity;
    }

    entityName():string{
        return this.entity.name;
    }

    getAll(req: Request, res: Response, next: Next) {
        res.send(Array.from(this.entities.values()));
        next();
    }

    createNew(req: Request, res: Response, next: Next) {
        const game: Game = new Game();
        this.entities.set(game.id, game);
        res.send(status("created"), game);
        next();
    }

    getById(req: Request, res: Response, next: Next) {
        const id = req.params.id;

        const game:Game = this.entities.get(id);

        if(game){
            res.send(game);
        }
        else{
            res.send(status("not found"));
        }

        next();
    }

    delete(req: Request, res: Response, next: Next) {
        const id = req.params.id;
        this.entities.delete(id);

        res.send(status("no content"));
    }
}