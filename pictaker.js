const EventEmitter = require('events');
var RaspiCam = require("raspicam");
var encoding = "jpg";
var filename;

var fs = require('fs');
var gm = require('gm');

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
        filename =  Date.now() + ".jpg";
        camera.set("output", "./public/photos/" + filename);
        camera.start();
        return camera;
    }

    takeTempPicture() {
        
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