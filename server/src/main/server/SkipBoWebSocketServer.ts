import * as http from "http";
import * as https from "https";
import WebSocket, { ServerOptions } from "ws";
// @ts-ignore
import { ConnectEventDetails, EventType, SkipBoEvent } from "skipbo-common";
import SkipBoEventPublisher, {
  SkipBoEventSubscriber
} from "../event/EventOutputStream";
import SkipBoEventProcessor from "../event/SkipBoEventProcessor";

export default class SkipBoWebSocketServer {
  wss: WebSocket.Server;

  constructor(server: http.Server | https.Server) {
    const serverOptions: ServerOptions = {
      server: server
    };

    const publisher: SkipBoEventPublisher = SkipBoEventPublisher.getInstance();
    const wss = new WebSocket.Server(serverOptions);

    const processor = new SkipBoEventProcessor();

    wss.on("connection", function connection(ws: WebSocket) {
      ws.on("message", function incoming(message) {
        try {
          const event: SkipBoEvent<any> = JSON.parse(
            message as string
          ) as SkipBoEvent<any>;

          processor.processEvent(event, publisher, ws);
        } catch (e) {
          console.log(e);
        }
      });

      sendWelcomeEvent(ws);
    });

    this.wss = wss;
  }

  close(cb?: (err?: Error) => void) {
    this.wss.close(cb);
  }

}

function sendWelcomeEvent(ws: WebSocket) {
  const welcomeEvent = new SkipBoEvent(new ConnectEventDetails());

  ws.send(JSON.stringify(welcomeEvent));
}
