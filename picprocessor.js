const EventEmitter = require('events');
var RaspiSensors = require('raspi-sensors');
var gm = require('gm');
var _ = require('lodash');

var DHT22 = new RaspiSensors.Sensor({
    type: "DHT22",
    pin: 0X9
}, "temp sensor");

var annotation;

class PicProcessor extends EventEmitter {

    constructor(camera) {
        super();
        this.camera = camera;
    }

    process(filename) {

        var date = new Date();
        annotation = date.toLocaleDateString() + " " + date.toLocaleTimeString() + " | ";
        var finished = _.after(2, () => {
            return this.finalize(filename);
        });

        DHT22.fetch(function (err, data) {
            if (err) {
                throw err;
            }
            annotation += (data.type + "=" + data.value + data.unit_display + " ");
            finished();
        });
    }

    finalize(filename) {
        gm("./public/photos/" + filename)
            .stroke("#ffffff")
            .font("Helvetica.ttf", 12)
            .drawText(30, 20, annotation)
            .write("./public/photos/" + filename, (err) => {
                if (err) {
                    throw err;
                }
                this.camera.emit("processingDone", { filename: filename });
            });
    }
};

module.exports = PicProcessor;