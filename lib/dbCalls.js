require('dotenv').load()
var db = require('monk')(process.env.MONGOLAB_URI);
var users = db.get('users');
var bcrypt= require('bcrypt');
var leagues = db.get('leagues');
var rooms = db.get('rooms');

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
    console.log('inserting league', league);
    return leagues.insert(league)
  },
  
  findLeague: function (id) {
    console.log('finding league id= ', id);
    return leagues.findOne({id: id});
  },
  
  findAllLeagues: function () {
    console.log('finding all leagues');
    return leagues.find({});
  },
  
  updateLeague: function (id, league) {
    console.log('updating league', id, league)
    return leagues.update(id, league)
  },
  
  findPublicLeagues: function () {
    console.log('finding public leagues');
    return leagues.find({public:true, status:0});
  },
  
  createRoom: function (room) {
    console.log('creating room');
    return rooms.insert(room)
  },
  
  updateRoom: function (room) {
    console.log('updating room')
    return rooms.update({id: room.id}, room)
  },
  
  findRoom: function (id) {
    return rooms.findOne({id: id})
  },
  
  findOrCreateRoom: function (id, roomIn) {
    console.log('room time')
    return new Promise(function (success, failure) {
      rooms.findOne({id: id}).then(function (room) {
        if (room){
          console.log('room exists', room)
          success(room)
        } else {
          console.log('inserting!')
          rooms.insert(roomIn).then(function (room) {
            success(room)
          })
        }
      })
    })
  }
}

module.exports = dbCalls