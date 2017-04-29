const EventEmitter = require('events');
var Constants = require('./constants');
var Gpio = require('onoff').Gpio;
var pir = new Gpio(Constants.pirPin, 'in', 'rising');
var coolDown = false;
var coolDownTime = Constants.coolDownTime;

class Watcher extends EventEmitter {

    constructor() {
        super();
    }

    watch() {
        pir.watch(function (err, value) {
            if (err) {
                throw err;
            }
            if (!coolDown && value === 1) {
                coolDown = true;
                this.emit('Movement');
                console.log("Starting cooldown");
                setTimeout(() => {
                    coolDown = false;
                    console.log("Ending cooldown");
                }, coolDownTime)
            }

        }.bind(this));
    }
}

process.on('SIGINT', function () {
    pir.unexport();
});

module.exports = Watcher;