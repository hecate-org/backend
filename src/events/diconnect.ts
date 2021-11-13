import { Socket } from "socket.io";
import { removeSocketConnection } from "../utils/socketConnections";

module.exports = {
  name: "disconnect",
  event: async (socket: Socket) => {
    await removeSocketConnection(socket.id);
  },
};
