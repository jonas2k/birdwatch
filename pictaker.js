const EventEmitter = require('events');
var RaspiCam = require("raspicam");
var Campi = require('campi');
var encoding = "jpg";
var filename;

var fs = require('fs');
var gm = require('gm');

var camera = new RaspiCam({
    mode: "photo",
    output: "./public/photos/",
    encoding: encoding,
    timeout: 500,
    width: 1920,
    height: 1080
});
var campi = new Campi();

class PicTaker extends EventEmitter {

    constructor() {
        super();
    }

    takePicture() {
        filename = Date.now() + ".jpg";
        camera.set("output", "./public/photos/" + filename);
        camera.start();
        return camera;
    }

    takeTempPicture(callback) {
        campi.getImageAsStream({ timeout: 1, width: 640, height: 480 }, (err, stream) => {
            if (err) {
                throw err;
            }

            const chunks = [];

            stream.on("data", (chunk) => {
                chunks.push(chunk);
            });

            stream.on("end", () => {
                callback(Buffer.concat(chunks).toString("base64"));
            });
        });
    }
}

camera.on("start", function (err, timestamp) {
    console.log("photo started at " + timestamp);
});

camera.on("read", function (err, timestamp, filename) {
    console.log("photo image captured with filename: " + filename);
    // gm mit filename 
});

camera.on("exit", function (timestamp) {
    console.log("photo child process has exited at " + timestamp);
    camera.emit("processingDone", { filename: filename });
});

module.exports = PicTaker;