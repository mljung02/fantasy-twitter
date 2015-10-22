var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var twitterCalls = {
  getTrends: function(woeid){
    return new Promise(function (success, failure) {
      client.get('trends/place', {id: woeid || 2450022}, function (error, trends, response) {
        // console.log('khi', trends[0].trends)
        if (error) {
          failure(error)
        }
        console.log('success??????', trends[0])
        success(trends)
      })
    })
  },
}

module.exports = twitterCalls