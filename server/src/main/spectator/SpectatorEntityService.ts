import EntityService from "../common/EntityService";
import Spectator from "./Specatator";
import PlayerEntityService from "../player/PlayerEntityService";

export default class SpectatorEntityService extends EntityService<Spectator> {

    constructor() {
        super(Spectator.ENTITY_NAME, () => {
            return new Spectator();
        });
    }

    createNew(spectator: Spectator):Spectator {
        return <Spectator>PlayerEntityService.createNewPlayerOrSpectator(spectator,this.getEntityName(),this.entities);
    }

}