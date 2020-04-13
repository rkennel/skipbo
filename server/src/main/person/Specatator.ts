import Player from "./Player";

export default class Spectator extends Player {

    static ENTITY_NAME: string = "spectator";

    constructor(name: string="marty") {
        super(name);
    }

}