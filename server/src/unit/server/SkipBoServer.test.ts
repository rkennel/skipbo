import SkipBoServer from "../../main/server/SkipBoServer";
import * as restify from "restify";

const server: SkipBoServer = new SkipBoServer();

describe("Starting Server functions", () => {
  afterEach(() => {
    server.stop();
  });

  test("After Server has started, the class exposes the server property", done => {
    server.start(() => {
      expect(server.server).toBeDefined();
      expect(server.isListening()).toBe(true);
      done();
    });
  });

  test("After Server has started, the class exposes the wsserver property", done => {
    server.start(() => {
      expect(server.wsserver).toBeDefined();
      done();
    });
  });

  test("If Server is already running, then start will not do anything", done => {
    server.start(() => {
      const spy = jest.spyOn(server.server, "listen");
      server.start();
      expect(spy).not.toHaveBeenCalled();
      done();
    });
  });
});

describe("Stopping Server functions", () => {
  afterEach(() => {
    server.stop();
  });

  test("Stopping server will cause server.close()", done => {
    server.start(() => {
      const spy = jest.spyOn(server.server, "close");

      server.stop(() => {
        expect(spy).toHaveBeenCalled();
        expect(server.isListening()).toBe(false);
        done();
      });
    });
  });

  test("Stopping server will cause wsserver.close()", done => {
    server.start(() => {
      const spy = jest.spyOn(server.wsserver, "close");

      server.stop(() => {
        expect(spy).toHaveBeenCalled();
        done();
      });
    });
  });

  test("I can start a server after it has been closed", done => {
    server.start(() => {
      server.stop(() => {
        server.start(() => {
          expect(server.isListening()).toBe(true);
          done();
        });
      });
    });
  });

  test("If the server has been started before it will not create a new server", done => {
    let server1: restify.Server, server2: restify.Server;
    server.start(() => {
      server1 = server.server;

      server.stop(() => {
        server.start(() => {
          server2 = server.server;
          expect(server1).toBe(server2);
          done();
        });
      });
    });
  });
});
