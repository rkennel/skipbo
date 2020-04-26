import SkipBoEventPublisher, {
  SkipBoEventSubscriber
} from "../../main/event/EventOutputStream";
import { ChatEventDetails, EventType, SkipBoEvent } from "skipbo-common";
import SkipBoEventProcessor from "../../main/event/SkipBoEventProcessor";
import WebSocket from "ws";

const GAMEID = "GAMEID";

jest.mock("ws");

function intializePublisherAndAddSubscriber(): TestSubscriber {
  const publisher = SkipBoEventPublisher.getInstance();
  publisher.client.clear();

  const subscriber = new TestSubscriber(GAMEID, "PLAYER1");
  publisher.subscribe(subscriber);

  return subscriber;
}

describe("SkipBoEventProcessor", () => {
  let longTimeSubscriber: TestSubscriber,
    newSubscriber: TestSubscriber,
    unsubscriber: TestSubscriber;

  describe("Subscribing", () => {
    beforeAll(() => {
      longTimeSubscriber = intializePublisherAndAddSubscriber();
      newSubscriber = subscribe(GAMEID, "PLAYER2");
    });

    it("Adds a new subscriber", () => {
      expect(SkipBoEventPublisher.getInstance().client.size).toEqual(2);
    });

    it("Other subscribers, do not receive the event", () => {
      expect(longTimeSubscriber.messagesReceived.length).toEqual(0);
    });

    it("The new subscriber receives the event", () => {
      expect(newSubscriber.messagesReceived.length).toBe(1);
      expect(newSubscriber.messagesReceived[0].eventDetails.eventType).toEqual(
        EventType.SUBSCRIBE
      );
    });
  });

  describe("Unsubscribing", () => {
    beforeAll(() => {
      longTimeSubscriber = intializePublisherAndAddSubscriber();
      newSubscriber = subscribe(GAMEID, "PLAYER2");
      unsubscriber = unsubscribe(GAMEID, "PLAYER2");
    });

    it("Other subscribers, do not receive the event", () => {
      expect(longTimeSubscriber.messagesReceived.length).toEqual(0);
    });

    it("The unsubscriber receives the event", () => {
      expect(unsubscriber.messagesReceived.length).toBe(1);
      expect(unsubscriber.messagesReceived[0].eventDetails.eventType).toEqual(
        EventType.UNSUBSCRIBE
      );
    });
  });

  describe("Other Events", () => {
    const event: SkipBoEvent<EventType.CHAT> = new SkipBoEvent<EventType.CHAT>(
      new ChatEventDetails("Sending a message, did everyone receive it"),
      GAMEID
    );

    beforeAll(() => {
      longTimeSubscriber = intializePublisherAndAddSubscriber();
      newSubscriber = subscribe(GAMEID, "PLAYER2");
      processEvent(event, [] as SkipBoEvent<any>[]);
    });

    it("Both subscribers receive the event", () => {
      expect(longTimeSubscriber.messagesReceived.length).toBe(1);
      expect(longTimeSubscriber.messagesReceived[0]).toEqual(event);

      //newSubscriber also received subscribe event
      expect(newSubscriber.messagesReceived.length).toBe(2);
      expect(newSubscriber.messagesReceived[1]).toEqual(event);
    });
  });
});

class TestSubscriber extends SkipBoEventSubscriber {
  messagesReceived: SkipBoEvent<any>[] = [];

  constructor(
    gameid: string,
    playerid: string,
    messagesReceived?: SkipBoEvent<any>[]
  ) {
    super(
      gameid,
      playerid,
      messagesReceived
        ? event => messagesReceived.push(event)
        : event => this.messagesReceived.push(event)
    );

    if (messagesReceived) {
      this.messagesReceived = messagesReceived;
    }
  }
}

function subscribe(gameid: string, playerid: string) {
  const subscribeEvent = new SkipBoEvent(
    { eventType: EventType.SUBSCRIBE },
    gameid,
    playerid
  );

  const messagesReceived: SkipBoEvent<any>[] = [];
  processEvent(subscribeEvent, messagesReceived);

  return new TestSubscriber(gameid, playerid, messagesReceived);
}

function unsubscribe(gameid: string, playerid: string) {
  const unsubscribeEvent = new SkipBoEvent(
    { eventType: EventType.UNSUBSCRIBE },
    gameid,
    playerid
  );

  const messagesReceived: SkipBoEvent<any>[] = [];
  processEvent(unsubscribeEvent, messagesReceived);

  return new TestSubscriber(gameid, playerid, messagesReceived);
}

function processEvent(
  event: SkipBoEvent<any>,
  messagesReceived: SkipBoEvent<any>[]
) {
  const processor = new SkipBoEventProcessor();

  const ws = mockWebSocket(messagesReceived);

  processor.processEvent(event, SkipBoEventPublisher.getInstance(), ws);
}

function mockWebSocket(messagesReceived: SkipBoEvent<any>[]): WebSocket {
  const ws = new WebSocket("http://skip.bo");

  ws.send = (json: string) => {
    messagesReceived.push(JSON.parse(json) as SkipBoEvent<any>);
  };

  return ws;
}
