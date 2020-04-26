import { EventType, SkipBoEvent } from "skipbo-common";
import SkipBoEventPublisher, {
  SkipBoEventSubscriber
} from "./EventOutputStream";
import WebSocket from "ws";

export interface SkipBoEventHandler<E extends EventType> {
  handleEvent(
    event: SkipBoEvent<E>,
    publisher: SkipBoEventPublisher,
    ws: WebSocket
  ): void;
}

export class DefaultEventHandler<E extends EventType>
  implements SkipBoEventHandler<E> {
  handleEvent(
    event: SkipBoEvent<E>,
    publisher: SkipBoEventPublisher,
    ws: WebSocket
  ): void {
    publisher.publish(event);
  }
}

export class SubscribeEventHandler
  implements SkipBoEventHandler<EventType.SUBSCRIBE> {
  handleEvent(
    event: SkipBoEvent<EventType.SUBSCRIBE>,
    publisher: SkipBoEventPublisher,
    ws: WebSocket
  ) {
    SkipBoEventPublisher.getInstance().subscribe(createSubscriber(event, ws));

    ws.send(JSON.stringify(event));
  }
}

export class UnsubscribeEventHandler
  implements SkipBoEventHandler<EventType.UNSUBSCRIBE> {
  handleEvent(
    event: SkipBoEvent<EventType.UNSUBSCRIBE>,
    publisher: SkipBoEventPublisher,
    ws: WebSocket
  ) {
    publisher.unsubscribe(createSubscriber(event, ws));
    ws.send(JSON.stringify(event));
  }
}

function createSubscriber(
  event: SkipBoEvent<EventType.SUBSCRIBE>,
  ws: WebSocket
) {
  return new SkipBoEventSubscriber(event.gameid, event.playerid, evt =>
    ws.send(JSON.stringify(evt))
  );
}
