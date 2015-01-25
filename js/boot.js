"use strict";

/**
  * Pre-load screen, boot sequence
  */
var _BOOT = {
  "preload": function() {
    game.load.image("progress", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAAUAQMAAADyauCJAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAADUExURf///6fEG8gAAAAPSURBVCjPY2AYBaOAgQEAAggAATy5/7MAAAAASUVORK5CYII=");
    game.stage.backgroundColor = "#00bcf1";
    // check if on mobile and adjust accordingly
    if (/\/m\//.test(window.location.href)) {
      settings.global.mobile = true;
      // scale to height, but if height would make width too large, base it on width instead
      /*if ((window.innerHeight * (game.width / game.height) > 305) || (window.innerHeight >= 600)) {
        game.scale.maxWidth = 305;
        game.scale.maxHeight = game.scale.maxWidth * (game.height / game.width);
      }
      // else, scaled based on height
      else {
        game.scale.maxHeight = window.innerHeight;
        game.scale.maxWidth = game.scale.maxHeight * (game.width / game.height);
      }*/
      //game.scale.setSize();
      game.scale.resize();
      console.log("_trackEvent", "Vulture, Video Game", "Game of Thrones", "Mobile");
      // _gaq.push(["_trackEvent", "Vulture, Video Game", "Game of Thrones", "Mobile"]);
    }
  },

  "create": function() {
    game.state.start("load");
  }
};