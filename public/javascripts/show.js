console.log('wired show')
var socket = io.connect('/showio')

var playersUp = [];

for (var i = 0; i < $('.playerScore').length; i++) {
  var str = $('.playerScore')[i].innerText.slice(0, -1)
  playersUp.push(str)
}
console.log(playersUp)
socket.emit('players', playersUp)

socket.on('scores', function (data) {
  console.log(data)
  for (var i = 0; i < $('.playerScore').length; i++) {
    if (data === $('.playerScore')[i].innerText.slice(0, -1) ||
        data === $('.playerScore')[i].innerText.slice(0, -2) ||
        data === $('.playerScore')[i].innerText.slice(0, -3) ||
        data === $('.playerScore')[i].innerText.slice(0, -4)) {
      $('.playerScore')[i].children[0].innerText++
      if (i < 5){
        $('.totalScore')[0].innerText++
      } else {
        $('.totalScore')[1].innerText++
      }
    }
  }
})

// $('.expander').simpleexpand();