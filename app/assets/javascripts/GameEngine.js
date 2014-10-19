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

		// Lasers
		game.load.image('laser-green-thin', '/images/laser-green-thin.png');

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
		myPlayer.shoot();
	}

	var spawnMyPlayer = function (name) {
          myPlayer = new Player(name);
          var mpSprite = myPlayer.create();
          playersGroup.add(mpSprite);
          players.push(myPlayer);
          game.camera.follow(mpSprite);
          ready = true;
	}

	var spawnRemotePlayer = function (name) {
          var x = -50
          var y = -50
          var myPlayerz = new Player(name);
          var myPlayerSprite = myPlayerz.create();
          myPlayerSprite.reset(x, y, 30);
          playersGroup.add(myPlayerSprite);
          players.push(myPlayerz);
	}

	var deletePlayer = function(name) {
          $.each(players, function (index, player) {
            if (player.id == name) {
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
              killAndRespawn(ship.player, bullet.player);
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
                var tween = game.add.tween(player.ship);
                tween.to({
                  x: updatedData.position.x,
                  y: updatedData.position.y,
                  rotation: updatedData.position.angle
                }, 1000);
                tween.start();

                if (typeof(updatedData.health) != 'undefined'){
                    player.ship.health = updatedData.health;
                }
                return;
              }
            });
          } else {
            if (typeof(updatedData.health) != 'undefined'){
              myPlayer.ship.health = updatedData.health;

              if(myPlayer.ship.health <= 0){
                myPlayer.ship.kill();
                killAndRespawn(myPlayer, null);
              }
            }
          }

	};

	var killAndRespawn = function (dead_player, kill_player) {
          //make sure person is alive before bullet hits in bullet_hits_player
            console.log("Health before reset: " + dead_player.ship.health);
            dead_player.ship.reset(-50, -50, 30);
            console.log("Health after reset: " + dead_player.ship.health);
            dead_player.ship.revive(30);
            console.log("Health after revive: " + dead_player.ship.health);
	}

	var updateScores = function (dead_player, kill_player) {
		stats = new Stats(ConnectionHandler.dispatcher,ConnectionHandler.channel);
		stats.update_score(ConnectionHandler.gameID,kill_player.id,5);
		stats.update_kills(ConnectionHandler.gameID,kill_player.id,1);
		stats.update_deaths(ConnectionHandler.gameID,dead_player.id,1);
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
		spawnRemotePlayer: spawnRemotePlayer,
		spawnMyPlayer: spawnMyPlayer,
		deletePlayer: deletePlayer
	};

};
