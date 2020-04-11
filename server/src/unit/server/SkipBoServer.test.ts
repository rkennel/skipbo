import SkipBoServer from "../../main/server/SkipBoServer";

const server: SkipBoServer = new SkipBoServer();

describe("Instantiating Server", () => {
  test("App should be undefined", () => {
    expect(server.app).toBeUndefined();
  });

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

  test("After Server has started, the class exposes the app property", () => {
    expect(server.app).toBeDefined();
  });

  test("After Server has started, the class exposes the server property", () => {
    expect(server.server).toBeDefined();
  });

  test("If Server is already running, then start will not do anything", () => {
    const spy = jest.spyOn(server.app, "listen");

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
    expect(server.server.listening).toBe(false);
  });

  test("I can start a server after it has been closed", () => {
    server.stop();
    server.start();

    expect(server.server.listening).toBe(true);
  });

  test("If the server has been started before it will not create a new app", () => {
    const app1 = server.app;
    server.stop();
    server.start();
    const app2 = server.app;

    expect(app1).toBe(app2);
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

    expect(server.server.listening).toBe(true);
  });
});
