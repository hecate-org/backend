import { Socket } from "socket.io";
import prisma from "../../utils/prismaHandler";
import { socketConnections } from "../../utils/socketConnections";
module.exports = {
  name: "getChannel",
  event: async (s: Socket, roomId: string) => {
    if (!roomId) return;

    let roomIdNumber: number;
    try {
      roomIdNumber = Number.parseInt(roomId);
    } catch {
      return;
    }
    const socketConnection = socketConnections[s.id];
    s.emit(
      "channelInfo",
      await prisma.channel.findFirst({
        select: {
          id: true,
          name: true,
          Message: true,
          description: true,
        },
        where: {
          authorId: Number.parseInt(socketConnection),
          id: roomIdNumber,
        },
      })
    );
  },
};
