import { Socket } from "socket.io";
import TokenProjectApi from "../utils/tokenProjectApi";
import { Message } from "@hecate-org/blingaton-types/build";
import prisma from "../utils/prismaHandler";
module.exports = {
  name: "message",
  event: async (socket: Socket, props: Message) => {
    const channel = (await prisma.channel.findFirst({
      where: {
        id: props.channel,
      },
    }))!;

    prisma.message.create({
      data: {
        content: props.content,
        channelId: props.channel,
        type: props.type,
        authorId:channel?.authorId
      },
    });
  },
};
