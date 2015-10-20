var socket = io.connect('/draftio');
var leagueIdExtract = /draft\/(.+)/
var leagueId = leagueIdExtract.exec(window.location.href)[1]
console.log(leagueId)
var roomLocal = {users:[]}

socket.on('twitterName', function (data) {
  console.log(data)
  socket.emit('join', {leagueId: leagueId, twitterName: data.twitterName})
})

socket.on('draftInfo', function(room){
  console.log('di hit');
  if (roomLocal.users.length < room.users.length){
    $('#users').text("Connected Users: " + room.users.toString().split(',').join(', '));
    roomLocal = room;
  }
  if (roomLocal.ready.length != room.ready.length){
    $('#ready_users').text("Ready users: " + room.ready.toString().split(',').join(', '))
    roomLocal = room;
  }
  if (roomLocal.users.length === parseInt(roomLocal.league.number) && room.ready.length === 0){
    console.log('activate');
    $('#ready_users').text("Ready users: ")
    $('#start_draft').prop('disabled', false)
  } else if (roomLocal.ready.length === parseInt(roomLocal.league.number) && !roomLocal.active){
    roomLocal = room;
    console.log('begin?')
    beginDraft()
  }
});

socket.on('new join', function(msg){
  $('#messages').append($('<li>').css('font-style','italic').text(msg));
});

$('#start_draft').click(function () {
  console.log('start emit')
  socket.emit('ready', {leagueId: leagueId})
  $('#start_draft').prop('disabled', true)
})

$('#chat').submit(function(){
  socket.emit('chat message', {msg: $('#message_input').val(), leagueId: leagueId});
  $('#message_input').val('');
  return false;
});

socket.on('chat message', function(msg){
  $('#messages').append($('<li>').text(msg));
});

$('#pick').click(function () {
  var pick = $('#players').val()
  socket.emit('pick', {leagueId: leagueId, pick:pick})
  $('#players option:selected').remove()
})

function beginDraft(){
  hidePreDraft()
  socket.emit('start', {leagueId: leagueId})
}

function hidePreDraft(){
  $('#predraft').css('display','none')
  $('#active_draft').css('display','')
}