import { GatewayMessage, Op, OpCode } from "@hecate-org/blingaton-types/build";

import { Socket } from "socket.io";
import TokenProjectApi from "../utils/tokenProjectApi";

const isGatewayMessage = (object: any): object is GatewayMessage => {
  return (object as GatewayMessage)?.op !== undefined;
};

const EventHandlers = {
  [OpCode.auth_start]: (socket: Socket, data: GatewayMessage) => {},
};

const reply = (socket: Socket, op: Op, data?: object) => {
  socket.emit("message", {
    op,
    data,
  });
};

module.exports = {
  name: "message",
  event: async (s: Socket, data: object) => {
    console.log("dt", isGatewayMessage(data));
    if (isGatewayMessage(data)) {
      console.log(data);
    }
    reply(s, OpCode.exception, {
      message: "Invalid structure. An opcode must be present in the message.",
    });
    // await TokenProjectApi.save({
    //   data: {
    //     sample: "test"
    //   }
    // })
  },
};
