var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');

/* GET gallery page. */
router.get('/', function (req, res, next) {

    var images = fs.readdirSync("./public/photos/");

    images = images.filter((file) => {
        return file.match(/\.(jpg)$/i);
    }).map((file) => {
        return path.join("/photos/", file);
    }).reverse();

    res.render('gallery', { title: 'BirdWatch', eins: 'eins', images: images });
});

module.exports = router;