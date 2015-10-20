function League(id, name, duration, size, publicLeague){
  this.id = id;
  this.name = name;
  this.duration = duration;
  this.users = [];
  this.teams = {};
  this.players = {};
  this.number = size;
  this.status = 0;
  this.public = publicLeague ? true : false;
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

League.prototype.addPlayers = function(array){
  for (var i = 0; i < array.length; i++) {
    console.log('looooop', array[i].name)
    this.players[array[i].name] = array[i];
  }
}

League.prototype.drafted = function () {
  this.status=1;
}

League.prototype.finished = function () {
  this.status=2;
}

League.prototype.addTeam = function (team) {
  this.teams.push(team)
}

module.exports = League