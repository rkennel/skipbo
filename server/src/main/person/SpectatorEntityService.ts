import Spectator from "./Specatator";
import PersonEntityService from "./PersonEntityService";
import Game from "../game/Game";

export default class SpectatorEntityService extends PersonEntityService<Spectator> {

    constructor() {
        super(Spectator.ENTITY_NAME, () => {
            return new Spectator();
        });
    }

    addPersonToGame(spectator: Spectator, game: Game): Spectator {
        game.addSpectator(spectator);
        return spectator;
    }

    removePersonFromGame(spectator: Spectator, game: Game): Spectator {
        game.removeSpectator(spectator);
        return spectator;
    }
}