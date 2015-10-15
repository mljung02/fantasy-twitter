function Room(id){
  this.id = id;
  this.users = [];
}

Room.prototype.addUser = function (user){
  this.users.push(user);
}

module.exports = Room;