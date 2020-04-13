import Entity from "./Entity";

export default class EntityService<T extends Entity> {

    protected entities: Map<string, T> = new Map();
    private entity: T;
    private createEntityFunc:()=>T;

    constructor(entity:T,createEntityFunc:()=>T){
        this.entity=entity;
        this.createEntityFunc=createEntityFunc;
    }

    entityName():string{
        return this.entity.entityName;
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
}