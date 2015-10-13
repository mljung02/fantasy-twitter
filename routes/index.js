var express = require('express');
var router = express.Router();
var bcrypt= require('bcrypt');
var Twitter = require('twitter');
var passport = require('passport');
var twitterCalls = require('../lib/twitterCalls.js')
var dbCalls = require('../lib/dbCalls.js')
var helpers = require('../lib/helpers.js')

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var db = require('monk')(process.env.MONGOLAB_URI);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { });
});

router.get('/findtrends', function (req, res, next) {
  twitterCalls.getTrends().then(function (trends) {
    var players = helpers.convertTrendsToPlayers(trends[0].trends)
    res.render('index', {players: players})
  })
})

router.get('/login/twitter',
passport.authenticate('twitter'));


router.get('/login/twitter/return', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

router.get('/logout', function (req, res, next) {
  req.session.destroy()
  res.redirect('/')
})
module.exports = router;
