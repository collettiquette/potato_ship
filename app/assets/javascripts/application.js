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

		game.physics.startSystem(Phaser.Physics.ARCADE);

		// Set up the player
		sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'phaser');
		sprite.anchor.set(0.5);

		game.physics.arcade.enable(sprite);

		// Set up enemies
		enemies = game.add.group();
		enemies.enableBody = true;
		var one = enemies.create(0, 400, 'one');
		one.scale.setTo(2, 2);
		one.body.immovable = true;
	}

	var update = function () {

		//  If the sprite is > 8px away from the pointer then let's move to it
		if (game.physics.arcade.distanceToPointer(sprite, game.input.activePointer) > 8) {
			//  Make the object seek to the active pointer (mouse or touch).
			game.physics.arcade.moveToPointer(sprite, 300);
		}
		else {
			//  Otherwise turn off velocity because we're close enough to the pointer
			sprite.body.velocity.set(0);
		}

		game.physics.arcade.collide(sprite, enemies);

	}

	var render = function () {

		game.debug.inputInfo(32, 32);

	}

	return {
		init: init,
		render: render
	};

};

var game_instance = GameEngine();
game_instance.init();

dispatcher = new WebSocketRails(window.location.host + '/websocket');
channel = dispatcher.subscribe('da_game');

channel.bind('player_connected', function(data) {
  console.debug('channel event received: ' + data.message);
});

dispatcher.on_open = function(data) {
  console.log('Connection has been established: ', data);
  dispatcher.trigger("player_connected", { connection_id: data.connection_id });
}

