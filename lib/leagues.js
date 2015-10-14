function League(id, name, duration, size){
  console.log(id, name, duration, size)
  this.id = id;
  this.name = name;
  this.duration = duration;
  this.users = [];
  this.players = [];
  this.number = size;
  this.statuss = 0;
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
  this.players = players
}

League.prototype.drafted = function () {
  this.status=1;
}

League.prototype.finished = function () {
  this.status=2;
}

module.exports = League