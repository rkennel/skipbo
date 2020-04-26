import { EventType, SkipBoEvent } from "skipbo-common";
import {
  DefaultEventHandler,
  SkipBoEventHandler,
  SubscribeEventHandler,
  UnsubscribeEventHandler
} from "./SkipBoEventHandler";
import SkipBoEventPublisher from "./EventOutputStream";
import WebSocket from "ws";

export default class SkipBoEventProcessor {
  messageHandlers: Map<EventType, SkipBoEventHandler<any>> = new Map<
    EventType,
    SkipBoEventHandler<any>
  >();

  constructor() {
    this.initializeHandlers();
  }

  private initializeHandlers() {
    this.messageHandlers.set(EventType.SUBSCRIBE, new SubscribeEventHandler());
    this.messageHandlers.set(
      EventType.UNSUBSCRIBE,
      new UnsubscribeEventHandler()
    );
  }

  processEvent(
    event: SkipBoEvent<any>,
    publisher: SkipBoEventPublisher,
    ws: WebSocket
  ) {
    let handler: SkipBoEventHandler<any> = this.messageHandlers.get(
      event.eventDetails.eventType
    );

    if (!handler) {
      handler = new DefaultEventHandler();
    }

    handler.handleEvent(event, publisher, ws);
  }
}
