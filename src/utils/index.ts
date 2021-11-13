//requiring path and fs modules
import path from "path"
import fs from "fs"

//interfaces
interface utilFile {
  name: string;
  event: (socket: object, props: any) => Promise<void>;
}

//global variables
let utilList: utilFile[] = [];

module.exports = {
  reloadEvents: async function () {
    //gets all events functions in folder
    await searchDir("");
    function searchDir(dir: string) {
      //joining path of directory
      const directoryPath = path.join(__dirname + dir);
      //passsing directoryPath and callback function
      fs.readdir(directoryPath, (err: NodeJS.ErrnoException | null, files: string[]) => {
        //handling error
        if (err) {
          return console.log("Unable to scan directory: " + err);
        }
        files.forEach((file) => {
          console.log("scanned: " + file);
          if (!file.includes(".")) searchDir(`${dir}/${file}`);
          if (file.includes(".ts") && file != "index.ts") {
            let event = require(`${__dirname}${dir}/${file}`);
            if (!utilList.includes(event)) {
                utilList.push(require(`${__dirname}${dir}/${file}`));
            }
          }
        });
      });
    }
  },
  connectSocket: async (socket: any) => {
    utilList.forEach((event: utilFile) => {
      socket.on(event.name, async (props: any) => {
        await event.event(socket, props);
      });
    });
  },
};
