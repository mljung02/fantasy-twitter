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
    users.findOne({id: profile.id}).then(function (user) {
      if (user){
        console.log('user exists', user)
      } else {
        console.log('inserting!?')
        users.insert({id: profile.id, displayName: profile.displayName})
      }
    })
  },
  
  createLeague: function (league) {
    console.log('inserting league')
    return leagues.insert(league)
  },
  
  findLeague: function (id) {
    console.log('finding league')
    return leagues.findOne({id: id})
  }
}

module.exports = dbCalls