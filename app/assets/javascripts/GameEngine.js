var GameEngine = function () {

	var game;
	var cursors;

	var players;
	var enemies;

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

		// Set up the players
		players = game.add.group();
		var myPlayer = new Player(game);
		players.add(myPlayer.create());

		// Set up enemies
		enemies = game.add.group();
		enemies.enableBody = true;

		// Add a few testable enemies
		for (var i = 0; i < 25; i++) {
			addEnemy();
		}

		// A testing key to add an enemy to the world
		var key_addEnemy = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
		key_addEnemy.onDown.add(addEnemy, this);

	}

	var addEnemy = function () {
		var x = Math.random() * 1600;
		var y = Math.random() * 1200;
		var one = enemies.create(x, y, 'one');
		one.body.immovable = true;
	}

	var update = function () {
		//console.log(players);
		players.callAll('update', null, cursors);

		game.physics.arcade.collide(players, enemies);

	}

	var render = function () {
		//game.debug.cameraInfo(game.camera, 32, 32);
	}

	return {
		init: init,
		render: render
	};

};
