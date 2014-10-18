var Player = function (id) {
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

		this.bullets = game.add.group();
		this.bullets.enableBody = true;
		// Add 20 bullets
		for (var i = 0; i < 20; i++) {
			var bullet = this.bullets.create(-100, -100, 'bullet');
			bullet.kill();
			//bullet.physicsBodyType = Phaser.Physics.ARCADE;
			//bullet.body.immovable = true;
			bullet.scale.set(0.25);
			bullet.anchor.set(0.5);

			this.bullets.add(bullet);
		}

		return sprite;
	};

	var update = function () {
		//console.log(bullets);
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
		var bullet = this.bullets.getFirstDead();

		bullet.reset(sprite.x, sprite.y);
		bullet.body.velocity.x = 0;
		bullet.body.velocity.y = 0;

		game.physics.arcade.velocityFromAngle(sprite.rotation * (180 / Math.PI), maxVelocity * 3, bullet.body.velocity);
	}

	return {
		id: id,
		create: create,
		update: update,
		destroy: destroy,
		shoot: shoot,
		bullets: bullets,
		isAccelerating: isAccelerating,
		isDecelerating: isDecelerating,
		isTurningLeft: isTurningLeft,
		isTurningRight: isTurningRight
	}

}
