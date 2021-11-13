import { Socket } from "socket.io";

export default {
  name: "message",
  event: async (socket: Socket, props: any) => {
    console.log(props);
  },
};
