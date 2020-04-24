import EventOutputStreamPublisher, {
  EventOutputStreamSubscriber
} from "../../main/event/EventOutputStream";

import { SkipBoEvent } from "skipbo-common";
import { ChatEventDetails } from "skipbo-common/build/entities/SkipBoEvent";

describe("EventOutputStream", () => {
  const gameid = "ABCD";
  const playerid = "1234";

  describe("Subscribing to an event", () => {
    let publisher: EventOutputStreamPublisher,
      subscriber: EventOutputStreamSubscriber;
    const msg = {
      event: {}
    };

    beforeEach(() => {
      msg.event = {};

      publisher = EventOutputStreamPublisher.getInstance();

      const fn = function(event: SkipBoEvent): void {
        msg.event = event;
      };

      subscriber = new EventOutputStreamSubscriber(gameid, playerid, fn);

      publisher.subscribe(subscriber);
    });

    afterEach(() => {
      publisher.unsubscribe(subscriber);
    });

    it("I am added to the list of subscribers", () => {
      expect(publisher.client.size).toEqual(1);
      expect(publisher.client.get(subscriber.key())).toEqual(subscriber);
    });

    it("When I subscribe to an event, I receive messages", () => {
      const event: SkipBoEvent = new SkipBoEvent(
        new ChatEventDetails("This is an event"),
        gameid,
        playerid
      );

      publisher.publish(event);

      expect(msg.event).toEqual(event);
    });

    it("I do not receive messages for other players", () => {
      const event: SkipBoEvent = new SkipBoEvent(
        new ChatEventDetails("This is an event"),
        gameid,
        "OTHER_PLAYER"
      );

      publisher.publish(event);

      expect(msg.event).toEqual({});
    });

    it("When no player is specified, I receive the event", () => {
      const event: SkipBoEvent = new SkipBoEvent(
        new ChatEventDetails("This is an event"),
        gameid
      );

      publisher.publish(event);

      expect(msg.event).toEqual(event);
    });

    it("I do not receive messages for other games", () => {
      const event: SkipBoEvent = new SkipBoEvent(
        new ChatEventDetails("This is an event"),
        "OTHER GAME"
      );

      publisher.publish(event);

      expect(msg.event).toEqual({});
    });

    it("I receive global messages", () => {
      const event: SkipBoEvent = new SkipBoEvent(
        new ChatEventDetails("This is an event")
      );

      publisher.publish(event);

      expect(msg.event).toEqual(event);
    });
  });

  describe("Unsubscring from an event", () => {
    let publisher: EventOutputStreamPublisher,
      subscriber: EventOutputStreamSubscriber;

    const msg = {
      event: {}
    };

    beforeEach(() => {
      msg.event = {};

      publisher = EventOutputStreamPublisher.getInstance();

      const fn = function(event: SkipBoEvent): void {
        msg.event = event;
      };

      subscriber = new EventOutputStreamSubscriber(gameid, playerid, fn);

      publisher.subscribe(subscriber);

      publisher.unsubscribe(subscriber);
    });

    it("I am removed from the list of subscribers", () => {
      expect(publisher.client.size).toEqual(0);
      expect(publisher.client.get(subscriber.key())).toEqual(undefined);
    });

    it("When I subscribe to an event, I receive messages", () => {
      const event: SkipBoEvent = new SkipBoEvent(
        new ChatEventDetails("This is an event"),
        gameid,
        playerid
      );

      publisher.publish(event);

      expect(msg.event).toEqual({});
    });
  });
});
