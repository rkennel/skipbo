import { SkipBoEvent } from "skipbo-common";

export default class SkipBoEventPublisher {
  client = new Map<string, SkipBoEventSubscriber>();

  private static instance: SkipBoEventPublisher = new SkipBoEventPublisher();

  public static getInstance() {
    return SkipBoEventPublisher.instance;
  }

  subscribe(subscriber: SkipBoEventSubscriber) {
    this.client.set(subscriber.key(), subscriber);
  }

  unsubscribe(subscriber: SkipBoEventSubscriber) {
    this.client.delete(subscriber.key());
  }

  publish(event: SkipBoEvent<any>) {
    function validForPlayerId(subscriber: SkipBoEventSubscriber) {
      return subscriber.playerid === event.playerid || !event.playerid;
    }

    function validForGameId(subscriber: SkipBoEventSubscriber) {
      return subscriber.gameid === event.gameid || !event.gameid;
    }

    for (const subscriber of this.client.values()) {
      if (validForPlayerId(subscriber) && validForGameId(subscriber)) {
        subscriber.sendTo(event);
      }
    }
  }
}

export class SkipBoEventSubscriber {
  gameid: string;
  playerid: string;
  sendTo: (event: SkipBoEvent<any>) => void;

  constructor(
    gameid: string,
    playerid: string,
    sendTo: (event: SkipBoEvent<any>) => void
  ) {
    this.gameid = gameid;
    this.playerid = playerid;
    this.sendTo = sendTo;
  }

  key(): string {
    return this.gameid + "_" + this.playerid;
  }
}
