import supertest, {Response} from "supertest";
import SkipBoServer from "../../main/server/SkipBoServer";
import {Entity} from "skipbo-common";

export function createAndReadTests(server: SkipBoServer, entityName: string, createEntityFunc: () => Entity) {
    it("Before any data has been added, get returns an empty list", async () => {
        const response: Response = await supertest(server.server).get(`/${entityName}`);
        expect(response.status).toEqual(200);
        expect(response.body).toEqual([]);
    });

    it(`I can create a ${entityName}`, async () => {
        const response: Response = await createEntity(server,entityName,createEntityFunc);
        expect(response.status).toEqual(201);
        expect(response.body.id).toBeDefined();
    });

    it(`After I create a ${entityName}, getAll returns at least one ${entityName}`, async () => {

        const postResponse: Response = await createEntity(server,entityName,createEntityFunc);

        const getResponse: Response = await supertest(server.server).get(`/${entityName}`);
        expect(getResponse.status).toEqual(200);
        expect(getResponse.body.length).toBeGreaterThan(0);
    });

    it(`After I create a ${entityName}, I can retrieve the ${entityName}`, async () => {

        const postResponse: Response = await createEntity(server,entityName,createEntityFunc);
        const entityCreated = postResponse.body;

        const getResponse: Response = await supertest(server.server).get(`/${entityName}/${entityCreated.id}`);
        expect(getResponse.status).toEqual(200);
        expect(getResponse.body.id).toEqual(entityCreated.id);
    });

    it(`If I ask for a ${entityName} that does not exist, then it will return a 404`, async () => {
        const getResponse: Response = await supertest(server.server).get(`/${entityName}/doesnotexist`);
        expect(getResponse.status).toEqual(404);
    });
}

export function updateTests(server: SkipBoServer, entityName: string, createEntityFunc: () => Entity, updateEntityFunc: (entity:Entity)=> Entity){

    it("Update method is not allowed on all entities",async ()=>{
        const updateResponse: Response = await supertest(server.server).put(`/${entityName}`);
        expect(updateResponse.status).toEqual(405);
    });

    it(`I can update a ${entityName} using a put`, async () => {

        const postResponse: Response = await createEntity(server,entityName,createEntityFunc);
        const entityCreated = <Entity>postResponse.body;

        const updatedEntity = updateEntityFunc(entityCreated);
        const response: Response = await supertest(server.server).put(`/${entityName}/${updatedEntity.id}`).send(updatedEntity);
        expect(response.status).toEqual(200);
        expect(response.body).toEqual(updatedEntity);
    });

    it(`I cannot update a ${entityName} if it does not exist`, async () => {
        const updatedEntity = createEntityFunc();
        updatedEntity.id = "doesnotexist";

        const response: Response = await supertest(server.server).put(`/${entityName}/${updatedEntity.id}`).send(updatedEntity);
        expect(response.status).toEqual(404);
        expect(response.body.httpStatus).toEqual(404);
        expect(response.body.errorMessage).toEqual(`${updatedEntity.entityName}: ${updatedEntity.id} does not exist`);
    });

}

export function deleteTests(server: SkipBoServer, entityName: string, createEntityFunc: () => Entity) {
    it(`I can delete ${entityName} that I have created`, async () => {
        const postResponse: Response = await createEntity(server,entityName,createEntityFunc);
        const entityCreated = postResponse.body;

        const deleteResponse: Response = await supertest(server.server).delete(`/${entityName}/${entityCreated.id}`);
        expect(deleteResponse.status).toEqual(204);

        const getResponse: Response = await supertest(server.server).get(`/${entityName}/${entityCreated.id}`);
        expect(getResponse.status).toEqual(404);
    });
}

export async function createEntity(server: SkipBoServer, entityName: string, createEntityFunc: () => Entity, post: boolean = true): Promise<Response> {

    if (createEntityFunc && post) {
        return supertest(server.server).post(`/${entityName}`).send(createEntityFunc());
    }
    else if (createEntityFunc) {
        return supertest(server.server).put(`/${entityName}`).send(createEntityFunc());
    }
    else if (post){
        return supertest(server.server).post(`/${entityName}`);
    }
    else{
        return supertest(server.server).put(`/${entityName}`);
    }
}

export function optionsTests(server: SkipBoServer, entityName: string){

    let optionsResponse: Response;

    it(`I can query what options are allowed`, async () => {
        const postResponse: Response = await createEntity(server,entityName,createEntityFunc);
        const entityCreated = postResponse.body;

        const deleteResponse: Response = await supertest(server.server).delete(`/${entityName}/${entityCreated.id}`);
        expect(deleteResponse.status).toEqual(204);

        const getResponse: Response = await supertest(server.server).get(`/${entityName}/${entityCreated.id}`);
        expect(getResponse.status).toEqual(404);
    });
}