var rpio = require('rpio');

class LedController {

    constructor(gpio) {
        this.gpio = gpio;
        rpio.open(gpio, rpio.OUTPUT, rpio.LOW);
    }

    turnOn() {
        rpio.write(this.gpio, rpio.HIGH);
    };

    turnOff() {
        rpio.write(this.gpio, rpio.LOW);
    };
}

module.exports = LedController;