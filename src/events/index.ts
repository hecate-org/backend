interface eventFile {
  name: string;
  event: (socket: object, props: any) => Promise<void>;
}

//requiring path and fs modules
const path = require("path");
const fs = require("fs");

let eventList: eventFile[] = [];

module.exports = {
  reloadEvents: async function () {
    //gets all events functions in folder
    await searchDir("");
    function searchDir(dir: string) {
      //joining path of directory
      const directoryPath = path.join(__dirname + dir);
      //passsing directoryPath and callback function
      fs.readdir(directoryPath, function (err: string, files: string[]) {
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
      });
    }
  },
  connectSocket: async (socket: any) => {
    eventList.forEach((event: eventFile) => {
      socket.on(event.name, async (props: any) => {
        await event.event(socket, props);
      });
    });
  },
};