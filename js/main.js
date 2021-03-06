  "use strict";

  /**
    * The main game state
    */
  var _MAIN = {
    /**
     * The text that appears over a character's head
     * @param{String} text The text to display above head
     * @param{boolean} bonus Whether this is a bonus catch phrase or hiccup
     * @param{boolean} shift Whether to shift left or up
     */
    "popUpText": function(text, bonus, shift) {
      var tempLabel;
      var tempTween;
      var tempSprite;
      var tempTween2;

      tempLabel = game.add.text(
        (!shift ? player.x + (player.width / 2) : player.x + player.width + 10),
        (!shift ? player.y : player.y + 40),
        text, {
          "font": "400 15px/1 Arcade-Normal, sans-serif",
          "fill": "#fff",
          "align": "center"
        });
      tempLabel.anchor.setTo(.5, .5);
      tempTween = game.add.tween(tempLabel).to(
        (!shift ? {"y": tempLabel.y - 20} : {"x": tempLabel.x + player.width + 35, "y": tempLabel.y - 58}),
        (!shift ? 300 : 600),
        Phaser.Easing.Linear.None, true, 0, 0, false)
        .to({"alpha": 0}, 200, Phaser.Easing.Linear.None, true, 0, 0, false);
      tempTween.onComplete.add(function() {
        tempLabel.destroy();
      });
    },

    "generateHappyPee": function() {
      var pee = game.add.emitter(player.x + (player.width / 2), player.y + player.height - 5, 200);
      pee.makeParticles("pee");
      pee.setScale(.1, .8, .1, .7, 500, Phaser.Easing.Linear.None, false);
      pee.explode(800, 15);
    },

    "addCollectible": function(player, collectible) {
      var score;
      // increment how many times user caught something
      ++settings.global.getCount;
      if (settings.global.getCount >= 5) {
        score = 500;
        settings.global.getCount = 0;
        this.generateHappyPee();
      }
      else {
        score = 100;
      }
      collectible.destroy();
      settings.global.score += score;
      scoreboard.text = "SCORE: " + settings.global.score;
      this.popUpText("+" + score, false, false);
    },

    "collectBonus": function(player, chalice) {
      chalice.destroy();
      // increment how many times user caught something
      ++settings.global.getCount;
      settings.global.score += 1000;
      scoreboard.text = "SCORE: " + settings.global.score;
      this.popUpText("+1000", true, true);
      this.generateHappyPee(player);
      console.log("send", "event", "Vulture, Video Game", "Lil Sebastian", "Collect Bonus");
      // ga("send", "event", "Vulture, Video Game", "Lil Sebastian", "Collect Bonus");
    },

    "killPlayer": function(player, dodge) {
      // stop all the timer loops from generating new objects
      game.time.removeAll();
      player.body.velocity.y = 0;
      player.body.gravity.y = 0;
      player.animations.stop();
      player.anchor.set(.5, 1);
      game.add.tween(player).to({"angle": 180, "x": player.x + 50}, 200).start();
      collectibles.setAll("body.velocity.x", 0);
      dodges.setAll("body.velocity.x", 0);
      bonuses.setAll("body.velocity.x", 0);
      game.tweens.pauseAll();
      settings.player.killed = true;
      setTimeout(function() {
        game.state.start("gameover");
      }, 800);
    },

    "jump": function() {
      if (!settings.player.killed) {
        player.body.velocity.y = -200;
        player.animations.play("fly", 20, true);
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

    "getBounceEasing": function(v) {
      return Math.sin(v * Math.PI) * 1;
    },

    "createCollectible": function() {
      var collectible = collectibles.create(game.world.width, game.rnd.integerInRange(10, game.world.height - 58), "collect");
      var dodgeAngle = Math.ceil(Math.random() * 10) % 2 === 0;
      collectible.outOfBoundsKill = true;
      collectible.body.velocity.x = -1 * (settings.collectible.speed + settings.collectible.offset);
      collectible.body.gravity.y = 0;
      collectible.anchor.set(.5,.5);
      game.add.tween(collectible).to({"angle": dodgeAngle ? 10 : -10}, 1000).to({"angle": dodgeAngle ? -10 : 10}, 1000).to({"angle": 0}, 1000).loop().start();
    },

    "createDodge": function() {
      var dodge = dodges.create(game.world.width, game.rnd.integerInRange(10, game.world.height - 83), "dodge");
      var dodgeAngle = Math.ceil(Math.random() * 10) % 2 === 0;
      dodge.outOfBoundsKill = true;
      dodge.body.velocity.x = -1 * (settings.dodge.speed + settings.dodge.offset);
      dodge.body.gravity.y = 0;
      dodge.body.setSize(dodge.width - 20, dodge.height - 25, 10, 25);
      game.add.tween(dodge).to({"angle": dodgeAngle ? -5 : 5}, 1000)
        .to({"angle": dodgeAngle ? 5 : -5}, 1000)
        .to({"angle": 0}, 1000).loop().start();
    },

    "createBonus": function() {
      var chalice = bonuses.create(game.world.width, game.rnd.integerInRange(40, game.world.height - 90), "bonus");
      var bounce = game.add.tween(chalice);
      chalice.outOfBoundsKill = true;
      chalice.body.velocity.x = -1 * (settings.bonus.speed + settings.bonus.offset);
      chalice.body.gravity.y = 0;
      chalice.anchor.setTo(.5, .5);
      bounce.to({"y": chalice.y - 20}, 750, this.getBounceEasing, true, 0, Number.MAX_VALUE, 0)
        .to({"y": chalice.y + 40}, 1500, this.getBounceEasing, true, 0, Number.MAX_VALUE, 0);
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
    },

    "makeDodgeLoop": function(time) {
      var offsetTime = settings.dodge.offset;
      if (offsetTime >= time - 1000) {
        offsetTime = time - 1000;
      }
      if (!!dodgeTimer) {
        game.time.events.remove(dodgeTimer);
      }
      dodgeTimer = game.time.events.loop(time, function() {
        this.createDodge();
        this.makeDodgeLoop(time - offsetTime);
      }, this);
    },

    "initDodgeGroup": function() {
      dodges = game.add.group();
      dodges.enableBody = true;
      // init offset loop
      game.time.events.loop(500, function() {
        ++settings.dodge.offset;
      }, this);
      // create the dodge
      this.createDodge();
      this.makeDodgeLoop(2700);
    },

    "initCollectiblesGroup": function() {
      collectibles = game.add.group();
      collectibles.enableBody = true;
      // init offset loop
      game.time.events.loop(300, function() {
        ++settings.collectible.offset;
      }, this);
      // create the collectible
      this.createCollectible();
      game.time.events.loop(1500 - (settings.collectible.offset / 2), function() {
        this.createCollectible();
      }, this);
    },

    "initBonusesGroup": function() {
      bonuses = game.add.group();
      bonuses.enableBody = true;
      // init offset loop
      game.time.events.loop(1000, function() {
        ++settings.bonus.offset;
      }, this);
      // create the bonus
      game.time.events.loop(10000 - (settings.bonus.offset / 2), function() {
        this.createBonus();
      }, this);
    },

    "initPlayer": function() {
      player = game.add.sprite(20, 0, "sebastian");
      player.animations.add("fly");
      player.animations.play("fly", 20, true);
      game.physics.arcade.enable(player);
      player.body.bounce.y = .2;
      player.body.gravity.y = 600;
      player.body.collideWorldBounds = true;
      player.body.setSize(79, 51, 0, 29);
    },

    "initWelcomeSign": function() {
      sign = game.add.sprite(game.width - 50, game.world.height - 118, "sign");
    },

    "create": function() {
      // stop all the timer loops from generating new objects
      game.time.reset();

      // physics engine
      game.physics.startSystem(Phaser.Physics.ARCADE);

      // main game background
      game.add.sprite(0, 0, "background");

      background = game.add.tileSprite(0, 0, 528, 299, "background", 10);

      // create the scoreboard
      scoreboard = game.add.text(game.world.width - 220, 30,
        "SCORE: " + settings.global.score, {
          "font": "400 15px/1 Arcade-Normal, sans-serif",
          "fill": "#fff",
          "align": "right"
        });
      scoreboard.anchor.setTo(0, .5);

      // create welcome sign
      this.initWelcomeSign();

      // create the player
      this.initPlayer();

      // target inputs
      cursors = game.input.keyboard.createCursorKeys();
      // jump
      cursors.up.onDown.add(this.jump, this);
      game.input.onDown.add(this.jump, this);
    },

    "update": function() {
      if (!settings.player.killed) {
        // collision detections
        game.physics.arcade.overlap(player, collectibles, this.addCollectible, null, this);
        game.physics.arcade.overlap(player, dodges, this.killPlayer, null, this);
        game.physics.arcade.overlap(player, bonuses, this.collectBonus, null, this);

        background.tilePosition.x -= 3;
        if (sign.x < game.world.width / 4 && !settings.sign.initiated) {
          settings.sign.initiated = true;

          // create the dodge item
          this.initDodgeGroup();

          // create the collectibles item
          this.initCollectiblesGroup();

          // create bonus item
          this.initBonusesGroup();

          player.bringToTop();
        }
        if (sign.x > -219) {
          sign.x -= 4;
        }
        else if (!settings.sign.isDead) {
          settings.sign.isDead = true;
          sign.destroy();
        }
      }
    }
  };