import Game from "../game/Game";
import {Next, Request, Response, Server} from "restify";
import status from "statuses";

export default abstract class EntityController<T extends Entity> {

    abstract entityName():string;

    private entities: Map<string, Game> = new Map();

    registerRoute(server: Server) {
        server.get(`/${this.entityName()}`, (req, res, next) => {
            this.getAll(req, res, next);
        });

        server.get(`/${this.entityName()}/:id`, (req, res, next) => {
            this.getById(req, res, next);
        });

        server.post(`/${this.entityName()}`, (req, res, next) => {
            this.createNew(req, res, next);
        });

        server.put(`/${this.entityName()}`, (req, res, next) => {
            this.createNew(req, res, next);
        });

        server.del(`/${this.entityName()}/:id`, (req, res, next) => {
            this.delete(req, res, next);
        });
    }

    private getAll(req: Request, res: Response, next: Next) {
        res.send(Array.from(this.entities.values()));
        next();
    }

    private createNew(req: Request, res: Response, next: Next) {
        const game: Game = new Game();
        this.entities.set(game.id, game);
        res.send(status("created"), game);
        next();
    }

    private getById(req: Request, res: Response, next: Next) {
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

    private delete(req: Request, res: Response, next: Next) {
        const id = req.params.id;
        this.entities.delete(id);

        res.send(status("no content"));
    }

}