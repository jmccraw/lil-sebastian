"use strict";

/**
  * The start screen
  */
var _START = {
  "gamePress": function() {
    console.log("send", "event", "Vulture, Video Game", "Lil Sebastian", "Start Game");
    // ga("send", "event", "Vulture, Video Game", "Lil Sebastian", "Start Game");
    game.state.start("main");
  },

  "create": function() {
    var startScreen;
    if (!settings.global.mobile) {
      startScreen = game.add.sprite(0, 0, "startScreen");
    }
    else {
      startScreen = game.add.sprite(0, 0, "startScreenMobile");
      startScreen.scale.setTo(.5, .5);
    }

    var key = game.input.keyboard.createCursorKeys();
    key.up.onDown.add(this.gamePress, this);
    game.input.onDown.add(this.gamePress, this);
  }
};