var express = require('express');
var Utils = require('../utils');
var router = express.Router();

/* GET gallery page. */
router.get('/', function (req, res, next) {

    res.render('gallery', { images: Utils.getImagesFromPhotosDir() });
});

module.exports = router;