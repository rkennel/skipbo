import EntityServiceFactory from "../../main/common/EntityServiceFactory";

export function clearAllEntities(){

    const services = EntityServiceFactory.getAllEntityServices();

    for(let service of services){
        service.deleteAll();
    }


}