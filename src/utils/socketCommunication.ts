import { Op } from "@hecate-org/blingaton-types/build";
import { Socket } from "socket.io";

export const reply = (socket: Socket, op: Op, data?: object) => {
  socket.emit("message", {
    op,
    data,
  });
};

export const replyMessage = (socket: Socket, op: Op, message: string) =>
  reply(socket, op, { message });

export const replyAuth = (socket: Socket, op: Op, data?: object) => {
  socket.emit("auth", {
    op,
    data,
  });
};

export const replyAuthMessage = (socket: Socket, op: Op, message: string) =>
  replyAuth(socket, op, { message });
