import { Socket } from "socket.io";
import TokenProjectApi from "../utils/tokenProjectApi";

module.exports = {
  name: "message",
  event: async (socket: Socket, props: any) => {
    console.log("req")
  },
};
