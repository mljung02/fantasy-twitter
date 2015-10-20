function Draft(league){
  this.id = league.id;
  this.name = league.name;
  this.duration = league.duration;
  this.users = league.users || [];
  this.activeUsers = [];
  this.players = league.players;
  this.number = league.number;
  this.status = 0;
  this.publicLeague = league.publicLeague || false;
  this.turn 
}

Draft.prototype.addUser = function(user){
  if (this.users.length < this.number){
    console.log('about to push')
    this.users.push(user);
    console.log('pushed', this.users)
  }
  console.log('finished')
}

Draft.prototype.addPlayers = function(players){
  console.log('adding players')
  this.players = this.players.concat(players)
}

Draft.prototype.drafted = function () {
  this.status=1;
}

Draft.prototype.finished = function () {
  this.status=2;
}

module.exports = Draft