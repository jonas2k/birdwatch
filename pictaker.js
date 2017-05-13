const EventEmitter = require('events');
var fs = require('fs');
var RaspiCam = require("raspicam");
var Campi = require('campi');
var PicProcessor = require('./picprocessor');
var LedController = require('./ledcontroller');
var RaspiSensors = require('raspi-sensors');
var Constants = require('./constants');
var _ = require('lodash');
var Utils = require('./utils');

var camera = new RaspiCam({
    mode: "photo",
    output: "./workdir/",
    encoding: Constants.encoding,
    timeout: Constants.raspiCamDelay,
    width: 1920,
    height: 1080,
    rotation: Constants.raspiCamRotation
});

var timelapseCam = new RaspiCam({
    mode: "timelapse",
    output: "./workdir/",
    encoding: Constants.encoding,
    timeout: Constants.raspiCamTimelapseDelay,
    timelapse: Constants.raspiCamTimelapseInterval,
    width: 1920,
    height: 1080,
    rotation: Constants.raspiCamRotation
});

var DHT22 = new RaspiSensors.Sensor({
    type: "DHT22",
    pin: Constants.DHT22Pin
}, "temp sensor");

var campi = new Campi();
var picProcessor = new PicProcessor(camera);
var redLed = new LedController(Constants.redLedPin);
var greenLed = new LedController(Constants.greedLedPin);

var camFilename;
var timelapseFilename;
var camAnnotation;
var timelapseAnnotation;

class PicTaker extends EventEmitter {

    constructor() {
        super();
    }

    takeSinglePicture() {
        camAnnotation = Utils.getFormattedDateString();
        var finished = _.after(2, () => {
            camFilename = Date.now() + "." + Constants.encoding;
            camera.set("output", "./workdir/" + camFilename);
            camera.start();
        });

        DHT22.fetch(function (err, data) {
            if (err) {
                throw err;
            }
            camAnnotation += (" | " + data.type + "=" + Utils.round(data.value) + data.unit_display);
            finished();
        });
        return camera;
    }

    takeTimelapse() {
        timelapseAnnotation = Utils.getFormattedDateString();
        var finished = _.after(2, () => {
            timelapseFilename = Date.now() + "%02d." + "jpg";
            timelapseCam.set("output", "./workdir/" + timelapseFilename);
            timelapseCam.start();
        });

        DHT22.fetch(function (err, data) {
            if (err) {
                throw err;
            }
            timelapseAnnotation += (" | " + data.type + "=" + Utils.round(data.value) + data.unit_display);
            finished();
        });
        return timelapseCam;
    }

    takeTempPicture(callback) {
        campi.getImageAsStream({ timeout: Constants.campiDelay, width: 640, height: 480, rotation: Constants.campiRotation }, (err, stream) => {
            if (err) {
                console.log("Unable to take live picture: " + err);
            } else {
                const chunks = [];

                stream.on("error", function (err) {
                    console.log("Unable to take live picture: " + err);
                });

                stream.on("data", (chunk) => {
                    chunks.push(chunk);
                });

                stream.on("end", () => {
                    callback(Buffer.concat(chunks).toString("base64"));
                });
            }
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
    fs.rename("./workdir/" + camFilename, "./public/photos/" + camFilename, () => {
        picProcessor.process(camFilename, true, camAnnotation);
    });
    redLed.turnOff();
    greenLed.turnOn();
    setTimeout(() => {
        greenLed.turnOff();
    }, 3000);
});

timelapseCam.on("start", function (err, timestamp) {
    console.log("timelapse started at " + timestamp);
    redLed.turnOn();
});

timelapseCam.on("read", function (err, timestamp, filename) {
    console.log("timelapse image captured with filename: " + filename);
    fs.rename("./workdir/" + filename, "./public/photos/" + filename, () => {
        picProcessor.process(filename, false, timelapseAnnotation);
    });
});

timelapseCam.on("exit", function (timestamp) {
    console.log("timelapse child process has exited at " + timestamp);
    redLed.turnOff();
    greenLed.turnOn();
    setTimeout(() => {
        timelapseCam.emit("processingDone");
        greenLed.turnOff();
    }, 3000);
});

module.exports = PicTaker;