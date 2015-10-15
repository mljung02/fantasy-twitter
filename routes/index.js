var express = require('express');
var router = express.Router();
var bcrypt= require('bcrypt');
var Twitter = require('twitter');
var passport = require('passport');
var twitterCalls = require('../lib/twitterCalls.js')
var dbCalls = require('../lib/dbCalls.js')
var helpers = require('../lib/helpers.js')
var League = require('../lib/leagues.js')

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var db = require('monk')(process.env.MONGOLAB_URI);

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('rendering index')
  dbCalls.findAllLeagues().then(function (leagues) {
    console.log(res.locals.login)
    res.render('index', {leagues: leagues});
  })
});

router.get('/login/twitter',
passport.authenticate('twitter'));


router.get('/login/twitter/return', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    console.log('redirecting after user check!?')
    res.redirect('/');
});

router.get('/leagues/:id', function (req, res, next) {
  console.log('leagues show hit')
  dbCalls.findLeague(req.params.id).then(function (league) {
    if (!league) {
      res.render('leagues/error', {errors: ['League not found']})
    }
    res.render('leagues/show', {league: league})
  })
})

//private routes
router.use(helpers.checkSession)


router.get('/findtrends', function (req, res, next) {
  twitterCalls.getTrends().then(function (trends) {
    var players = helpers.convertTrendsToPlayers(trends[0].trends)
    res.render('index', {players: players})
  })
})


router.get('/new', function (req, res, next) {
  res.render('new')
})

router.post('/new', function (req, res, next) {
  twitterCalls.getTrends().then(function (trends) {
    console.log(trends)
    var id = req.user.id + Date.now();
    var players = helpers.convertTrendsToPlayers(trends[0].trends);
    console.log('creating league here ********************')
    console.log(id, req.body.name, req.body.duration, req.body.size, req.body.publicLeague)
    var league = new League(id, req.body.name, req.body.duration, req.body.size, req.body.publicLeague);
    console.log('about to add players')
    league.addPlayers(players);
    console.log('about to add user')
    league.addUser(req.user.id);
    console.log('about to create league')
    dbCalls.createLeague(league).then(function () {
      res.redirect('/draft/'+id)
    })
  })
  console.log(req.body, req.user)
})

router.get('/draft/:id', function (req, res, next) {
  dbCalls.findLeague(req.params.id).then(function (league) {
    res.render('draft', {league: league})
  })
})


router.get('/logout', function (req, res, next) {
  req.session.destroy()
  res.redirect('/')
})


module.exports = router;
