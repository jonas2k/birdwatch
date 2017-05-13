const EventEmitter = require('events');
var gm = require('gm');
var Constants = require('./constants');

class PicProcessor extends EventEmitter {

    constructor(camera) {
        super();
        this.camera = camera;
    }

    process(filename, doEmit, annotation) {
        gm("./public/photos/" + filename)
            .fill("white")
            .stroke("none")
            .font("Helvetica.ttf", 25)
            .box("red")
            .drawText(30, 20, annotation, "SouthEast")
            .write("./public/photos/" + filename, (err) => {
                if (err) {
                    console.log("Unable to annotate picture: " + err);
                }
                if (doEmit) {
                    this.camera.emit("processingDone", { filename: filename });
                }
            });
    }
};

module.exports = PicProcessor;