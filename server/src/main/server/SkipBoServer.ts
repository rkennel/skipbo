import * as restify from "restify";
import { Server, plugins } from "restify";
import EntityControllerFactory from "../entity/EntityControllerFactory";
import corsMiddleware from "restify-cors-middleware";
import * as ws from "ws";
import WebSocket, { Data } from "ws";

export const PORT = process.env.PORT || 8080;

export default class SkipBoServer {
  server: restify.Server;

  constructor() {
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

  start() {
    if (!this.isListening()) {
      const server = this.server;

      const logStarting = function() {
        console.log(`Restify Server listening on port: ${PORT}`);
        initializeWebSocket(server);

        function initializeWebSocket(server: Server): void {
          const wss = new ws.Server(server);

          wss.on("connection", function connection(ws: WebSocket) {
            ws.on("message", function incoming(message) {
              console.log("Message");
              console.log(JSON.stringify(message));
              wss.clients.forEach(function each(client: WebSocket) {
                client.send(message);
              });
            });

            ws.send("Welcome!");

            console.log("Web Socket Listening");
          });
        }
      };

      this.server.listen(PORT, logStarting);
    }
  }

  stop() {
    this.server.close();
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
