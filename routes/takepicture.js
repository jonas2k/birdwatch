var express = require('express');
var router = express.Router();

/* GET takepicture page. */
router.get('/', function (req, res, next) {
  res.render('takepicture', { title: 'BirdWatch' });
});

module.exports = router;