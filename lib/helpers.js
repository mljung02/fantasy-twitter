var Player = require('./players.js')

var helpers = {
  convertTrendsToPlayers: function (trends) {
    return trends.map(function (trend, i) {
      return new Player(trend.name.replace('.','dot'), trend.url)
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
  },
  
  scoreCalc: function (obj, team, string) {
    // console.log(team, string)
    var out = obj
    var testArray = string.split(' ')
    team.forEach(function (word) {
      testArray.forEach(function (otherword) {
        if (word.toLowerCase().replace('#', '') === otherword.toLowerCase().replace('#', '')){
          out[word].score++
          out[word].tweets.push(string)
        }
      })
    })
    return out;
  },
  
  arrayToScore: function (array) {
    var out = {}
    array.forEach(function (element, i) {
      out[element] = {text: element, score: 0, tweets:[], index: i}
    })
    return out;
  },
  
  // scorePerson: function (team, string) {
  //   if (string){
  //     var out
  //     var testArray = string.split(' ')
  //     team.forEach(function (word) {
  //       testArray.forEach(function (otherword) {
  //         if (word.toLowerCase().replace('#', '') === otherword.toLowerCase().replace('#', '')){
  //           out = word;
  //         }
  //       })
  //     })
  //     return out;
  //   }
  // },
    
  scorePerson: function (team, string) {
    if (string){
      var out = {}
      team.forEach(function (word) {
        var reg = new RegExp(word);
        if (reg.test(string)) {
          out.player = word;
          out.tweet = string;
        }
      })
      return out;
    }
  },
}

module.exports = helpers