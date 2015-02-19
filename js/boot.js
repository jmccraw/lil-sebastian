"use strict";

/**
  * Pre-load screen, boot sequence
  */
var _BOOT = {
  "preload": function() {
    game.load.image("progress", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAAUAQMAAADyauCJAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAADUExURf///6fEG8gAAAAPSURBVCjPY2AYBaOAgQEAAggAATy5/7MAAAAASUVORK5CYII=");
    game.stage.backgroundColor = "#00bcf1";
  },

  "create": function() {
    game.state.start("load");
  }
};