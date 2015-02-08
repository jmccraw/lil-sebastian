"use strict";

/**
  * The main game state
  */
var _MAIN = {

  "addCollectible": function(player, collectible) {
    collectible.kill();
    settings.global.score += 100;
    scoreboard.text = "SCORE: " + settings.global.score;
    this.popUpText("+100", false, false);
  },

  "collectBonus": function(player, chalice) {
    chalice.kill();
    settings.global.score += 1000;
    scoreboard.text = "SCORE: " + settings.global.score;
    this.popUpText("+1000", true, true);
    this.generateCatchPhrase();
  },

  "killPlayer": function(player, dodge) {
    // stop all the timer loops from generating new objects
    game.time.removeAll();
    var blood = game.add.emitter(player.x + (player.width / 2), dodge.y, 200);
    blood.makeParticles("blood");
    blood.start(false, 800, 30);
    player.body.velocity.x = 0;
    player.animations.stop();
    collectibles.setAll("body.velocity.y", 0);
    collectibles.setAll("body.gravity.y", 0);
    dodges.setAll("body.velocity.y", 0);
    dodges.setAll("body.gravity.y", 1);
    bonuses.setAll("body.velocity.y", 0);
    bonuses.setAll("body.gravity.y", 0);
    bonuses.forEach(function(self) {
      self.animations.stop();
    });
    game.tweens.pauseAll();
    settings.player.killed = true;
    setTimeout(function() {
      game.state.start("gameover");
    }, 2500);
  },

  "moveLeft": function() {
    if (!settings.player.killed) {
      if (player.scale.x > 0) {
        player.scale.x *= -1;
      }
      player.body.velocity.x = -settings.player.speed;
      player.animations.play("fly", 20, true);
    }
  },

  "moveRight": function() {
    if (!settings.player.killed) {
      if (player.scale.x < 0) {
        player.scale.x *= -1;
      }
      player.body.velocity.x = settings.player.speed;
      player.animations.play("fly", 20, true);
    }
  },

  "jump": function() {
    if (!settings.player.killed && player.body.touching.down) {
      player.body.velocity.y = -350;
    }
  },

  "stopMoving": function() {
    player.body.velocity.x = 0;
    player.animations.stop();
    player.animations.play("fly", 20, true);
    // if the user is using two buttons to move, where both pressed, account for that
    if (cursors.left.isDown) {
      this.moveLeft();
    }
    else if (cursors.right.isDown) {
      this.moveRight();
    }
  },

  "testMovement": function(touch) {
    var playerOffset = player.x + (player.width / 2);
    if (!settings.player.killed) {
      if (touch.position.x < playerOffset) {
        this.moveLeft();
      }
      else if (touch.position.x > playerOffset) {
        this.moveRight();
      }
      else {
        this.stopMoving();
      }
    }
  },

  "createCollectible": function() {
    var collectible = collectibles.create(game.rnd.integerInRange(30, game.world.width - 30), -47, "collect");
    collectible.outOfBoundsKill = true;
    collectible.body.velocity.y = 100;
    collectible.body.gravity.y = settings.collectible.speed + settings.collectible.offset;
  },

  "createDodge": function() {
    var dodge = dodges.create(game.rnd.integerInRange(30, game.world.width - 60), -60, "dodge");
    dodge.outOfBoundsKill = true;
    dodge.body.gravity.y = settings.dodge.speed + settings.dodge.offset;
    dodge.body.setSize(dodge.width, 10, 0, 0);
    dodge.anchor.setTo(0.66, 0.3);
    game.add.tween(dodge).to({"angle": 360}, 2000).loop().start();
  },

  "createBonus": function() {
    var chalice = bonuses.create(game.rnd.integerInRange(30, game.world.width - 30), -75, "bonus");
    chalice.outOfBoundsKill = true;
    chalice.body.gravity.y = settings.bonus.speed + settings.bonus.offset;
    chalice.anchor.setTo(0.5, 0.5);
    chalice.animations.add("bubble");
    chalice.animations.play("bubble", 5, true);
  },

  "preload": function() {
    // reset the game variables
    settings = {
      "global": {
        "mobile": settings.global.mobile,
        "score": 0,
        "getCount": 0
      },
      "player": {
        "killed": false,
        "speed": 400,
        "tutorial": settings.player.tutorial
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
      }
    };
  },

  "create": function() {
    // stop all the timer loops from generating new objects
    game.time.reset();

    // physics engine
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // main game background
    //game.add.sprite(0, 0, "background");

    // generate the platform group for ground and edges and such
    platforms = game.add.group();
    platforms.enableBody = true;

    // generate the ground
    var ground = platforms.create(0, game.world.height - 40, "carrot");
    ground.body.immovable = true;

    // TODO FIXME: generate some ledges, based on data we load in from the levels folder
    var ledge = platforms.create(400, 400, "ground");
    ledge.body.immovable = true;
    ledge = platforms.create(-400, 250, "ground");
    ledge.body.immovable = true;

    // generate the ladders
    ladders = game.add.group();
    ladders.enableBody = true;

    // TODO FIXME: generate the ladders, based on data we load in from the levels folder
    var ladder = ladders.create(300, game.world.height - 278, "sweetums");

    // create the scoreboard
    scoreboard = game.add.text(205, 30,
      "SCORE: " + settings.global.score, {
        "font": "400 15px/1 Arcade-Normal, sans-serif",
        "fill": "#fff",
        "align": "right"
      });
    scoreboard.anchor.setTo(0, 0.5);

    // create the player
    player = game.add.sprite(game.world.width / 2 - 89, game.world.height - 95, "sebastian");
    player.animations.add("fly");
    player.animations.play("fly", 20, true);
    game.physics.arcade.enable(player);
    player.body.bounce.y = .2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    player.body.setSize(player.width, player.height, 0, 0);

    // target inputs
    cursors = game.input.keyboard.createCursorKeys();
    // move left
    cursors.left.onDown.add(this.moveLeft, this);
    cursors.left.onUp.add(this.stopMoving, this);
    // move right
    cursors.right.onDown.add(this.moveRight, this);
    cursors.right.onUp.add(this.stopMoving, this);
    // jump
    cursors.up.onDown.add(this.jump, this);

    game.input.onDown.add(this.testMovement, this);
    game.input.onUp.add(this.stopMoving, this);
  },

  "update": function() {
    if (!settings.player.killed) {
      // collision detections
      game.physics.arcade.collide(player, platforms);
      game.physics.arcade.overlap(player, collectibles, this.addCollectible, null, this);
      game.physics.arcade.overlap(player, dodges, this.killPlayer, null, this);
      game.physics.arcade.overlap(player, bonuses, this.collectBonus, null, this);
    }
  }
};