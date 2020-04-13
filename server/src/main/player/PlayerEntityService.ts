import Player from "./Player";
import PersonEntityService from "./PersonEntityService";

export default class PlayerEntityService extends PersonEntityService<Player> {

    constructor() {
        super(Player.ENTITY_NAME, () => {
            return new Player()
        });
    }
}