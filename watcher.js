const EventEmitter = require('events');
var Gpio = require('onoff').Gpio;
var pir = new Gpio(17, 'in', 'rising');
var coolDown = false;
const coolDownTime = 10000;

class Watcher extends EventEmitter {

    constructor() {
        super();
    }

    watch() {
        pir.watch(function (err, value) {
            if (err) {
                throw err;
            }
            if(!coolDown) {
                coolDown = true;
                this.emit('Movement');
                console.log("Starting cooldown")
                setTimeout(() => {
                    coolDown = false;
                    console.log("Ending cooldown")
                }, coolDownTime)
            }

        }.bind(this));
    }
}

module.exports = Watcher;