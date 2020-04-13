import Spectator from "./Specatator";
import PersonEntityService from "./PersonEntityService";

export default class SpectatorEntityService extends PersonEntityService<Spectator> {

    constructor() {
        super(Spectator.ENTITY_NAME, () => {
            return new Spectator();
        });
    }
}