  "use strict";

  var game;
  var player;
  var sign;
  var background;
  var cursors;
  var collectibles;
  var dodges;
  var dodgeTimer;
  var bonuses;
  var scoreboard;
  var gameLauncher;
  var settings = {
    "global": {
      "mobile": false,
      "score": 0,
      "getCount": 0,
      "level": 0
    },
    "player": {
      "killed": false,
      "speed": 400
    },
    "collectible": {
      "speed": 250,
      "offset": 1
    },
    "dodge": {
      "seconded": false,
      "speed": 200,
      "offset": 1
    },
    "bonus": {
      "speed": 400,
      "offset": 1
    },
    "sign": {
      "initiated": false,
      "isDead": false
    }
  };

  /**
    * Launches the game, if on mobile
    */
  var launchTheGame = function() {
    var theGame = document.getElementById("phaser-screen");
    theGame.style.display = "block";
    var count = 0;
    var keepStationary = setInterval(function() {
      if (++count > 50) {
        clearInterval(keepStationary);
      }
      window.scrollTo(0, document.getElementById("phaser-mobile-tap").offsetTop + 240);
    }, 100);
  };

  // set up the Phaser game instance
  // check if on mobile and adjust accordingly
  if (window.innerWidth < 600) {
    gameLauncher = document.getElementById("phaser-mobile-tap");
    gameLauncher.addEventListener("click", launchTheGame, false);

    settings.global.mobile = true;

    game = new Phaser.Game(Math.ceil(window.innerWidth) - 20, Math.ceil(window.innerHeight) - 50, Phaser.AUTO, "phaser-screen");

    console.log("send", "event", "Vulture, Video Game", "Lil Sebastian", "Mobile");
    // ga("send", "event", "Vulture, Video Game", "Lil Sebastian", "Mobile");
  }
  else {
    game = new Phaser.Game(531, 299, Phaser.AUTO, "phaser-screen");
    document.getElementById("phaser-loading").style.display = "none";
  }

  game.state.add("boot", _BOOT);
  game.state.add("load", _LOAD);
  game.state.add("start", _START);
  game.state.add("main", _MAIN);
  game.state.add("gameover", _GAMEOVER);
  game.state.start("boot");