"use strict";

/**
  * Tutorial for mobile users
  */
var _TUTORIAL = {
  "tutorialText": {},
  "tutorialPlayer": {},
  "hit": {},
  "hitCount": 0,

  "gameStart": function() {
    game.time.reset();
    game.state.start("main");
  },

  "continueCountdown": function(countdown, text, last) {
    var tempTween;
    var self = this;
    countdown.text = text;
    countdown.scale.x = 1;
    countdown.scale.y = 1;
    countdown.alpha = 1;
    game.add.tween(countdown).to({"alpha": 0}, 1000, Phaser.Easing.Linear.NONE, true, 0, 0, false);
    tempTween = game.add.tween(countdown.scale).to({"x": 3, "y": 3}, 1000, Phaser.Easing.Linear.NONE, true, 0, 0, false);
    tempTween._lastChild.onComplete.add(function() {
      if (!last) {
        self.continueCountdown(countdown, 1, true);
      }
      else {
        countdown.destroy();
        settings.player.tutorial.modified = true;
        settings.player.tutorial.x = self.tutorialPlayer.x;
        settings.player.tutorial.y = self.tutorialPlayer.y;
        self.tutorialPlayer.kill();
        self.gameStart();
      }
    });
  },

  "startCountdown": function() {
    var tempTween;
    var self = this;
    var countdown = game.add.text(game.world.centerX, game.world.centerY, "3", {
      "font": "400 30px/1.5 Arcade-Normal, Arial, sans-serif",
      "fill": "#fff",
      "textAlign": "center"
    });
    countdown.anchor.setTo(0.5, 0.4);
    game.add.tween(countdown).to({"alpha": 0}, 1000, Phaser.Easing.Linear.NONE, true, 0, 0, false);
    tempTween = game.add.tween(countdown.scale).to({"x": 3, "y": 3}, 1000, Phaser.Easing.Linear.NONE, true, 0, 0, false);
    tempTween._lastChild.onComplete.add(function() {
      self.continueCountdown(countdown, 2, false);
    });
  },

  "registerHit": function() {
    var tempTween;
    var self = this;
    if (self.hitCount === 1) {
      self.hit.kill();
      tempTween = game.add.tween(self.tutorialText).to({"alpha": 0}, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
      tempTween._lastChild.onComplete.add(function() {
        self.tutorialText.destroy();
        self.startCountdown();
      });
    }
    else {
      self.hit.alpha = 0;
      self.hit.x = game.world.x + game.world.width - 100;
      tempTween = game.add.tween(self.tutorialText).to({"alpha": 0}, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
      tempTween._lastChild.onComplete.add(function() {
        self.hitCount = 1;
        self.tutorialText.text = "TAP AND\nHOLD\nTO MOVE\nRIGHT";
        self.tutorialText.x = game.world.width - self.tutorialText.width - 45;
        game.add.tween(self.tutorialText).to({"alpha": 1}, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
        game.add.tween(self.hit).to({"alpha": 1}, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
      });
    }
  },

  "moveLeft": function() {
    this.tutorialPlayer.body.velocity.x = -settings.player.speed;
  },

  "moveRight": function() {
    this.tutorialPlayer.body.velocity.x = settings.player.speed;
  },

  "stopMoving": function() {
    this.tutorialPlayer.body.velocity.x = 0;
    this.tutorialPlayer.animations.stop();
  },

  "testMovement": function(touch) {
    var playerOffset = this.tutorialPlayer.x + (this.tutorialPlayer.width / 2);
    if (touch.position.x < playerOffset) {
      this.moveLeft();
    }
    else if (touch.position.x > playerOffset) {
      this.moveRight();
    }
    else {
      this.stopMoving();
    }
  },

  "preload": function() {
    game.load.image("hitLocation", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeAgMAAABGXkYxAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJUExURQAAAP///4sWDxKB31YAAAABdFJOUwBA5thmAAAAOUlEQVQY02NgYGBYtYABAjAYWqFRDdgZXFNDQ7OwMpiWhgLBCmyMlSA6NGwBaQw8BuJxBj7H4/QyAHRlPYfjicKDAAAAAElFTkSuQmCC");
  },

  "create": function() {
    // physics engine
    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.tutorialText = game.add.text(game.world.x + 30, game.world.centerY + 140, "TAP AND\nHOLD\nTO MOVE\nLEFT", {
      "font": "400 11px/1.5 Arcade-Normal, Arial, sans-serif",
      "fill": "#fff",
      "align": "center"
    });

    // create the player
    this.tutorialPlayer = game.add.sprite(game.world.centerX - 34, game.world.height - 129, "character");
    game.physics.arcade.enable(this.tutorialPlayer);
    this.tutorialPlayer.body.collideWorldBounds = true;
    this.tutorialPlayer.body.setSize(this.tutorialPlayer.width, this.tutorialPlayer.height / 2, 0, 0);

    // create hit point
    this.hit = game.add.sprite(game.world.x + 50, game.world.centerY + 210, "hitLocation");
    game.physics.arcade.enable(this.hit);

    game.input.onDown.add(this.testMovement, this);
    game.input.onUp.add(this.stopMoving, this);
  },

  "update": function() {
    game.physics.arcade.overlap(this.tutorialPlayer, this.hit, this.registerHit, null, this);
  }
};