"use strict";

/**
  * The start screen
  */
var _START = {
  "gamePress": function() {
    console.log("_trackEvent", "Vulture, Video Game", "Game of Thrones", "Start Game");
    // _gaq.push(["_trackEvent", "Vulture, Video Game", "Game of Thrones", "Start Game"]);
    game.state.start("main");
  },

  "create": function() {
    var key = game.input.keyboard.createCursorKeys();
    key.up.onUp.add(this.gamePress, this);
    game.input.onUp.add(this.gamePress, this);
  }
};