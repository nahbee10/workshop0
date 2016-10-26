var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var http = require('http').Server(app); // 추가
var io = require('socket.io').listen(http); // 추가

var osc = require('node-osc');

var oscServer, oscClient;

var isConnected = false;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.set( "port", 8081 ); 

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set( "ipaddr", "127.0.0.1" ); // 추가
app.set( "port", 8081 ); 

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

 
http.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
}); // 추가

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

io.sockets.on('connection', function (socket) {
  socket.on("config", function (obj) {
    isConnected = true;
      oscServer = new osc.Server(obj.server.port, obj.server.host);
      oscClient = new osc.Client(obj.client.host, obj.client.port);
      oscClient.send('/status', socket.sessionId + ' connected');
    oscServer.on('message', function(msg, rinfo) {
      socket.emit("message", msg);
    });
    socket.emit("connected", 1);
  });
  socket.on("message", function (obj) {
    oscClient.send.apply(oscClient, obj);
    });
  socket.on('disconnect', function(){
    if (isConnected) {
      oscServer.kill();
      oscClient.kill();
    }
    });
});

module.exports = app;
