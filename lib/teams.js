function Team(owner){
  this.players = [];
  this.owner = owner;
}

Team.prototype.addPlayer = function(player){
  this.players.push(player);
}

Team.prototype.assign = function (user) {
  this.owner = user;
}

module.exports = Team;