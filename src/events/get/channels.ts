import { Socket } from "socket.io";
import prisma from "../../utils/prismaHandler";
import { socketConnections } from "../../utils/socketConnections";
module.exports = {
  name: "getChannels",
  event: async (socket: Socket) => {
    console.log(socketConnections)
    console.log("fetching all channels")
    let id: number;
    try {
      id = Number.parseInt(socketConnections[socket.id]);
      socket.emit(
        "allChannels",
        await prisma.channel.findMany({
          where: {
            authorId: id,
          },
        })
      );
    } catch (err) {
      console.log("Error: " + err);
    }
  },
};
