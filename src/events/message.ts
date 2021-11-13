import { Message } from "@hecate-org/blingaton-types/build";
import { Socket } from "socket.io";
import prisma from "../utils/prismaHandler";

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
  },
};
