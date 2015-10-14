var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var session = require('express-session');
var dbCalls = require('./lib/dbCalls.js');
var socketio = require('socket.io');

require('dotenv').load();

var routes = require('./routes/index');
var users = require('./routes/users');


var app = express();

//socket.io
var io = socketio();
app.io = io;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


passport.use(new Strategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "http://127.0.0.1:3000/login/twitter/return"
  },
  function(token, tokenSecret, profile, done) {
    dbCalls.findOrCreate(profile)
    return done(null, profile)
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// Initialize Passport and restore authentication state, if any, from the
// session.
var sessionMiddleware = session({ secret: process.env.SESSION_KEY1, resave: true, saveUninitialized: true })

io.use(function(socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});
app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

var setEmailLocal = function (req, res, next) {
  if (req.user){
    res.locals.currentUser = req.user;
  }
  next();
};

app.use(setEmailLocal);

app.use('/', routes);
app.use('/users', users);

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('join', function (room) {
    console.log('join hit!?', room)
    socket.join(room.league)
    dbCalls.findLeague(room.league).then(function (league) {
      socket.request.session.passport.user.displayName
      io.sockets.in(league.id).emit('userjoin', socket.request.session.passport.user.displayName)
    })
  })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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



module.exports = app;
