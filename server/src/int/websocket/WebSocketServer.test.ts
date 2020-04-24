import { ChatEventDetails, SkipBoEvent } from "skipbo-common";
import * as WebSocket from "websocket";
import supertest, { Response } from "supertest";

describe("Web Socket Server", () => {
  //let websocket: WebSocket.client;

  let client: WebSocket.client;

  afterEach(() => {
    client.abort();
  });

  test("I can send a message to the web socket server", async () => {
    const wsurl = "ws://localhost:8080";
    const skipBoEvent = new SkipBoEvent(new ChatEventDetails("Hello World"));

    //expect.assertions(1);

    // const client = new WebSocket(wsurl)
    //   .on("message", msg => {
    //     console.log(msg);
    //     expect(1 + 1).toEqual(3);
    //     client.close();
    //   })
    //   .on("close", () => {});
    //
    // client.send(skipBoEvent);

    // function onOpen(evt: WebSocket.OpenEvent) {
    //   console.log(`Opened WebSocket`);
    // }
    //
    // function onClose(evt: WebSocket.CloseEvent) {
    //   console.log("Closed WebSocket");
    // }
    //
    // function onMessage(evt: WebSocket.MessageEvent) {
    //   console.log("Received Message");
    //   console.log(evt);
    // }
    //
    // function onError(evt: WebSocket.ErrorEvent) {
    //   console.log("Error");
    //   console.log(evt.message);
    //   console.log(evt.error);
    // }
    //
    // websocket = new WebSocket("ws://localhost:8080/");
    //
    // websocket.onopen = function(evt) {
    //   onOpen(evt);
    // };
    // websocket.onclose = function(evt) {
    //   onClose(evt);
    // };
    // websocket.onmessage = function(evt) {
    //   onMessage(evt);
    // };
    // websocket.onerror = function(evt) {
    //   onError(evt);
    // };
    //
    // const sleep = require("atomic-sleep");
    // sleep(50);

    client = new WebSocket.client();

    client.on("connectFailed", function(error) {
      console.log("Connect Error: " + error.toString());
    });

    client.on("connect", function(connection) {
      console.log("WebSocket Client Connected");
      connection.on("error", function(error) {
        console.log("Connection Error: " + error.toString());
      });
      connection.on("close", function() {
        console.log("echo-protocol Connection Closed");
      });
      connection.on("message", function(message) {
        if (message.type === "utf8") {
          console.log("Received: '" + message.utf8Data + "'");
        }
      });

      function sendNumber() {
        if (connection.connected) {
          var number = Math.round(Math.random() * 0xffffff);
          connection.sendUTF(number.toString());
          setTimeout(sendNumber, 1000);
        }
      }
      sendNumber();
    });

    client.connect("ws://localhost:8080/", "echo-protocol");

    client.emit(JSON.stringify(SkipBoEvent));
  });
});

// test("health page returns response", async () => {
//   const response: Response = await supertest(server.server).get("/health");
//   expect(response.status).toEqual(200);
//   expect(response.body).toEqual("SkipBo Server is up and running");
// });
