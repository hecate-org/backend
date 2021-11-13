const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server, Socket } = require("socket.io");
const io = new Server(server, { cors: "*" });

const eventHandler = require("./events");
const actionHandler = require("./utils")

server.listen(4000, async () => {
  console.log("listening to request on port 4000");
});

io.on("connection", async (socket:any) => {
  await eventHandler.connectSocket(socket);
});
