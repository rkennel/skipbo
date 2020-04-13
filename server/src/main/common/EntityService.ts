import Entity from "./Entity";
import {NotFoundError} from "./Errors";

export default class EntityService<T extends Entity> {

    protected entities: Map<string, T> = new Map();
    private createEntityFunc:()=>T;
    private entityName: string;

    constructor(entityName:string,createEntityFunc:()=>T){
        this.entityName = entityName;
        this.createEntityFunc=createEntityFunc;
    }

    getEntityName():string{
        return this.entityName;
    }

    getAll(): T[] {
        return Array.from(this.entities.values());
    }

    createNew(entity?:T): T {
        if(!entity){
            entity = this.createEntityFunc();
        }

        this.entities.set(entity.id, entity);
        return entity;
    }

    getById(id:string) {
        return this.entities.get(id);
    }

    deleteById(id:string) {
        this.entities.delete(id);
    }

    deleteAll(){
        this.entities.clear();
    }

    updateById(id: string, updatedEntity: T) {
        const currentEntity:T = this.entities.get(updatedEntity.id);

        if(!currentEntity){
            throw new NotFoundError(`${updatedEntity.entityName}: ${updatedEntity.id} does not exist`);
        }

        this.validateUpdates(currentEntity,updatedEntity);

        this.entities.set(id,updatedEntity);
    }

    validateUpdates(currentEntity: T, updatedEntity: T) {
        //throw error if you don't like the update
    }
}