import EntityController from "../server/EntityController";
import Spectator from "./Specatator";

export default class PlayerEntityController extends EntityController<Spectator>{

    constructor() {
        super(Spectator.ENTITY_NAME);
    }

}