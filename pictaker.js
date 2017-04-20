const EventEmitter = require('events');
var RaspiCam = require("raspicam");
var encoding = "jpg";

var camera = new RaspiCam({
    mode: "photo",
    output: "./public/photos/",
    encoding: encoding,
    timeout: 500
});

class PicTaker extends EventEmitter {

    constructor() {
        super();
    }

    takePicture() {
        camera.set("output", "./public/photos/" + Date.now() + ".jpg");
        camera.start();
    }
}

camera.on("start", function (err, timestamp) {
    console.log("photo started at " + timestamp);
});

camera.on("read", function (err, timestamp, filename) {
    console.log("photo image captured with filename: " + filename);
});

camera.on("exit", function (timestamp) {
    console.log("photo child process has exited at " + timestamp);
});

module.exports = PicTaker;