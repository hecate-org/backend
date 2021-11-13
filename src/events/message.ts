import { GatewayMessage, Message, Op, OpCode } from "@hecate-org/blingaton-types/build";
import { reply, replyMessage } from "../utils/socketCommunication";

import prisma from "../utils/prismaHandler"

import { Socket } from "socket.io";

const isGatewayMessage = (object: any): object is GatewayMessage => {
  return (object as GatewayMessage)?.op !== undefined;
};

const EventHandlers = {
  [OpCode.auth_start]: (s: Socket, data: GatewayMessage) => {
    reply(s, OpCode.auth_reply, {
      // TODO: Fix encryption thingie
    });
  },
  [OpCode.auth_success]: (s: Socket, data: GatewayMessage) => {
    // Store client encryption key in ram
  },
};

type IndexedHandlers = keyof typeof EventHandlers;
type HandlerCallback = (s: Socket, data: GatewayMessage) => void;

module.exports = {
  name: "message",
  event: async (s: Socket, data: Message) => {
    const channel = (await prisma.channel.findFirst({
      where: {
        id: data.channel,
      },
    }))!;

    prisma.message.create({
      data: {
        content: data.content,
        channelId: data.channel,
        type: data.type,
        authorId:channel?.authorId
      },
    });

    if (isGatewayMessage(data)) {
      const handler: HandlerCallback | undefined =
        EventHandlers?.[data.op as IndexedHandlers];

      if (handler == undefined)
        return replyMessage(
          s,
          OpCode.exception,
          "The received OPCode can only be sent by the server or does not exist."
        );

      handler(s, data);
    }
    replyMessage(
      s,
      OpCode.exception,
      "Invalid structure. An opcode must be present in the message."
    );
  },
};
