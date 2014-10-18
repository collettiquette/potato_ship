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


var game = function() {

	var phaser;
	var sprite;

	function init() {
		console.log('Potato ship engage');
		phaser = new Phaser.Game(800, 600, Phaser.AUTO, 'game-screen', {
			preload: preload,
			create: create,
			update: update,
			render: render
		});
	}

	function preload() {

		game.load.image('phaser', 'assets/images/player-ship.png');

	}

	function create() {

		//  To make the sprite move we need to enable Arcade Physics
		game.physics.startSystem(Phaser.Physics.ARCADE);

		sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'phaser');
		sprite.anchor.set(0.5);

		//  And enable the Sprite to have a physics body:
		game.physics.arcade.enable(sprite);

	}

	function update () {

		//  If the sprite is > 8px away from the pointer then let's move to it
		if (game.physics.arcade.distanceToPointer(sprite, game.input.activePointer) > 8) {
			//  Make the object seek to the active pointer (mouse or touch).
			game.physics.arcade.moveToPointer(sprite, 300);
		}
		else {
			//  Otherwise turn off velocity because we're close enough to the pointer
			sprite.body.velocity.set(0);
		}

	}

	function render () {

		game.debug.inputInfo(32, 32);

	}

	return {
		init: init
	};

};

//console.log(game);
//game.init;
