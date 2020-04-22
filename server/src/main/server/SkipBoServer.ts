import * as restify from "restify";
import { Server, plugins } from "restify";
import EntityControllerFactory from "../entity/EntityControllerFactory";
import corsMiddleware from "restify-cors-middleware";

const PORT = process.env.PORT || 8080;

export default class SkipBoServer {
  server: restify.Server;

  constructor() {}

  start() {
    if (!this.server || !this.isListening()) {
      this.initializeServer();
    }
  }

  stop() {
    this.server.close();
  }

  private initializeServer() {
    const logStarting = function() {
      console.log(`Restify Server listening on port: ${PORT}`);
    };

    if (!this.server) {
      this.server = restify.createServer();

      const cors = corsMiddleware({
        preflightMaxAge: 5, //Optional
        origins: ["http://localhost:3000"],
        allowHeaders: ["Authorization"],
        exposeHeaders: ["Authorization"]
      });

      this.server.pre(cors.preflight);
      this.server.use(cors.actual);

      // this.server.use(function crossOrigin(req, res, next) {
      //   res.header("Access-Control-Allow-Origin", "*");
      //   res.header("Access-Control-Allow-Headers", "X-Requested-With");
      //   return next();
      // });
      this.server.use(plugins.acceptParser(this.server.acceptable));
      this.server.use(plugins.bodyParser({ mapParams: true }));

      this.registerRoutes(this.server);
    }
    if (!this.isListening()) {
      this.server.listen(PORT, logStarting);
    }
  }

  isListening(): boolean {
    return this.server.address() != null;
  }

  private registerRoutes(server: Server) {
    server.pre(function(request, response, next) {
      function formatRequestForLogMessage(
        today: Date,
        method: string,
        url: string
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
