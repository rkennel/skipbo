import moment, {Moment} from "moment";


export default class SkipBoEvent {
    ts:Moment;
    eventDetails:EventDetails;
    gameid:string;
    playerid:string;

    constructor(eventDetails:EventDetails,gameid?:string,playerid?:string) {
        this.ts = moment();
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
    CHAT
}

export interface EventDetails {
    eventType:EventType;
}

export class ChatEventDetails implements EventDetails{
    eventType: EventType = EventType.CHAT;
    text:string;

    constructor(text:string) {
        this.text=text;
    }

}
