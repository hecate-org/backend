import { OpCode } from "@hecate-org/blingaton-types/build";
import { Socket } from "socket.io";
import { replyAuthMessage } from "../utils/socketCommunication";

module.exports = {
  name: "auth",
  event: async (socket: Socket) => {
    replyAuthMessage(
      socket,
      OpCode.exception,
      "Invalid opcode!"
    );
  },
};
