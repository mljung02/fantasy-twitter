var socket = io.connect('/index');
console.log('appjs wired')
$('#chat').submit(function(){
  console.log('chat yo', $('#message').val())
  socket.emit('chat message', $('#message').val());
  console.log('erase now')
  $('#message').val('');
  return false;
});

socket.on('chat message', function(msg){
  $('#messages').append($('<li>').text(msg));
});

socket.on('new join', function(msg){
  $('#messages').append($('<li>').append('<i>')text(msg));
});