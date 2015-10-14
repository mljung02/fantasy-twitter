var Player = require('./players.js')

var helpers = {
  convertTrendsToPlayers: function (trends) {
    return trends.map(function (trend, i) {
      return new Player(trend.name, trend.url)
    })
  },
  
  initializeLeague: function (players) {
    
  }
}

module.exports = helpers