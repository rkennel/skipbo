import * as http from "http";
import SkipBoWebSocketServer from "../../main/server/SkipBoWebSocketServer";
import WebSocket, {Data} from "ws";
import {ChatEventDetails, EventType, SkipBoEvent} from "skipbo-common";

const sleep = require("atomic-sleep");

describe("SkipBoWSServer", () => {
  describe("Creating a connection", () => {
    let server: http.Server;
    let skipBoWSS: SkipBoWebSocketServer;

    beforeEach(() => {
      server = http.createServer();
    });

    afterEach(() => {
      skipBoWSS.close();
      server.close();
    });

    it("Sends a connection message upon connection", done => {
      skipBoWSS = listenOnServer(
        server,
        simpleWsFunc(
          server,
          event =>
            expect(event.eventDetails.eventType).toEqual(EventType.CONNECT),
          done
        )
      );
    });
  });

  describe("Broadcasting a message", () => {
    let server: http.Server;
    let skipBoWSS: SkipBoWebSocketServer;

    beforeEach(() => {
      server = http.createServer();
    });

    afterEach(() => {
      skipBoWSS.close();
      server.close();
    });

    it("Broadcasts messages to all clients", done => {
      const chatEvent = new SkipBoEvent(
        new ChatEventDetails("This is a test message")
      );

      const wsFunc = function(server: http.Server) {
        let assertionCount = 0;
        const ws: WebSocket[] = [];
        for (let i = 0; i < 2; i++) {
          // @ts-ignore
          ws.push(createWebSocket(server));

          const subscribeEvent = new SkipBoEvent(
            { eventType: EventType.SUBSCRIBE },
            "GAMEID",
            "PLAYERID_" + i
          );

          ws[i].on("open", function open() {
            ws[i].send(JSON.stringify(subscribeEvent));
            if (i === 0) {
              ws[0].send(JSON.stringify(chatEvent));
            }
          });

          ws[i].on("message", function incoming(data: Data) {
            const event = skipBoEvent(data, done);

            if (event.eventDetails.eventType === EventType.CHAT) {
              assertExpectation(
                event,
                event => expect(event).toEqual(chatEvent),
                done
              );
              assertionCount++;
            }

            if (assertionCount >= 2) {
              done();
            }
          });
        }
      };

      skipBoWSS = listenOnServer(server, wsFunc);
    });
  });
});

function listenOnServer(
  server: http.Server,
  wsFunc: (server: http.Server) => void
): SkipBoWebSocketServer {
  const skipBoWSS: SkipBoWebSocketServer = new SkipBoWebSocketServer(server);

  server.listen(0, () => {
    wsFunc(server);
  });

  return skipBoWSS;
}

function simpleWsFunc(
  server: http.Server,
  expectation: (event: SkipBoEvent<any>) => void,
  done: jest.DoneCallback
): (server: http.Server) => void {
  return (server: http.Server) => {
    const ws = createWebSocket(server);

    ws.on("message", function incoming(data: Data) {
      const event = skipBoEvent(data, done);
      assertExpectation(event, expectation, done);

      done();
    });
  };
}

function createWebSocket(server: http.Server) {
  // @ts-ignore
  return new WebSocket(`ws://localhost:${server.address().port}`);
}

function skipBoEvent(
  data: WebSocket.Data,
  done: jest.DoneCallback
): SkipBoEvent<any> {
  try {
    return JSON.parse(data as string) as SkipBoEvent<any>;
  } catch (e) {
    done(e);
    throw e;
  }
}

function assertExpectation(
  event: SkipBoEvent<any>,
  expectation: (event: SkipBoEvent<any>) => void,
  done: jest.DoneCallback
) {
  try {
    expectation(event);
  } catch (e) {
    done(e);
  }
}
