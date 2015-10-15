var socket = io.connect('/draftio');
var leagueIdExtract = /draft\/(.+)/
var leagueId = leagueIdExtract.exec(window.location.href)[1]
console.log(leagueId)

var roomLocal = {
  users: []
}

socket.on('twitterName', function (data) {
  console.log(data)
  socket.emit('join', {leagueId: leagueId, twitterName: data.twitterName})
})

socket.on('draftInfo', function(room){
  console.log(room)
  if (roomLocal.users.length < room.users.length){
    for (var i = roomLocal.users.length; i < room.users.length; i++) {
      console.log(room.users[i])
      $('#users').append($('<li>').text(room.users[i]));
    }
  }
  roomLocal = room;
});