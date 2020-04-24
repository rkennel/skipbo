import { SkipBoEvent } from "skipbo-common";

export default class EventOutputStreamPublisher {
  client = new Map<string, EventOutputStreamSubscriber>();

  private static instance: EventOutputStreamPublisher = new EventOutputStreamPublisher();

  public static getInstance() {
    return EventOutputStreamPublisher.instance;
  }

  subscribe(subscriber: EventOutputStreamSubscriber) {
    this.client.set(subscriber.key(), subscriber);
  }

  unsubscribe(subscriber: EventOutputStreamSubscriber) {
    this.client.delete(subscriber.key());
  }

  publish(event: SkipBoEvent) {
    function validForPlayerId(subscriber: EventOutputStreamSubscriber) {
      return subscriber.playerid === event.playerid || !event.playerid;
    }

    function validForGameId(subscriber: EventOutputStreamSubscriber) {
      return subscriber.gameid === event.gameid || !event.gameid;
    }

    for (const subscriber of this.client.values()) {
      if (validForPlayerId(subscriber) && validForGameId(subscriber)) {
        subscriber.sendTo(event);
      }
    }
  }
}

export class EventOutputStreamSubscriber {
  gameid: string;
  playerid: string;
  sendTo: (event: SkipBoEvent) => void;

  constructor(
    gameid: string,
    playerid: string,
    sendTo: (event: SkipBoEvent) => void
  ) {
    this.gameid = gameid;
    this.playerid = playerid;
    this.sendTo = sendTo;
  }

  key(): string {
    return this.gameid + "_" + this.playerid;
  }
}
