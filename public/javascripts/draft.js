var socket = io.connect();
var leagueIdExtract = /draft\/(.+)/
var leagueId = leagueIdExtract.exec(window.location.href)[1]
console.log(leagueId)
function joinRoom(id){
  console.log(id)
  socket.emit('join', {league: id})
}

joinRoom(leagueId);

socket.on('userjoin', function(users){
    $('#users').innerHTML = '';
  users.forEach(function (user) {
    $('#users').append($('<li>').text(user));
  })
});