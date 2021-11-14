import {
  AuthStartMessage,
  GatewayMessage,
  OpCode,
} from "@hecate-org/blingaton-types/build";
import { replyAuth, replyAuthMessage } from "../utils/socketCommunication";

import { AES } from "crypto-js";
import { Socket } from "socket.io";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { addSocketConnection } from "../utils/socketConnections";

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

const isAuthStartMessage = (object: any): object is AuthStartMessage =>
  (object as AuthStartMessage)?.pub !== undefined;

const isGatewayMessage = (object: any): object is GatewayMessage =>
  (object as GatewayMessage)?.op !== undefined;

/** A buffer for all sessions which are currently being validated. */
const isAuthenticating: { [k: string]: string } = {};

/** Stores properly validated sessions. */
const sessions: { [k: string]: string } = {};

const EventHandlers = {
  [OpCode.auth_start]: (s: Socket, data: GatewayMessage) => {
    if (sessions?.[s.id])
      return replyAuthMessage(s, OpCode.exception, "A session already exists!");

    if (isAuthenticating?.[s.id])
      return replyAuthMessage(
        s,
        OpCode.exception,
        "Session is already being secured."
      );

    if (!isAuthStartMessage(data)) {
      return replyAuthMessage(
        s,
        OpCode.exception,
        "Invalid AuthStartMessage object!"
      );
    }

    const secretToken = crypto.randomBytes(64).toString("base64");

    replyAuth(s, OpCode.auth_reply, {
      key: crypto
        .publicEncrypt(
          {
            key: data.pub,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
          },
          Buffer.from(secretToken)
        )
        .toString("base64"),
    });
    isAuthenticating[s.id] = secretToken;
  },
  [OpCode.auth_success]: (s: Socket, _: any) => {
    if (sessions?.[s.id] || !isAuthenticating?.[s.id])
      return replyAuthMessage(
        s,
        OpCode.exception,
        "Session already exists or has not been started yet!"
      );

    sessions[s.id] = isAuthenticating[s.id];
    delete isAuthenticating[s.id];
  },
};

type IndexedHandlers = keyof typeof EventHandlers;
type HandlerCallback = (s: Socket, data: GatewayMessage) => void;

export const connectSocket = (socket: Socket) => {
  replyAuth(socket, OpCode.hello);
  eventList.forEach((event: eventFile) => {
    socket.on(event.name, (data: any) => {
      console.log(event.name)
      event.event(socket, data);
      // if (typeof data != "object") {
      //   try {
      //     data = JSON.parse(data) as object;
      //   } catch (e) {
      //     return replyAuthMessage(
      //       socket,
      //       OpCode.exception,
      //       `Invalid payload body (must be valid JSON). [${e}]`
      //     );
      //   }
      // }

      // if (isGatewayMessage(data)) {
      //   const handler: HandlerCallback | undefined =
      //     EventHandlers?.[data.op as IndexedHandlers];

      //   if (handler == undefined) {
      //     if (Object.values(OpCode).includes(data.op))
      //       return replyAuthMessage(
      //         socket,
      //         OpCode.exception,
      //         "The received OpCode can only be sent by the server."
      //       );

      //     const token: string | undefined = sessions?.[socket.id];

      //     if (!token)
      //       return replyAuthMessage(
      //         socket,
      //         OpCode.exception,
      //         "The session has not been secured yet, which is required for communication to happen."
      //       );

      //     if (data?.data) data = AES.decrypt(data.data, token) as object;

      //     return event.event(socket, data);
      //   }

      //   handler(socket, data);
      // } else
      //   replyAuthMessage(
      //     socket,
      //     OpCode.exception,
      //     "Invalid structure. An opcode must be present in the message."
      //   );
    });
  });
};
