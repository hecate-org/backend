import { Socket } from "socket.io";
import prisma from "../../utils/prismaHandler";
import { socketConnections } from "../../utils/socketConnections";
module.exports = {
  name: "joinRoom",
  event: async (s: Socket, roomId: string) => {
    if (roomId == null) return;

    let roomIdNumber:number;
    try {
      roomIdNumber = Number.parseInt(roomId);
    } catch {
      return;
    }
    const socketConnection = socketConnections[s.id];
    const channel = await prisma.channel.findFirst({
      where: {
        authorId: Number.parseInt(socketConnection),
        id: roomIdNumber,
      },
    });
    if (channel) {
      const rooms = Array.from(s.rooms);
      if (rooms.length > 1) s.leave(rooms[1]);
      s.join(roomId.toString())
    }
  },
};
