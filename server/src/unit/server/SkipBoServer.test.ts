import SkipBoServer from "../../main/server/SkipBoServer";
import supertest, { Response } from "supertest";

const server: SkipBoServer = new SkipBoServer();

describe("Instantiating Server", () => {
  test("Server should be undefined", () => {
    expect(server.server).toBeUndefined();
  });
});

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

  test("health page returns response", async () => {
    const response: Response = await supertest(server.server).get("/health");
    expect(response.status).toEqual(200);
    expect(response.body).toEqual("SkipBo Server is up and running");
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
