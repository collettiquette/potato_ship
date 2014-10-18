var Player = function (id, game) {
        var id = id;

	var drag = 200,
		maxVelocity = 200;

	var sprite,
		bullets,
		isAccelerating = false,
		isDecelerating = false,
		isTurningLeft = false,
		isTurningRight = false;

	var create = function () {
		console.log('Player.create');
		sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'player-ship');

		game.physics.arcade.enable(sprite);

		sprite.anchor.set(0.5);
		sprite.body.collideWorldBounds = true;
		sprite.body.drag.set(drag);
		sprite.body.maxVelocity.set(maxVelocity);

		bullets = game.add.group();
		bullets.enableBody = true;
		bullets.physicsBodyType = Phaser.Physics.ARCADE;
		bullets.createMultiple(20, 'player-ship', 0, false);
		bullets.setAll('scale.x', 0.25);
		bullets.setAll('scale.y', 0.25);
		bullets.setAll('anchor.x', 0.5);
		bullets.setAll('anchor.y', 0.5);
		bullets.setAll('outOfBoundsKill', true);
		bullets.setAll('checkWorldBounds', true);

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

	var destroy = function () {
		sprite.destroy();
	}

	var shoot = function () {
		console.log('fireZeBullets');
		var bullet = bullets.getFirstDead();
		bullet.reset(sprite.x, sprite.y);
		bullet.body.velocity.x = 0;
		bullet.body.velocity.y = 0;
		console.log(sprite.rotation * Math.PI);
		//game.physics.arcade.accelerationFromRotation(sprite.rotation, maxVelocity * 2, bullet.body.acceleration);
		game.physics.arcade.velocityFromAngle(sprite.rotation * (180 / Math.PI), maxVelocity * 2, bullet.body.velocity);
	}

	var position = function () {
		return {
			x: sprite.x,
			y: sprite.y,
			angle: sprite.rotation
		}
	}

	return {
		id: id,
		create: create,
		update: update,
		destroy: destroy,
		shoot: shoot,
		isAccelerating: isAccelerating,
		isDecelerating: isDecelerating,
		isTurningLeft: isTurningLeft,
		isTurningRight: isTurningRight,
		position: position
	}

}
