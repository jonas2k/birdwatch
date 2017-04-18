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

// var events = require('events');
// var Gpio = require('onoff').Gpio;
// pir = new Gpio(17, 'in', 'rising');

// function Watcher() {
//     var that;
//     events.EventEmitter.call(this);

//     this.init = function () {
//         that = this;
//         console.log("Contructor");

//         pir.watch(function (err, value) {
//             if (err) {
//                 throw err;
//             }
//             that.emit('Event');
//         });
//     }
// };

// Watcher.prototype.__proto__ = events.EventEmitter.prototype;

// module.exports = Watcher;