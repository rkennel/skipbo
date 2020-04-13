import Entity from "./Entity";

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
        this.entities.set(id,updatedEntity);
    }
}