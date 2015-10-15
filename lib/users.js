function User(twitter_id, displayName){
  this.twitter_id = twitter_id;
  this.displayName = displayName
  this.drafts = [];
  this.leagues = [];
}

User.prototype.joinLeague = function (league) {
  this.leagues.push(league)
}

User.prototype.joinDraft = function (league) {
  this.drafts.push(league)
}

module.exports = User