import { Server, Socket } from "socket.io";
import { connectSocket, reloadEvents } from "./events";

import dotenv from "dotenv";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

dotenv.config();

server.listen(4000, async () => {
  await reloadEvents();
  console.log("listening to request on port 4000");
});

io.on("connection", async (socket: Socket) => {
  await connectSocket(socket);
});
