import * as restify from "restify";
import { plugins, Server } from "restify";
import EntityControllerFactory from "../entity/EntityControllerFactory";
import corsMiddleware from "restify-cors-middleware";
import SkipBoWebSocketServer from "./SkipBoWebSocketServer";

export const PORT = process.env.PORT || 8080;

export default class SkipBoServer {
  port = 0;
  server: restify.Server;
  wsserver: SkipBoWebSocketServer;

  constructor(port?: number) {
    if (port) {
      this.port = port;
    }

    this.server = this.constructServer();
  }

  private constructServer(): restify.Server {
    const server = restify.createServer();

    const cors = corsMiddleware({
      preflightMaxAge: 5, //Optional
      origins: ["http://localhost:3000"],
      allowHeaders: ["Authorization"],
      exposeHeaders: ["Authorization"]
    });

    server.pre(cors.preflight);
    server.use(cors.actual);
    server.use(plugins.acceptParser(server.acceptable));
    server.use(plugins.bodyParser({ mapParams: true }));

    this.registerRoutes(server);

    return server;
  }

  start(cb: () => void = () => {}) {
    if (!this.isListening()) {
      const server = this.server;
      const skipBoServer = this;

      const port = this.port;

      const startingServerCallback = function() {
        console.log(`Restify Server listening on port: ${server.address().port}`);
        skipBoServer.wsserver = new SkipBoWebSocketServer(server);
        cb();
      };

      this.server.listen(this.port, startingServerCallback);
    }
  }

  stop(cb: () => void = () => {}) {
    const wsserver = this.wsserver;

    this.server.close(() => {
      wsserver.close();
      cb();
    });
  }

  isListening(): boolean {
    const url = this.server.url;
    return url.substring(url.lastIndexOf(":") + 1) != "0000";
  }

  private registerRoutes(server: Server) {
    server.pre(function(request, response, next) {
      function formatRequestForLogMessage(
        today: Date,
        method: string = "unknown_method",
        url: string = "uknown_url"
      ) {
        return `${today.toLocaleDateString(
          "en-US"
        )} ${today.toLocaleTimeString("en-US")}\t${method}\t${url}\t`;
      }

      const message = formatRequestForLogMessage(
        new Date(),
        request.method,
        request.url
      );
      console.log(message);
      next();
    });

    server.get("/health", (req, res, next) => {
      res.send("SkipBo Server is up and running");
      next();
    });

    for (let controller of EntityControllerFactory.getAllControllers()) {
      controller.registerRoute(server);
    }
  }
}
