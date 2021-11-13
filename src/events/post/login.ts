import { Socket } from "socket.io";
import { addSocketConnection } from "../../utils/socketConnections";
module.exports = {
  name: "login",
  event: async (socket: Socket, props: string) => {
    addSocketConnection(socket.id, props);
  },
};
