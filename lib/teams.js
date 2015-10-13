function Team(){
  this.players = []
  this.owner = null
}

Team.prototype.addPlayer = function(player){
  this.players.push(player)
}

Team.prototype.assign = function (user) {
  this.owner = user
}

module.exports = Team