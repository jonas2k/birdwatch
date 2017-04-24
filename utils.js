var fs = require('fs');
var path = require('path');
var time = require('time');

class Utils {
    static getImagesFromPhotosDir() {

        var images = fs.readdirSync("./public/photos/");

        images = images.filter((file) => {
            return file.match(/\.(jpg)$/i);
        }).map((file) => {
            return path.join("/photos/", file);
        }).reverse();

        return images;
    }

    static getFormattedDateString() {
        var date = new time.Date().setTimezone('Europe/Berlin');
        return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }

    static round(value) {
        return Math.round(value * 100) / 100;
    }
}

module.exports = Utils;