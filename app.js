var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var socket_io = require('socket.io');
var fs = require('fs');
var Utils = require('./utils');
var TwitterClient = require('./twitterclient');

var index = require('./routes/index');
var gallery = require('./routes/gallery');
var takepicture = require('./routes/takepicture');

var Watcher = require('./watcher');
var PicTaker = require('./pictaker');
var picTaker = new PicTaker();
var watcher = new Watcher();
var twitterClient = new TwitterClient();

var app = express();

app.set('io', socket_io());
app.locals.isWatcherActive = false;
app.locals.title = "BirdWatch"

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

app.set('certificates', {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'images/birdwatch.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use(express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use(express.static(path.join(__dirname, 'node_modules/socket.io-client/dist')));

app.use('/', index);
app.use('/gallery', gallery);
app.use('/takepicture', takepicture);

//watcher
const watcherCallback = () => {
  var camera = picTaker.takePicture();
  camera.once("processingDone", () => {
    app.settings.io.emit("RefreshGalleryView", Utils.getImagesFromPhotosDir());
  });
};
watcher.watch();

//socket.io
var io = app.settings.io;
io.on("connection", (socket) => {
  socket.on("ToggleSensors", (socket) => {
    if (app.locals.isWatcherActive) {
      watcher.removeListener('Movement', watcherCallback);
      app.locals.isWatcherActive = false;
      console.log("Watcher listener removed");
    } else {
      watcher.on('Movement', watcherCallback);
      app.locals.isWatcherActive = true;
      console.log("Watcher listener added");
    }
  });
  socket.on("savePicture", () => {
    var camera = picTaker.takePicture();
    camera.once("processingDone", (data) => {
      socket.emit("savePictureReturn", { filename: data.filename });
      io.emit("RefreshGalleryView", Utils.getImagesFromPhotosDir());
    });
  });
  socket.on("liveView", () => {
    picTaker.takeTempPicture((livePic) => {
      socket.emit("liveViewReturn", { image: livePic });
    });
  });
  socket.on("tweetPic", (data) => {
    twitterClient.tweet(data.image, data.message, socket);
  });
  socket.on("ShutDown", () => {
    console.log("Shutting down...");
    Utils.shutDown();
  })
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;