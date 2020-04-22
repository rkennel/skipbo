import { Next, Request, Response, Server } from "restify";
import EntityService from "../entity/EntityService";
import EntityServiceFactory from "../entity/EntityServiceFactory";
import status from "statuses";
import { ErrorResponse } from "./ErrorResponse";
import { DuplicateError, NotFoundError } from "../common/Errors";
import { Entity } from "skipbo-common";

/*
Some Useful documentation
https://www.restapitutorial.com/lessons/httpmethods.html
 */

export default abstract class EntityController<T extends Entity> {
  entityService: EntityService<Entity>;
  private entityName: string;

  constructor(entityName: string) {
    this.entityName = entityName;
    this.entityService = EntityServiceFactory.getEntityService(
      this.getEntityName()
    );
  }

  getEntityName(): string {
    return this.entityName;
  }

  registerRoute(server: Server) {
    this.registerGetAll(server);

    this.registerGetById(server);

    this.registerCreateNew(server);

    this.registerUpdateAll(server);

    this.registerUpdateById(server);

    this.registerDelete(server);
  }

  registerGetAll(server: Server) {
    server.get(`/${this.getEntityName()}`, (req, res, next) => {
      this.getAll(req, res, next);
    });
  }

  registerGetById(server: Server) {
    server.get(`/${this.getEntityName()}/:id`, (req, res, next) => {
      this.getById(req, res, next);
    });
  }

  registerCreateNew(server: Server) {
    server.post(`/${this.getEntityName()}`, (req, res, next) => {
      this.createNew(req, res, next);
    });
  }

  registerUpdateAll(server: Server) {
    server.put(`/${this.getEntityName()}`, (req, res, next) => {
      res.send(status("method not allowed"));
      next();
    });
  }

  registerUpdateById(server: Server) {
    server.put(`/${this.getEntityName()}/:id`, (req, res, next) => {
      this.updatedById(req, res, next);
    });
  }

  registerDelete(server: Server) {
    server.del(`/${this.getEntityName()}/:id`, (req, res, next) => {
      this.delete(req, res, next);
    });
  }

  getAll(req: Request, res: Response, next: Next) {
    res.send(Array.from(this.entityService.getAll()));
    next();
  }

  getById(req: Request, res: Response, next: Next) {
    const id = req.params.id;

    const entity = this.entityService.getById(id);

    if (entity) {
      res.send(entity);
    } else {
      res.send(status("not found"));
    }

    next();
  }

  createNew(req: Request, res: Response, next: Next) {
    let entity: T = undefined;
    if (req.body) {
      entity = <T>req.body;
    }

    try {
      const newEntity = this.entityService.createNew(entity);
      res.send(status("created"), newEntity);
      next();
    } catch (error) {
      this.handleError(error, res, next);
    }
  }

  updatedById(req: Request, res: Response, next: Next) {
    const id = req.params.id;
    const updatedEntity = <T>req.body;

    try {
      this.entityService.updateById(id, updatedEntity);
      res.send(status("ok"), updatedEntity);
      next();
    } catch (error) {
      this.handleError(error, res, next);
    }
  }

  delete(req: Request, res: Response, next: Next) {
    const id = req.params.id;
    this.entityService.deleteById(id);

    res.send(status("no content"));
  }

  private handleError(error: Error, res: Response, next: Next) {
    let httpStatus = status("bad request");

    if (error instanceof NotFoundError) {
      httpStatus = status("not found");
    } else if (error instanceof DuplicateError) {
      httpStatus = status("conflict");
    }

    const errorResponse = new ErrorResponse(httpStatus, error.message);
    res.send(httpStatus, errorResponse);
    next();
  }
}
