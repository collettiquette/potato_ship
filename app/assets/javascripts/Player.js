var Player = function (id, game) {
        var id = id;

	var drag = 200,
		maxVelocity = 200;

	var sprite,
		isAccelerating = false,
		isDecelerating = false,
		isTurningLeft = false,
		isTurningRight = false;

	var create = function () {
		console.log('Player.create');
		sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'phaser');

		game.physics.arcade.enable(sprite);

		sprite.anchor.set(0.5);
		sprite.body.collideWorldBounds = true;
		sprite.body.drag.set(drag);
		sprite.body.maxVelocity.set(maxVelocity);

		return sprite;
	};

	var update = function () {
		// The player's acceleration/deceleration
		if (this.isAccelerating) {
			game.physics.arcade.accelerationFromRotation(sprite.rotation, maxVelocity, sprite.body.acceleration);
		} else if (this.isDecelerating) {
			game.physics.arcade.accelerationFromRotation(sprite.rotation, -1 * maxVelocity, sprite.body.acceleration);
		} else {
			sprite.body.acceleration.set(0);
		}

		// Turning the player
		if (this.isTurningLeft) {
			sprite.body.angularVelocity = -300;
		} else if (this.isTurningRight) {
			sprite.body.angularVelocity = 300;
		} else {
			sprite.body.angularVelocity = 0;
		}
	}

	return {
                id: id,
		create: create,
		update: update,
		isAccelerating: isAccelerating,
		isDecelerating: isDecelerating,
		isTurningLeft: isTurningLeft,
		isTurningRight: isTurningRight
	}

}
