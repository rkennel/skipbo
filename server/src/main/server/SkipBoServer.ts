import * as restify from "restify";
import {Server,plugins} from "restify";
import EntityControllerFactory from "../common/EntityControllerFactory";

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
    server.get("/health", (req, res, next) => {
      res.send("SkipBo Server is up and running");
      next();
    });

    for(let controller of EntityControllerFactory.getAllControllers()){
      controller.registerRoute(server);
    }
  }
}
