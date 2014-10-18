// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .
//= require websocket_rails/main


var GameEngine = function () {

	var game;
	var cursors	;
	var sprite;
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

		// Set up the player
		sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'phaser');
		game.physics.arcade.enable(sprite);
		sprite.anchor.set(0.5);
		sprite.body.drag.set(100);
		sprite.body.maxVelocity.set(200);

		// Set up enemies
		enemies = game.add.group();
		enemies.enableBody = true;

		// Add a few testable enemies
		for (var i = 0; i < 10; i++) {
			addEnemy();
		}

		// A testing key to add an enemy to the world
		var key_addEnemy = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
		key_addEnemy.onDown.add(addEnemy, this);

	}

	var addEnemy = function () {
		var x = Math.random() * 800;
		var y = Math.random() * 600;
		var one = enemies.create(x, y, 'one');
		one.body.immovable = true;
	}

	var update = function () {

		// Accelerating the player
		if (cursors.up.isDown) {
			game.physics.arcade.accelerationFromRotation(sprite.rotation, 200, sprite.body.acceleration);
		} else if (cursors.down.isDown) {
			game.physics.arcade.accelerationFromRotation(sprite.rotation, -200, sprite.body.acceleration);
		} else {
			sprite.body.acceleration.set(0);
		}

		// Turning the player
		if (cursors.left.isDown) {
			sprite.body.angularVelocity = -300;
		} else if (cursors.right.isDown) {
			sprite.body.angularVelocity = 300;
		} else {
			sprite.body.angularVelocity = 0;
		}

		game.physics.arcade.collide(sprite, enemies);

	}

	var render = function () {

	}

	return {
		init: init,
		render: render
	};

};

var game_instance = GameEngine();
game_instance.init();

dispatcher = new WebSocketRails(window.location.hostname + ':3218/websocket');
channel = dispatcher.subscribe('da_game');

channel.bind('player_connected', function(data) {
  console.debug('channel event received: ' + data.message);
});

dispatcher.on_open = function(data) {
  console.log('Connection has been established: ', data);
  dispatcher.trigger("player_connected", { connection_id: data.connection_id });
}

