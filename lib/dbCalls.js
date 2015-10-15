require('dotenv').load()
var db = require('monk')(process.env.MONGOLAB_URI);
var users = db.get('users');
var bcrypt= require('bcrypt');
var leagues = db.get('leagues');

var dbCalls = {
  findUser: function(email) {
    return users.findOne({email: email})
  },
  
  findOrCreate: function (profile) {
    return new Promise(function (success, failure) {
      users.findOne({twitter_id: profile.id}).then(function (user) {
        if (user){
          console.log('user exists', user)
          success(user)
        } else {
          console.log('inserting!')
          users.insert({twitter_id: profile.id, displayName: profile.displayName}).then(function (user) {
            success(user)
          })
        }
      })
    })
  },
  
  createLeague: function (league) {
    console.log('inserting league')
    return leagues.insert(league)
  },
  
  findLeague: function (id) {
    console.log('finding league id= ', id)
    return leagues.findOne({id: id})
  },
  
  findAllLeagues: function () {
    console.log('finding all leagues');
    return leagues.find({})
  }
}

module.exports = dbCalls