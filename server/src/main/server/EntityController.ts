import {Next, Request, Response, Server} from "restify";
import EntityService from "../common/EntityService";
import EntityServiceFactory from "../common/EntityServiceFactory";
import Entity from "../common/Entity";
import status from "statuses";
import {ErrorResponse} from "./ErrorResponse";

export default abstract class EntityController<T extends Entity> {

    entityService:EntityService<Entity>

    constructor() {
        this.entityService = EntityServiceFactory.getEntityService(this.entityName());
    }

    abstract entity():T;

    entityName():string{
        return this.entity().entityName;
    }

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

    getAll(req: Request, res: Response, next: Next) {
        res.send(Array.from(this.entityService.getAll()));
        next();
    }

    createNew(req: Request, res: Response, next: Next) {

        let entity:T = undefined;
        if(req.body){
            entity = <T>req.body;
        }

        try{
            const newEntity = this.entityService.createNew(entity);
            res.send(status("created"), newEntity);
            next();
        }
        catch(error){
            const httpStatus = status("bad request");
            const errorResponse = new ErrorResponse(httpStatus,error.message);
            res.send(httpStatus,errorResponse);
            next();
        }

    }

    getById(req: Request, res: Response, next: Next) {
        const id = req.params.id;

        const entity = this.entityService.getById(id);

        if(entity){
            res.send(entity);
        }
        else{
            res.send(status("not found"));
        }

        next();
    }

    delete(req: Request, res: Response, next: Next) {
        const id = req.params.id;
        this.entityService.deleteById(id);

        res.send(status("no content"));
    }

}