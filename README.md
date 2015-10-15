a user visits the page
upon visiting site you see faq and completed leagues
you login via twitter
you see your leagues you can enter, your active leagues, and your completed leagues
you join a league you can enter
you see users logged into draft, league settings, league players(hashtags)
you rank the leagues in your queue
when it is your turn to draft, you draft off the top of your queue
upon completion of the draft you are redirect to the active league page


##DB
league.id string generated from league creator and timestamp
league.name string
league.duration time chosen on creation
league.users array of league participant ids
league.players array of player objects
league.number number of users in league
league.status 0:drafting 1:active 2:finished
league.publigLeague boolean default false

player.name phrase or hashtag from twitter
player.url link to twitter search
player.score int starts at 0, increments for each hit