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
var helpers = require('./lib/helpers.js')
var Twitter = require('twitter');


require('dotenv').load();

var routes = require('./routes/index');
var users = require('./routes/users');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

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

var showio = io.of('/showio');
var draftio = io.of('/draftio');
var indexio = io.of('/index');

//SHOW IO
showio.on('connection', function (socket) {
  socket.on('players', function (data) {
    var team1score = 0
    var team2score = 0
    var team1 = data.slice(0,4)
    var team2 = data.slice(5,9)
    client.stream('statuses/filter', {track: data.join(',')}, function(stream) {
      stream.on('data', function(tweet) {
        
        console.log(tweet.text, i);
      });
      stream.on('error', function(error) {
        throw error;
      });
    });
  })  
})

//INDEX IO
indexio.on('connection', function(socket){
  console.log('a user connected to index');
  if (socket.request.session.passport){
    indexio.emit('new join', socket.request.session.passport.user.username + ' has joined the room.')
    socket.on('disconnect', function () {
      indexio.emit('new join', socket.request.session.passport.user.username + ' has disconnected')
    })
  }
  socket.on('chat message', function (msg) {
    console.log('message: ', msg);
    indexio.emit('chat message', socket.request.session.passport.user.username + ': ' + msg);
  })
});


//DRAFT IO
var Rooms = {};

draftio.on('connection', function (socket) {
  console.log('connected to a draft room')
  if (socket.request.session.passport){
    socket.emit('twitterName', {twitterName: socket.request.session.passport.user.username})
    draftio.emit('new join', socket.request.session.passport.user.username + ' has joined the room.')
    socket.on('disconnect', function () {
      draftio.emit('new join', socket.request.session.passport.user.username + ' has disconnected')
    })
  }
  socket.on('join', function (data) {
    console.log('join hit')
    socket.join(data.leagueId)
    var roomIn;
    dbCalls.findLeague(data.leagueId).then(function (league) {
      roomIn = new Room(data.leagueId, league)
      roomIn.draftOrderGenerate();
      dbCalls.findOrCreateRoom(data.leagueId, roomIn).then(function (room) {
        Rooms[data.leagueId] = room
        Rooms[data.leagueId].__prot__ = Room.prototype
        console.log(Rooms[data.leagueId], 'before push')
        socket.join(room.leagueId)
        helpers.uniquePush(data.twitterName, Rooms[data.leagueId].users)
        console.log('before generate')
        dbCalls.updateRoom(Rooms[data.leagueId]).then(function () {
          draftio.to(room.leagueId).emit('draftInfo', Rooms[data.leagueId])
        })
      })
    })
    socket.on('ready', function (data) {
      console.log(data.leagueId, 'ready hit', Rooms[data.leagueId])
      helpers.uniquePush(socket.request.session.passport.user.username, Rooms[data.leagueId].ready)
      socket.join(data.leagueId)
      draftio.to(data.leagueId).emit('draftInfo', Rooms[data.leagueId])
      draftio.to(data.leagueId).emit('chat message', socket.request.session.passport.user.username + ' is ready to start!')
    })
    socket.on('chat message', function (data) {
      console.log('message: ', data.msg);
      socket.join(data.leagueId)
      draftio.to(data.leagueId).emit('chat message', socket.request.session.passport.user.username + ': ' + data.msg);
    })
    socket.on('start', function (data) {
      console.log('start going', Rooms[data.leagueId])
      Rooms[data.leagueId].__proto__ = Room.prototype;
      var userId = socket.request.session.passport.user.username;
      socket.join(data.leagueId)
      draftio.to(data.leagueId).emit('draftInfo', Rooms[data.leagueId])
      if (!Rooms[data.leagueId].active){
        console.log('start not active__________________________________________________', Rooms[data.leagueId].active)
        Rooms[data.leagueId].activate()
        dbCalls.updateRoom(Rooms[data.leagueId]).then(function (room) {
          draftio.to(data.leagueId).emit('chat message', 'The Draft has begun. ');
          console.log(Rooms[data.leagueId].whosTurn(userId))
          draftio.to(data.leagueId).emit('turn', {turn: Rooms[data.leagueId].whosTurn(userId)})
        })
      }
    })
    socket.on('pick', function (data) {
      var userId = socket.request.session.passport.user.username;
      Rooms[data.leagueId].turn++;
      console.log('before pick push', Rooms[data.leagueId].league.teams[userId])
      Rooms[data.leagueId].league.teams[userId].members.push(data.pick);
      console.log('after pick push')
      delete Rooms[data.leagueId].league.players[data.pick];
      if (Rooms[data.leagueId].turn === Rooms[data.leagueId].draftorder.length){
        Rooms[data.leagueId].league.status = 1;
        socket.join(data.leagueId)
        console.log('finished!', data.leagueId, Rooms[data.leagueId].league)
        dbCalls.updateLeague({id: data.leagueId}, Rooms[data.leagueId].league).then(function () {
          draftio.to(data.leagueId).emit('finished', data.leagueId)
        })
      } 
      dbCalls.updateRoom(Rooms[data.leagueId]).then(function () {
        if (Rooms[data.leagueId].league.status === 0){
          socket.join(data.leagueId)
          draftio.to(data.leagueId).emit('draftInfo', Rooms[data.leagueId])
          draftio.to(data.leagueId).emit('chat message', userId + " has picked " + data.pick)
          draftio.to(data.leagueId).emit('pick', {pick: data.pick, turn: Rooms[data.leagueId].whosTurn()})
          draftio.to(data.leagueId).emit('turn', {turn: Rooms[data.leagueId].whosTurn(userId)})
        }
      })
    })
    socket.on('turn', function (data) {
      var userId = socket.request.session.passport.user.username;
      console.log('at turn', data, userId)
      dbCalls.findRoom(data.leagueId).then(function (room) {
        socket.join(data.leagueId)
        Rooms[data.leagueId] = room;
        Rooms[data.leagueId].__proto__ = Room.prototype;
        draftio.to(data.leagueId).emit('turn', {turn: Rooms[data.leagueId].whosTurn(userId)})
      })
    })
  })
})

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
