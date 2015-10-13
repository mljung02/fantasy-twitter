require('dotenv').load()
var db = require('monk')(process.env.MONGOLAB_URI);
var users = db.get('users');
var bcrypt= require('bcrypt');

var dbCalls = {
  test: function () {
    console.log('test');
  },
  
  findUser: function(email) {
    return users.findOne({email: email})
  },
  
  findOrCreate: function (profile) {
    console.log('apihfeoihaofsd', profile)
    users.findOne({id: profile.id}).then(function (user) {
      if (user){
        console.log('user exists', user)
      } else {
        console.log('inserting!?')
        users.insert({id: profile.id, displayName: profile.displayName})
      }
    })
  },
}

module.exports = dbCalls