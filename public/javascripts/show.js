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
  for (var i = 0; i < $('.playerScore').length; i++) {
    if (data.player === $('.playerScore')[i].id) {
      $('.playerScore')[i].children[0].innerText++
      var p = document.createElement("P")
      p.innerHTML = data.tweet
      var node = $('.playerScore')[i].children[1]
      console.log('before insert', data.tweet, node.childNodes[0])
      node.insertBefore(p, node.childNodes[0])
      console.log('after insert')
      if (i < 5){
        $('.totalScore')[0].innerText++
      } else {
        $('.totalScore')[1].innerText++
      }
    }
  }
})

$('.expander').simpleexpand();