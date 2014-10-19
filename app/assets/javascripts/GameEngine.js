var game;

var GameEngine = function () {

	var cursors;

	var myPlayer;
	var players = [];
	var playersGroup;
	var obstacles;

	var ready = false;
	//var test;

	var init = function () {
		game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-screen', {
			preload: preload,
			create: create,
			update: update,
			render: render
		});
	}

	var preload = function () {

		game.load.image('player-ship', '/images/player-ship.png');
		//game.load.image('space-background', '/images/spaaaaaace.png');

	}

	var create = function () {
		// Set up input
		cursors = game.input.keyboard.createCursorKeys();

		// Set up physics
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// The size of the world
		game.world.setBounds(0, 0, 1600, 1200);

		//game.add.tileSprite(0, 0, 1000, 600, 'space-background');

		playersGroup = game.add.group();
		console.log(playersGroup);

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
			var obstacle = obstacles.create(which.x, which.y, 'one');
			obstacle.body.immovable = true;
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
          var x = Math.random() * 1600;
          var y = Math.random() * 1200;
          var myPlayerz = new Player(name);
          var myPlayerSprite = myPlayerz.create();
          myPlayerSprite.reset(x, y);
          playersGroup.add(myPlayerSprite);
          players.push(myPlayerz);
	}

	var deletePlayer = function(name) {
          $.each(players, function (index, player) {
            if (player.id == name) {
              player.destroy();
              console.log(players);
              players.splice(index, 1);

              console.log(players);

              return;
            }
          });
	}

	var bullet_hits_obstacle = function (bullet, obstacle) {
		console.log('bullet hit obstacle');
		bullet.kill();
	};

	var bullet_hits_player = function (bullet, player) {
		console.log('bullet hit player');
		bullet.kill();
		player.kill();
	};

	var updatePlayers = function (updatedData) {
          $.each(players, function (index, player) {
            if (player.id == updatedData.player_name) {
              player.isDecelerating = updatedData.change.down;
              player.isAccelerating = updatedData.change.up;
              player.isTurningLeft = updatedData.change.left;
              player.isTurningRight = updatedData.change.right;
              player.ship.x = updatedData.position.x;
              player.ship.y = updatedData.position.y;
              player.ship.rotation = updatedData.position.angle;
              //console.log(player);
              return;
            }
          });
	};

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
              player_name: myPlayer.id
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
