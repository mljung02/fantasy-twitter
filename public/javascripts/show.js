console.log('wired show')
var socket = io.connect('/showio')

var playersUp = [];

for (var i = 0; i < $('li').length; i++) {
  playersUp.push($('li')[i].innerText)
}

playersUp

socket.emit('players', playersUp)