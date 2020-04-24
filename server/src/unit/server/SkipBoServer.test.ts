import SkipBoServer from "../../main/server/SkipBoServer";

const server: SkipBoServer = new SkipBoServer();

describe("Starting Server functions", () => {
  beforeEach(() => {
    server.start();
  });

  afterEach(() => {
    server.stop();
  });

  test("After Server has started, the class exposes the server property", () => {
    expect(server.server).toBeDefined();
  });

  test("If Server is already running, then start will not do anything", () => {
    const spy = jest.spyOn(server.server, "listen");

    server.start();

    expect(spy).not.toHaveBeenCalled();
  });
});

describe("Stopping Server functions", () => {
  beforeEach(() => {
    server.start();
  });

  afterEach(() => {
    server.stop();
  });

  test("Stopping server will cause server.close()", () => {
    const spy = jest.spyOn(server.server, "close");

    server.stop();

    expect(spy).toHaveBeenCalled();
    expect(server.isListening()).toBe(false);
  });

  test("I can start a server after it has been closed", () => {
    server.stop();
    server.start();

    expect(server.isListening()).toBe(true);
  });

  test("If the server has been started before it will not create a new server", () => {
    const server1 = server.server;
    server.stop();
    server.start();
    const server2 = server.server;

    expect(server1).toBe(server2);
  });

  test("If the server is started after a stop it will be listening", () => {
    server.stop();
    server.start();

    expect(server.isListening()).toBe(true);
  });
});

// describe("Web Socket Server", () => {
//   beforeEach(() => {
//     server.start();
//     console.log(server.isListening());
//   });
//
//   afterEach(() => {
//     server.stop();
//   });
//
//   test("I can send a message to the web socket server", async () => {
//     console.log(server.isListening());
//     //console.log(server.wss.lis)
//     const wsurl = "ws://localhost:" + PORT;
//     const skipBoEvent = new SkipBoEvent(new ChatEventDetails("Hello World"));
//
//     //expect.assertions(1);
//
//     // const client = new WebSocket(wsurl)
//     //   .on("message", msg => {
//     //     console.log(msg);
//     //     expect(1 + 1).toEqual(3);
//     //     client.close();
//     //   })
//     //   .on("close", () => {});
//     //
//     // client.send(skipBoEvent);
//
//     function onOpen(evt: WebSocket.OpenEvent) {
//       console.log(`Opened WebSocket`);
//     }
//
//     function onClose(evt: WebSocket.CloseEvent) {
//       console.log("Closed WebSocket");
//     }
//
//     function onMessage(evt: WebSocket.MessageEvent) {
//       console.log("Received Message");
//       console.log(evt);
//     }
//
//     function onError(evt: WebSocket.ErrorEvent) {
//       console.log("Error");
//       console.log(evt.message);
//       console.log(evt.error);
//     }
//
//     const websocket = new WebSocket(wsurl);
//     websocket.onopen = function(evt) {
//       onOpen(evt);
//     };
//     websocket.onclose = function(evt) {
//       onClose(evt);
//     };
//     websocket.onmessage = function(evt) {
//       onMessage(evt);
//     };
//     websocket.onerror = function(evt) {
//       onError(evt);
//     };
//
//     const sleep = require("atomic-sleep");
//     sleep(10000);
//
//     websocket.send(skipBoEvent);
//   });
// });
