const pirPin = 18;
const DHT22Pin = 27;
const redLedPin = 22;
const greedLedPin = 16;
const coolDownTime = 15000;
const raspiCamRotation = 90;
const campiRotation = 90;
const raspiCamDelay = 1000;
const raspiCamTimelapseDelay = 2000;
const raspiCamTimelapseInterval = 1000;
const campiDelay = 1;
const encoding  = "jpg";

module.exports = {
    pirPin: pirPin,
    DHT22Pin: DHT22Pin,
    redLedPin: redLedPin,
    greedLedPin, greedLedPin,
    coolDownTime, coolDownTime,
    raspiCamRotation: raspiCamRotation,
    campiRotation: campiRotation,
    raspiCamDelay: raspiCamDelay,
    raspiCamTimelapseDelay: raspiCamTimelapseDelay,
    raspiCamTimelapseInterval: raspiCamTimelapseInterval,
    campiDelay: campiDelay,
    encoding: encoding
}