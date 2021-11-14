import { Socket } from "socket.io";
import prisma from "../../utils/prismaHandler";
import { socketConnections } from "../../utils/socketConnections";
module.exports = {
  name: "getChannel",
  event: async (s: Socket, roomId: number) => {
    const socketConnection = socketConnections[s.id];
    return await prisma.channel.findFirst({
      select: {
        id: true,
        name: true,
        Message: true,
        description:true
      },
      where: {
        authorId: Number.parseInt(socketConnection),
        id: roomId,
      },
    });
  },
};
