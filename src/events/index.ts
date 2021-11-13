import { GatewayMessage, Op, OpCode } from "@hecate-org/blingaton-types/build";
import { replyAuth, replyAuthMessage } from "../utils/socketCommunication";

import { Socket } from "socket.io";
import { addSocketConnection } from "../utils/socketConnections";
import fs from "fs";
//requiring path and fs modules
import path from "path";

interface eventFile {
  name: string;
  event: (socket: object, props: any) => Promise<void>;
}

let eventList: eventFile[] = [];

export const reloadEvents = () => {
  function searchDir(dir: string) {
    //joining path of directory
    const directoryPath = path.join(__dirname + dir);
    //passsing directoryPath and callback function
    fs.readdir(
      directoryPath,
      (err: NodeJS.ErrnoException | null, files: string[]) => {
        //handling error
        if (err) {
          return console.log("Unable to scan directory: " + err);
        }
        files.forEach((file) => {
          console.log("scanned: " + file);
          if (!file.includes(".")) searchDir(`${dir}/${file}`);
          if (file.includes(".ts") && file != "index.ts") {
            let event = require(`${__dirname}${dir}/${file}`);
            if (!eventList.includes(event)) {
              eventList.push(require(`${__dirname}${dir}/${file}`));
            }
          }
        });
      }
    );
  }
  //gets all events functions in folder
  searchDir("");
};

const isGatewayMessage = (object: any): object is GatewayMessage => {
  return (object as GatewayMessage)?.op !== undefined;
};

const EventHandlers = {
  [OpCode.auth_start]: (s: Socket, data: GatewayMessage) => {
    replyAuth(s, OpCode.auth_reply, {
      // TODO: Fix encryption thingie
    });
  },
  [OpCode.auth_success]: (s: Socket, data: GatewayMessage) => {
    // Store client encryption key in ram
  },
};

type IndexedHandlers = keyof typeof EventHandlers;
type HandlerCallback = (s: Socket, data: GatewayMessage) => void;

export const connectSocket = (socket: Socket) => {
  eventList.forEach((event: eventFile) => {
    socket.on(event.name, (data: any) => {
      if (typeof data != "object") {
        try {
          data = JSON.parse(data) as object;
        } catch (e) {
          return replyAuthMessage(
            socket,
            OpCode.exception,
            `Invalid payload body (must be valid JSON). [${e}]`
          );
        }
      }

      if (isGatewayMessage(data)) {
        const handler: HandlerCallback | undefined =
          EventHandlers?.[data.op as IndexedHandlers];

        if (handler == undefined) {
          if (Object.values(OpCode).includes(data.op))
            return replyAuthMessage(
              socket,
              OpCode.exception,
              "The received OpCode can only be sent by the server."
            );
          return event.event(socket, data);
        }

        handler(socket, data);
      } else
        replyAuthMessage(
          socket,
          OpCode.exception,
          "Invalid structure. An opcode must be present in the message."
        );
    });
  });
};
