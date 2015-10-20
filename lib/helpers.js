var Player = require('./players.js')

var helpers = {
  convertTrendsToPlayers: function (trends) {
    return trends.map(function (trend, i) {
      return new Player(trend.name, trend.url)
    })
  },
  
  initializeLeague: function (players) {
    
  },
  
  checkSession: function (req, res, next) {
    if (!req.user){
      res.redirect('/')
    }
    next()
  },
  
  uniquePush: function (string, array) {
    var add = true;
    array.forEach(function (e) {
      if(e === string) {add = false};
    })
    if (add) array.push(string)
    return array
  }
}

module.exports = helpers