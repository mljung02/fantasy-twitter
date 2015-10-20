var socket = io.connect('/draftio');
var leagueIdExtract = /draft\/(.+)/
var leagueId = leagueIdExtract.exec(window.location.href)[1]
console.log(leagueId)
var roomLocal = {users:[]}
var myTurn = false;
var myTwitter

socket.on('twitterName', function (data) {
  console.log(data)
  socket.emit('join', {leagueId: leagueId, twitterName: data.twitterName})
  myTwitter = data.twitterName;
})

socket.on('draftInfo', function(room){
  console.log('di hit');
  generateDraft(room)
  renderTeam(room)
  if (room.active){
    hidePreDraft();
    socket.emit('turn', {leagueId: leagueId})
  }
  roomLocal = room;
  console.log('di ready?', roomLocal.ready.length === parseInt(roomLocal.league.number), !roomLocal.active );
  $('#users').text("Connected Users: " + room.users.toString().split(',').join(', '));
  if (roomLocal.users.length === parseInt(roomLocal.league.number) && room.ready.length != parseInt(roomLocal.league.number)){
    $('#ready_users').text("Ready users: ")
    $('#ready_users').text("Ready users: " + room.ready.toString().split(',').join(', '))
    console.log('activate');
    $('#start_draft').prop('disabled', false)
  } else if (roomLocal.ready.length === parseInt(roomLocal.league.number) && !roomLocal.active){
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
  if (!pick){
    alert('You must select a topic.')
  } else {
    socket.emit('pick', {leagueId: leagueId, pick:pick})
    $('#players option:selected').remove()
  }
})

socket.on('pick', function (data) {
  removeFromDraft(data.pick)
})

socket.on('turn', function (data) {
  console.log(data, 'turn hit')
  checkTurn(data.turn)
})

socket.on('finished', function (data) {
  console.log('finsihed hit', data)
  window.location.assign("/leagues/"+data)
})

function checkTurn(string){
  $('#currentTurn').text('It is '+string+"\'s turn.")
  if (string === myTwitter){
    myTurn = true;
    $('#pick').prop('disabled', false)
  } else {
    myTurn = false;
    $('#pick').prop('disabled', true)
  }
}

function beginDraft(){
  hidePreDraft()
  socket.emit('start', {leagueId: leagueId})
}

function hidePreDraft(){
  $('#predraft').css('display','none')
  $('#active_draft').css('display','')
}

function removeFromDraft(player){
  console.log(player, 'howdy')
  $("#players option[value=\'"+player+"\']").remove()
}

function generateDraft(room){
  $("#players").empty()
  for (player in room.league.players) {
    var play = player.toString()
    $('#players').append($('<option>', {value: play}).text(play))
  }
}

function renderTeam(room){
  console.log('render team?')
  if (room.league.teams[myTwitter]){
    $('#myTeam').empty()
    room.league.teams[myTwitter].members.forEach(function (player) {
      $('#myTeam').append($('<li>').text(player))
    })
  }
}