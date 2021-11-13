import { OpCode } from "@hecate-org/blingaton-types/build";
import { Socket } from "socket.io";
import fs from "fs";
//requiring path and fs modules
import path from "path";
import { replyMessage } from "../utils/socketCommunication";

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

export const connectSocket = (socket: Socket) => {
  console.log(eventList);
  eventList.forEach((event: eventFile) => {
    socket.on(event.name, (props: any) => {
      if (typeof props != "object") {
        try {
          props = JSON.parse(props) as object;
        } catch (e) {
          return replyMessage(
            socket,
            OpCode.exception,
            `Invalid payload body (must be valid JSON). [${e}]`
          );
        }
      }

      event.event(socket, props as object);
    });
  });
};
