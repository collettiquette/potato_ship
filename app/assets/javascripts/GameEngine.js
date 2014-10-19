var game;

var GameEngine = function () {

	var cursors;

	var myPlayer;
	var players = [];
	var playersGroup;
	var obstacles;

	var ready = false;
	var world_width = 1600;
	var world_height = 1200;

	var init = function () {
		game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-container', {
			preload: preload,
			create: create,
			update: update,
			render: render
		});
	}

	var preload = function () {

		// Ships
		game.load.image('player-ship-one', '/images/player-ship-one.png');
		game.load.image('player-ship-two', '/images/player-ship-two.png');
		game.load.image('player-ship-three', '/images/player-ship-three.png');
		game.load.image('player-ship-four', '/images/player-ship-four.png');

		// Lasers
		game.load.image('laser-green-thin', '/images/laser-green-thin.png');
		game.load.image('laser-blue-thin', '/images/laser-blue-thin.png');

		// Obstacles
		game.load.image('obstacle-one', '/images/obstacle-one.png');
		game.load.image('obstacle-two', '/images/obstacle-two.png');
		game.load.image('obstacle-three', '/images/obstacle-three.png');
		game.load.image('obstacle-four', '/images/obstacle-four.png');
		game.load.image('obstacle-five', '/images/obstacle-five.png');

		// Backgrounds
		game.load.image('background-space-one', '/images/background-space-one.png');

	}

	var create = function () {
		game.stage.backgroundColor = '#3a2e3f';
		game.add.tileSprite(0, 0, world_width, world_height, 'background-space-one');

		// Set up input
		cursors = game.input.keyboard.createCursorKeys();

		// Set up physics
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// The size of the world
		game.world.setBounds(0, 0, world_width, world_height);

		playersGroup = game.add.group();

		// A testing key to add an enemy to the world
		var key_shoot = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		key_shoot.onDown.add(fireZeBullets, this);

		var key_toggle_scores = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
		key_toggle_scores.onDown.add(function () {
			$('#game-scores').fadeToggle(200);
		}, this);

		// Test winning conditions by hitting winning
		var key_win = game.input.keyboard.addKey(Phaser.Keyboard.W);
		key_win.onDown.add(function () {
			ConnectionHandler.channel.trigger('end_game');
		}, this);

		// Set up connection handler
		ConnectionHandler.init();
	}

	var loadObstacles = function (obstacleData) {
		// Set up obstacles
		obstacles = game.add.group();
		obstacles.enableBody = true;

		$.each(obstacleData.obstacles, function (index, which) {
			var obstacle = obstacles.create(which.x, which.y, 'obstacle-' + which.frame);
			var speed = 10 * Math.random();
			obstacle.angle = 360 * Math.random();
			obstacle.body.angularVelocity = (Math.random() * 30) - 15;

			// This will make them float around a bit, but doesn't update on the server yet
			//game.physics.arcade.velocityFromAngle(obstacle.angle, speed, obstacle.body.velocity);

			obstacle.body.immovable = true;
			obstacle.anchor.set(0.5);

			switch (which.frame) {
				case 'one':
					obstacle.body.setSize(32, 32, 8, 8);
				break;
				case 'two':
					obstacle.body.setSize(24, 24, 8, 8);
				break;
			}
		});
	}

	var fireZeBullets = function () {
		if (!myPlayer.ship.alive)
			return;

		myPlayer.shoot();
    var change = {
      up: false,
      down: false,
      left: false,
      right: false
    };

    ConnectionHandler.dispatcher.trigger('fire_bullet',
      { position: myPlayer.position(), player_name: myPlayer.id,
      	game_id: ConnectionHandler.gameID,
      	change: change
      });
	}

  var fireRemoteBullet = function (data) {
  	updatePlayers(data);
  	if (data.player_name != myPlayer.id) {
	  	$.each(players, function (index, player) {
	  		if (player.id == data.player_name) {
	  			player.shoot();
	  			return;
	  		}
	  	});
	  }
  }

	var spawnMyPlayer = function (name, position) {
          myPlayer = new Player(name);
          var mpSprite = myPlayer.create(true);
          mpSprite.reset(position.x, position.y)
          playersGroup.add(mpSprite);
          players.push(myPlayer);
          game.camera.follow(mpSprite);
          ready = true;
	}

	var spawnRemotePlayer = function (name, ship_type, position) {
          var x = position.x
          var y = position.y
          var myPlayerz = new Player(name);
          var myPlayerSprite = myPlayerz.create(false, ship_type);
          myPlayerSprite.reset(x, y, 30);
          playersGroup.add(myPlayerSprite);
          players.push(myPlayerz);
	}

	var deletePlayer = function(name) {
          $.each(players, function (index, player) {
            if (typeof(player) == 'undefined'){
              players.splice(index, 1);
            } else if (player.id == name) {
              player.destroy();
              players.splice(index, 1);

              return;
            }
          });
	}

	var bullet_hits_obstacle = function (bullet, obstacle) {
		bullet.kill();
	};

	var bullet_hits_player = function (bullet, ship) {
          bullet.kill();

          if(bullet.player.name == myPlayer.name){
            console.log("Health before bullet damage: " + ship.health);
            ship.damage(3);

            var change = {
              up: false,
              down: false,
              left: false,
              right: false
            };

            ConnectionHandler.dispatcher.trigger('update_ship', {
              change: change,
              position: ship.player.position(),
              player_name: ship.player.id,
              game_id: ConnectionHandler.gameID,
              health: ship.health
            });

            if ( !ship.alive ) {
              // ship.kill();
              // killAndRespawn(ship.player, bullet.player);
              updateScores(ship.player, bullet.player);
            }
          }
	};

	var updatePlayers = function (updatedData) {
          if (updatedData.player_name != myPlayer.id) {
            $.each(players, function (index, player) {
              if (player.id == updatedData.player_name) {
                player.isDecelerating = updatedData.change.down;
                player.isAccelerating = updatedData.change.up;
                player.isTurningLeft = updatedData.change.left;
                player.isTurningRight = updatedData.change.right;
                player.ship.rotation = updatedData.position.angle

                if (typeof(updatedData.health) != 'undefined'){
                    player.ship.health = updatedData.health;

                    if (player.ship.health <= 0) {
                      // ship.kill();
                      // killAndRespawn(player, null);
                      // player.ship.health = 30;
                    } else {
                      var tween = game.add.tween(player.ship);
                      tween.to({
                        x: updatedData.position.x,
                        y: updatedData.position.y
                      }, 1000);
                      tween.start();
                    }
                  return;
                }

                var tween = game.add.tween(player.ship);
                tween.to({
                  x: updatedData.position.x,
                  y: updatedData.position.y
                }, 1000);
                tween.start();
                return;
              }
            });
          } else {
            if (typeof(updatedData.health) != 'undefined'){
              myPlayer.ship.health = updatedData.health;

              if(myPlayer.ship.health <= 0){
                // ship.kill();
                // killAndRespawn(myPlayer, null);
                // myPlayer.ship.health = 30;
              }
            }
          }

	};

	var killAndRespawn = function (dead_player, new_position) {
    $.each(players, function (index, player) {
      if (player.id == dead_player) {
        player.ship.kill();
        setTimeout(function () {
          player.ship.reset(new_position.x, new_position.y, 30);
          player.ship.revive(30);
          player.ship.health = 30;
        }, 3000);
      }
    });
	}

	var updateScores = function (dead_player, kill_player) {
		stats = new Stats(ConnectionHandler.dispatcher,ConnectionHandler.channel);
		stats.update_score(ConnectionHandler.gameID, kill_player.id, dead_player.id);
	}

	var update = function () {

          if (!ready)
            return;

          var input_change = (
            myPlayer.isAccelerating != cursors.up.isDown ||
            myPlayer.isDecelerating != cursors.down.isDown ||
            myPlayer.isTurningLeft != cursors.left.isDown ||
            myPlayer.isTurningRight != cursors.right.isDown
          );

          myPlayer.isAccelerating = cursors.up.isDown;
          myPlayer.isDecelerating = cursors.down.isDown;
          myPlayer.isTurningLeft = cursors.left.isDown;
          myPlayer.isTurningRight = cursors.right.isDown;


          $.each(players, function (index, player) {
            player.update();
            game.physics.arcade.collide(player.bullets, obstacles, bullet_hits_obstacle);
            game.physics.arcade.collide(player.bullets, playersGroup, bullet_hits_player);
          });

          game.physics.arcade.collide(playersGroup, obstacles);
          game.physics.arcade.collide(playersGroup, playersGroup);

          if (input_change) {
            var change = {
              up: myPlayer.isAccelerating,
              down: myPlayer.isDecelerating,
              left: myPlayer.isTurningLeft,
              right: myPlayer.isTurningRight
            };

            ConnectionHandler.dispatcher.trigger('update_ship', {
              change: change,
              position: myPlayer.position(),
              player_name: myPlayer.id,
              game_id: ConnectionHandler.gameID,
            });
          }
	}

	var render = function () {
		//game.debug.cameraInfo(game.camera, 32, 32);
	}

	return {
		init: init,
		render: render,
		loadObstacles: loadObstacles,
		updatePlayers: updatePlayers,
		fireRemoteBullet: fireRemoteBullet,
		spawnRemotePlayer: spawnRemotePlayer,
		spawnMyPlayer: spawnMyPlayer,
    killAndRespawn: killAndRespawn,
		deletePlayer: deletePlayer
	};

};
