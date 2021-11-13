import {Server, Socket} from "socket.io";

import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

const eventHandler = require("./events");
const actionHandler = require("./utils");

server.listen(4000, async () => {
  console.log("listening to request on port 4000");
});

io.on("connection", async (socket: Socket) => {
  await eventHandler.connectSocket(socket);
});
