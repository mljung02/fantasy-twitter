function Room(id,league){
  this.id = id;
  this.users = [];
  this.league = league;
  this.active = false;
  this.turn = 0;
  this.ready = [];
  this.draftorder = [];
}

Room.prototype.addUser = function (user){
  this.users.push(user);
}

Room.prototype.removeUser = function (user) {
  this.users.filter(function (e) {
    return e != user
  })
}

Room.prototype.activate = function () {
  this.active = true;
  for (var i = 0; i < this.users.length; i++) {
    this.league.teams[this.users[i]] = {members: [], teamName: this.users[i]};
  }
  console.log('in activate', this)
}

Room.prototype.draftOrderGenerate = function () {
  console.log('IN TURN !IU)(UFE)(U(S))')
  if (parseInt(this.league.number) === 2){
    this.draftorder = [0,1,1,0,0,1,1,0,0,1]
  }
  if (parseInt(this.league.number) === 3){
    this.draftorder = [0,1,2,2,1,0,0,1,2]
  }
  if (parseInt(this.league.number) === 4){
    this.draftorder = [0,1,2,3,3,2,1,0]
  }
}

Room.prototype.finishDraft = function () {
  
}

Room.prototype.whosTurn = function (userId) {
  console.log('checking turn', this.users)
  return this.users[this.draftorder[this.turn]]
}

module.exports = Room;