const EventEmitter = require('events');
var fs = require('fs');
var RaspiCam = require("raspicam");
var Campi = require('campi');
var PicProcessor = require('./picprocessor');
var LedController = require('./ledcontroller');

var encoding = "jpg";
var filename;

var camera = new RaspiCam({
    mode: "photo",
    output: "./workdir/",
    encoding: encoding,
    timeout: 500,
    width: 1920,
    height: 1080
});
var campi = new Campi();
var picProcessor = new PicProcessor(camera);
var redLed = new LedController(8);
var greenLed = new LedController(10);

class PicTaker extends EventEmitter {

    constructor() {
        super();
    }

    takePicture() {
        filename = Date.now() + ".jpg";
        camera.set("output", "./workdir/" + filename);
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
    redLed.turnOn();
});

camera.on("read", function (err, timestamp, filename) {
    console.log("photo image captured with filename: " + filename);
});

camera.on("exit", function (timestamp) {
    console.log("photo child process has exited at " + timestamp);
    fs.rename("./workdir/" + filename, "./public/photos/" + filename, () => {
        picProcessor.process(filename);
    });
    redLed.turnOff();
    greenLed.turnOn();
    setTimeout(() => {
        greenLed.turnOff();
    }, 4000);
});

module.exports = PicTaker;