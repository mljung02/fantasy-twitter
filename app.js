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
var Room = require('./lib/Room.js')

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
    dbCalls.findOrCreate(profile).then(function (user) {
      console.log('user creation finished')
      return done(null, profile)
    })
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
    res.locals.login = true;
    next();
  } else {
    res.locals.login = false;
    next();
  }
};

app.use(setEmailLocal);

app.use('/', routes);
app.use('/users', users);

var draftio = io.of('/draftio');
var indexio = io.of('/index');

var Rooms = {};

draftio.on('connection', function (socket) {
  console.log('connected to a draft room')
  if (socket.request.session.passport){
    socket.emit('twitterName', {twitterName: socket.request.session.passport.user.displayName})
  }
  socket.on('join', function (data) {
    var room
    if (Rooms[data.leagueId]) {
      room = Rooms[data.leagueId]
    } else {
      Rooms[data.leagueId] = new Room(data.leagueId)
      room = Rooms[data.leagueId]
    }
    socket.join(room.leagueId)
    var add = true;
    room.users.forEach(function (user) {
      if(user === data.twitterName) {add = false};
    })
    if (add) room.addUser(data.twitterName)
    console.log('join hit!?', room, add)
    draftio.to(room.leagueId).emit('draftInfo', room)
  })
})

indexio.on('connection', function(socket){
  console.log('a user connected to index');
  if (socket.request.session.passport){
    socket.emit('new join', socket.request.session.passport.user.displayName + ' has joined the room.')
  }
  socket.on('chat message', function (msg) {
    console.log('message: ', msg);
    socket.emit('chat message', msg);
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
