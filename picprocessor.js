const EventEmitter = require('events');
var RaspiSensors = require('raspi-sensors');
var gm = require('gm');
var _ = require('lodash');
var Utils = require('./utils');
var Constants = require('./constants');

var DHT22 = new RaspiSensors.Sensor({
    type: "DHT22",
    pin: Constants.DHT22Pin
}, "temp sensor");

var annotation;

class PicProcessor extends EventEmitter {

    constructor(camera) {
        super();
        this.camera = camera;
    }

    process(filename) {

        annotation = Utils.getFormattedDateString();
        var finished = _.after(2, () => {
            return this.finalize(filename);
        });

        DHT22.fetch(function (err, data) {
            if (err) {
                throw err;
            }
            annotation += (" | " + data.type + "=" + Utils.round(data.value) + data.unit_display);
            finished();
        });
    }

    finalize(filename) {
        gm("./public/photos/" + filename)
            .fill("white")
            .stroke("none")
            .font("Helvetica.ttf", 25)
            .box("red")
            .drawText(30, 20, annotation, "SouthEast")
            .write("./public/photos/" + filename, (err) => {
                if (err) {
                    throw err;
                }
                this.camera.emit("processingDone", { filename: filename });
            });
    }
};

module.exports = PicProcessor;