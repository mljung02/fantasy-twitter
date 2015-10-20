var socket = io.connect('/index');
console.log('appjs wired')
$('#chat').submit(function(){
  socket.emit('chat message', $('#message_input').val());
  $('#message_input').val('');
  return false;
});

socket.on('chat message', function(msg){
  $('#messages').append($('<li>').text(msg));
  // $('#messages').animate({
  //   scrollTop: $('#messages')[0].scrollHeight}, 2000);
});

socket.on('new join', function(msg){
  $('#messages').append($('<li>').css('font-style','italic').text(msg));
  $('#message_button').prop('disabled', false)
});