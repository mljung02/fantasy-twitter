function Player(name, url){
  this.name = name;
  this.url = url || null;
  this.score = 0;
}

Player.prototype.score = function(){
  this.score++;
}

module.exports = Player;