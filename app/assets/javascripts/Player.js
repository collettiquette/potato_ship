var Player = function (id) {
        var id = id;

	var drag = 200,
		maxVelocity = 200;

	var ship,
		bullets,
		isAccelerating = false,
		isDecelerating = false,
		isTurningLeft = false,
		isTurningRight = false;

	var create = function () {
		console.log('Player.create');
		this.ship = game.add.sprite(game.world.centerX, game.world.centerY, 'player-ship');

		game.physics.arcade.enable(this.ship);

		this.ship.anchor.set(0.5);
		this.ship.body.collideWorldBounds = true;
		this.ship.body.drag.set(drag);
		this.ship.body.maxVelocity.set(maxVelocity);

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

		return this.ship;
	};

	var update = function () {
          if(this.id != id)
            console.log(this.isAccelerating);   
		//console.log(sprite.x);
		// The player's acceleration/deceleration
		if (this.isAccelerating) {
			game.physics.arcade.accelerationFromRotation(this.ship.rotation, maxVelocity, this.ship.body.acceleration);
		} else if (this.isDecelerating) {
			game.physics.arcade.accelerationFromRotation(this.ship.rotation, -1 * maxVelocity, this.ship.body.acceleration);
		} else {
			this.ship.body.acceleration.set(0);
		}

		// Turning the player
		if (this.isTurningLeft) {
			this.ship.body.angularVelocity = -300;
		} else if (this.isTurningRight) {
			this.ship.body.angularVelocity = 300;
		} else {
			this.ship.body.angularVelocity = 0;
		}
	}

	var destroy = function () {
		this.ship.destroy();
	}

	var shoot = function () {
		var bullet = this.bullets.getFirstDead();

		bullet.reset(this.ship.x, this.ship.y);
		bullet.body.velocity.x = 0;
		bullet.body.velocity.y = 0;

		game.physics.arcade.velocityFromAngle(this.ship.rotation * (180 / Math.PI), maxVelocity * 3, bullet.body.velocity);
	}

	var position = function () {
		return {
			x: this.ship.x,
			y: this.ship.y,
			angle: this.ship.rotation
		}
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
		isTurningRight: isTurningRight,
                ship: this.ship,
		position: position
	}

}
