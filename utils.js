var fs = require('fs');
var path = require('path');

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
}

module.exports = Utils;