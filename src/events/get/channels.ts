import { Socket } from "socket.io";
import prisma from "../../utils/prismaHandler";
import { socketConnections } from "../../utils/socketConnections";
module.exports = {
  name: "getChannels",
  event: async (socket: Socket) => {
    let id: number;
    try {
      id = Number.parseInt(socketConnections[socket.id]);
      return await prisma.channel.findMany({
        where: {
          authorId: id,
        },
      });
    } catch (err) {
      console.log("Error: " + err);
      return [];
    }
  },
};
