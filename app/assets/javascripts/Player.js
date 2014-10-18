var Player = function (game) {
	console.log('New player!');

	var sprite;

	var create = function () {
		console.log('Player.create');
		sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'phaser');

		game.camera.follow(sprite);
		game.physics.arcade.enable(sprite);

		sprite.anchor.set(0.5);
		sprite.body.collideWorldBounds = true;
		sprite.body.drag.set(100);
		sprite.body.maxVelocity.set(200);

		return sprite;
	};

	var update = function (cursors) {
		console.log('Player.update');
		console.log(sprite);
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
	}

	return {
		create: create,
		update: update
	}

}