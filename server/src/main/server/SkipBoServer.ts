import { Server } from "http";
import { Express } from "express";

const express = require("express");

const PORT = process.env.PORT || 8080;

export default class SkipBoServer {
  server: Server;
  app: Express;

  constructor() {}

  start() {
    if (!this.server || !this.server.listening) {
      this.initializeApp();
      this.initializeServer();
    }
  }

  stop() {
    this.server.close();
  }

  private initializeApp() {
    if (!this.app) {
      this.app = express();
    }
  }

  private initializeServer() {
    const logStarting = function() {
      console.log(`Node Express Server listening on port: ${PORT}`);
    };

    if (!this.server) {
      this.server = this.app.listen(PORT, logStarting);
    } else if (!this.server.listening) {
      this.server.listen(PORT, logStarting);
    }
  }
}
