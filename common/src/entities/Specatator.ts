import Person from "./Person";

export default class Spectator extends Person {

    static ENTITY_NAME: string = "spectator";

    constructor(name: string="marty") {
        super(name);
        this.entityName = Spectator.ENTITY_NAME;
    }

}