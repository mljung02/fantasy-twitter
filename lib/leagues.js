function League(id, name, duration, size, publicLeague){
  this.id = id;
  this.name = name;
  this.duration = duration;
  console.log('creating league in class')
  this.users = [];
  this.players = [];
  this.number = size;
  this.status = 0;
  this.publicLeague = publicLeague || false;
}

League.prototype.addUser = function(user){
  console.log('adding user ', user, this.users, this.number)
  if (this.users.length < this.number){
    console.log('about to push')
    this.users.push(user);
    console.log('pushed', this.users)
  }
  console.log('finished')
}

League.prototype.addPlayers = function(players){
  console.log('adding players')
  this.players = this.players.concat(players)
}

League.prototype.drafted = function () {
  this.status=1;
}

League.prototype.finished = function () {
  this.status=2;
}

module.exports = League