import {Server} from "restify";
import EntityService from "../common/EntityService";
import EntityServiceFactory from "../common/EntityServiceFactory";
import Entity from "../common/Entity";

export default abstract class EntityController<T extends Entity> {

    entityService:EntityService<Entity>

    constructor() {
        this.entityService = EntityServiceFactory.getEntityService(this.entityName());
    }

    abstract entity():T;

    entityName():string{
        return this.entity().name;
    }

    registerRoute(server: Server) {
        server.get(`/${this.entityName()}`, (req, res, next) => {
            this.entityService.getAll(req, res, next);
        });

        server.get(`/${this.entityName()}/:id`, (req, res, next) => {
            this.entityService.getById(req, res, next);
        });

        server.post(`/${this.entityName()}`, (req, res, next) => {
            this.entityService.createNew(req, res, next);
        });

        server.put(`/${this.entityName()}`, (req, res, next) => {
            this.entityService.createNew(req, res, next);
        });

        server.del(`/${this.entityName()}/:id`, (req, res, next) => {
            this.entityService.delete(req, res, next);
        });
    }

}