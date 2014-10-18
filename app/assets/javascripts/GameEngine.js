var GameEngine = function () {

	var game;
	var cursors;

	var myPlayer;
	var players = [];
	var playerGroup;
	var enemies;

        var ready = false;

	var init = function () {
		game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-screen', {
			preload: preload,
			create: create,
			update: update,
			render: render
		});
	}

	var preload = function () {

		game.load.image('phaser', 'assets/images/player-ship.png');

	}

	var create = function () {
		// Set up input
		cursors = game.input.keyboard.createCursorKeys();

		// Set up physics
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// The size of the world
		game.world.setBounds(0, 0, 1600, 1200);

		// Set up enemies
		enemies = game.add.group();
		enemies.enableBody = true;

		// Add a few testable enemies
		for (var i = 0; i < 25; i++) {
			addEnemy();
			//addPlayer();
		}

		// A testing key to add an enemy to the world
		var key_addEnemy = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
		key_addEnemy.onDown.add(addEnemy, this);

	}

	var spawnMyPlayer = function (id) {
          myPlayer = new Player(id, game);
          playersGroup = game.add.group();
          var mpSprite = myPlayer.create();
          playersGroup.add(mpSprite);
          players.push(myPlayer);
          game.camera.follow(mpSprite);
          ready = true
	}

	var spawnRemotePlayer = function (id) {
          var x = Math.random() * 1600;
          var y = Math.random() * 1200;
          var myPlayerz = new Player(id, game);
          var myPlayerSprite = myPlayerz.create();
          myPlayerSprite.reset(x, y);
          playersGroup.add(myPlayerSprite);
          players.push(myPlayerz);
	}

	var addEnemy = function () {
		var x = Math.random() * 1600;
		var y = Math.random() * 1200;
		var one = enemies.create(x, y, 'one');
		one.body.immovable = true;
	}

	var update = function () {
          if(ready) {
		//console.log(players[0]);
		myPlayer.isAccelerating = cursors.up.isDown;
		myPlayer.isDecelerating = cursors.down.isDown;
		myPlayer.isTurningLeft = cursors.left.isDown;
		myPlayer.isTurningRight = cursors.right.isDown;

		for (var i = 0; i < players.length; i++) {
			players[i].update();
		}

		game.physics.arcade.collide(playersGroup, enemies);
		game.physics.arcade.collide(playersGroup, playersGroup);
          }
	}

	var render = function () {
		//game.debug.cameraInfo(game.camera, 32, 32);
	}

	return {
		init: init,
		render: render,
                spawnRemotePlayer: spawnRemotePlayer,
                spawnMyPlayer: spawnMyPlayer
	};

};
