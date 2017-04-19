var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var socket_io = require("socket.io");

var index = require('./routes/index');
var users = require('./routes/users');
var gallery = require('./routes/gallery');

var Watcher = require('./watcher');
var PicTaker = require('./pictaker');
var picTaker = new PicTaker();
var watcher = new Watcher();
var watcherIsActive = false;

var app = express();

app.set('io', socket_io());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
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
app.use('/users', users);
app.use('/gallery', gallery);

//watcher

const watcherCallback = () => {
  picTaker.takePicture();
};
watcher.watch();

//socket.io
var io = app.settings.io;
io.on("connection", (socket) => {
  // console.log("User connected");
  // socket.on('disconnect', function () {
  //   console.log('user disconnected');
  // });

  socket.on("getWatcherState", () => {
    socket.emit("returnWatcherState", { watcherState: watcherIsActive });
  });

  socket.on("ToggleSensors", (socket) => {
    if (watcherIsActive) {
      watcher.removeListener('Movement', watcherCallback);
      watcherIsActive = false;
      console.log("Watcher listener removed");
    } else {
      watcher.on('Movement', watcherCallback);
      watcherIsActive = true;
      console.log("Watcher listener added");
    }
  });
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