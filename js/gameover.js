"use strict";

/**
  * The game over screen
  */
var _GAMEOVER = {
  "finalScore": {},
  "shareScore": {},
  "facebook": {},
  "twitter": {},
  "sebastian": {},
  "gameOver": {},
  "subtext": {},
  "tryAgain": {},
  "bigText": {
    "font": "400 22px/1.5 Arcade-Normal, Arial, sans-serif",
    "fill": "#fff",
    "align": "center"
  },
  "mediumText": {
    "font": "400 16px/1.5 Arcade-Normal, Arial, sans-serif",
    "fill": "#fff",
    "align": "center"
  },
  "smallText": {
    "font": "400 12px/1.5 Arcade-Normal, Arial, sans-serif",
    "fill": "#fff",
    "align": "center"
  },

  "shareToFacebook": function() {
    FB.ui({
      "method": "feed",
      "link": window.location.href,
      "picture": "http://pixel.nymag.com/content/dam/daily/vulture/2014/05/15/15-game-of-thrones.jpg",
      "name": "“Parks and Recreation” The Li'l Sebastian Retro Game",
      "caption": " ",
      "description": "I scored " + settings.global.score + " in Vulture's retro “Parks and Recreation” game."
    }, function(response){});

    // Omniture custom tracking
    //G.readOmnitureOnPageView(this, "38", window.location.href + " Facebook Customized Share");
    // Google Analytics Event tracking
    //ga("send", "event", "Vulture, Video Game", "Lil Sebastian", "Facebook Share");
  },

  "shareToTwitter": function() {
    // try to launch native app
    if (settings.global.mobile) {
      window.location.href = "twitter://post?message=" + encodeURIComponent("I scored " + settings.global.score +
        " in @Vulture's @ParksAndRecNBC #retrogame! #BeatThat " + window.location.href);
    }
    // otherwise, do it the standard way
    setTimeout(function() {
      window.open("http://twitter.com/intent/tweet" +
        "?source=tweetbutton&text=" + encodeURIComponent("I scored " + settings.global.score +
        " in @Vulture's @ParksAndRecNBC #retrogame! #BeatThat") + "+" + encodeURIComponent(window.location.href), "Tweet Your Score",
        "width=600,height=300,left=" + Math.ceil((window.innerWidth / 2) - 300) + ",top=" + Math.ceil((window.innerHeight / 2) - 127));
    }, 100);

    // Omniture custom tracking
    //G.readOmnitureOnPageView(this, "39", window.location.href + " Twitter Customized Share");
    // Google Analytics Event tracking
    //ga("send", "event", "Vulture, Video Game", "Lil Sebastian", "Twitter Share");
  },

  "restartGame": function() {
    console.log("send", "event", "Vulture, Video Game", "Lil Sebastian", "Restart Game, Key");
    // ga("send", "event", "Vulture, Video Game", "Lil Sebastian", "Restart Game, Key");
    // stop all the timer loops from generating new objects
    game.time.reset();
    game.state.start("main");
  },

  "restartGameTap": function(tap) {
    if (!tap.targetObject) {
      console.log("_trackEvent", "Vulture, Video Game", "Lil Sebastian", "Restart Game, Tap");
      // ga("send", "event", "Vulture, Video Game", "Lil Sebastian", "Restart Game, Tap");
      game.state.start("main");
    }
  },

  "preload": function() {
    this.finalScore = game.add.text(game.world.centerX, 35, "SCORE " + settings.global.score, this.bigText);
    this.finalScore.anchor.setTo(.5, .5);
    this.finalScore.alpha = 0;

    this.shareScore = game.add.text(game.world.centerX, 70, "SHARE YOUR SCORE:", this.mediumText);
    this.shareScore.anchor.setTo(.5, .5);
    this.shareScore.alpha = 0;
    if (!settings.global.mobile) {
      this.facebook = game.add.button(90, 90, "facebook", this.shareToFacebook, this);
      this.twitter = game.add.button(290, 90, "twitter", this.shareToTwitter, this);
    }
    else {
      this.facebook = game.add.button(game.world.centerX - 77, 90, "facebook", this.shareToFacebook, this);
      this.twitter = game.add.button(game.world.centerX - 77, 150, "twitter", this.shareToTwitter, this);
    }
    this.facebook.alpha = 0;
    this.twitter.alpha = 0;

    this.gameOver = game.add.text(game.world.centerX, game.world.centerY + 10, "GAME OVER", this.bigText);
    this.gameOver.anchor.setTo(.5, .5);
    this.gameOver.alpha = 0;
    if (!settings.global.mobile) {
      this.subtext = game.add.text(185, game.world.centerY + 50, "Bye Bye, Li'l Sebastian", this.smallText);
    }
    else {
      this.subtext = game.add.text(game.world.centerX, game.world.centerY + 50, "Bye Bye,\nLi'l Sebastian", this.smallText);
    }
    this.subtext.anchor.setTo(.5, .5);
    this.subtext.alpha = 0;

    if (!settings.global.mobile) {
      this.tryAgain = game.add.sprite(160, game.world.height - 65, "tryAgain");
    }
    else {
      this.tryAgain = game.add.text(game.world.centerX, game.world.height * .87, "TRY AGAIN", this.mediumText);
    }
    this.tryAgain.anchor.setTo(.5, .5);
    this.tryAgain.alpha = 0;
  },

  "create": function() {
    // reset player location, if modified
    settings.player.tutorial.modified = false;

    if (!settings.global.mobile) {
      this.sebastian = game.add.sprite(game.world.width - 130, -100, "sebastian");
      game.add.tween(this.sebastian).to({"y": game.world.height - 120}, 2000, Phaser.Easing.Bounce.Out, true, 0, 0, false);
    }
    else {
      this.sebastian = game.add.sprite(game.world.centerX - 39, -100, "sebastian");
      game.add.tween(this.sebastian).to({"y": game.world.height * .654}, 2000, Phaser.Easing.Bounce.Out, true, 0, 0, false);
    }

    game.add.tween(this.finalScore).to({"alpha": 1}, 500, Phaser.Easing.Linear.None, true, 1000, 0, false);

    game.add.tween(this.shareScore).to({"alpha": 1}, 500, Phaser.Easing.Linear.None, true, 1500, 0, false);
    game.add.tween(this.facebook).to({"alpha": 1}, 500, Phaser.Easing.Linear.None, true, 1700, 0, false);
    game.add.tween(this.twitter).to({"alpha": 1}, 500, Phaser.Easing.Linear.None, true, 1700, 0, false);

    game.add.tween(this.gameOver).to({"alpha": 1}, 500, Phaser.Easing.Linear.None, true, 2200, 0, false);
    game.add.tween(this.subtext).to({"alpha": 1}, 500, Phaser.Easing.Linear.None, true, 2400, 0, false);

    game.add.tween(this.tryAgain).to({"alpha": 1}, 500, Phaser.Easing.Linear.None, true, 2600, 0, false)
      .to({"alpha": 0}, 500, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE, true);

    var keys = game.input.keyboard.createCursorKeys();
    keys.left.onUp.add(this.restartGame, this);
    keys.right.onUp.add(this.restartGame, this);
    keys.up.onUp.add(this.restartGame, this);
    keys.down.onUp.add(this.restartGame, this);
    game.input.onUp.add(this.restartGameTap, this);

    // send score to Google Analytics
    console.log("_trackEvent", "Vulture, Video Game", "Lil Sebastian", "Score: " + settings.global.score);
    // ga("send", "event", "Vulture, Video Game", "Lil Sebastian", "Score: " + settings.global.score);
  }
};