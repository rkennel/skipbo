import moment, {Moment} from "moment";


export default class SkipBoEvent<E extends EventType> {
    ts:string;
    eventDetails:EventDetails<E>;
    gameid:string;
    playerid:string;

    constructor(eventDetails:EventDetails<E>,gameid?:string,playerid?:string) {
        this.ts = moment().toDate().toISOString();
        this.eventDetails = eventDetails;
        if(gameid){
            this.gameid=gameid;
        }
        this.gameid = gameid;
        if(playerid){
            this.playerid=playerid;
        }
    }
}

export enum EventType {
    CONNECT="CONNECT",
    SUBSCRIBE="SUBSCRIBE",
    UNSUBSCRIBE="UNSUBSCRIBE",
    CHAT="CHAT"
}

export interface EventDetails<E extends EventType> {
    eventType:EventType;
}

export class ChatEventDetails implements EventDetails<EventType.CHAT>{
    eventType: EventType = EventType.CHAT;
    text:string;

    constructor(text:string) {
        this.text=text;
    }

}

export class ConnectEventDetails implements EventDetails<EventType.CONNECT>{
    eventType=EventType.CONNECT
}
