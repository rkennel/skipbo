import PersonEntityService from "./PersonEntityService";
import {Game, Spectator} from "skipbo-common";

export default class SpectatorEntityService extends PersonEntityService<Spectator> {

    constructor() {
        super(Spectator.ENTITY_NAME, () => {
            return new Spectator();
        });
    }

    addPersonToGame(spectator: Spectator, game: Game): Spectator {
        this.getGameEntityService().addSpectator(game,spectator);
        return spectator;
    }

    removePersonFromGame(spectator: Spectator, game: Game): Spectator {
        this.getGameEntityService().removeSpectator(game,spectator);
        return spectator;
    }
}