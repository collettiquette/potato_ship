var Player = function (id) {
        var id = id;

	var drag = 200,
		maxVelocity = 200;

	var ship,
		bullets,
		label,
		isAccelerating = false,
		isDecelerating = false,
		isTurningLeft = false,
		isTurningRight = false;

	var create = function () {
		this.ship = game.add.sprite(game.world.centerX, game.world.centerY, 'player-ship-three');

		game.physics.arcade.enable(this.ship);

		this.ship.anchor.set(0.5);
		this.ship.body.collideWorldBounds = true;
		this.ship.body.drag.set(drag);
		this.ship.body.maxVelocity.set(maxVelocity);
    this.ship.health = 30;
    this.ship.player = this;

		this.bullets = game.add.group();
		this.bullets.enableBody = true;
		// Add 20 bullets
		for (var i = 0; i < 20; i++) {
			var bullet = this.bullets.create(-100, -100, 'laser-green-thin');
			bullet.kill();
			//bullet.physicsBodyType = Phaser.Physics.ARCADE;
			//bullet.body.immovable = true;
			//bullet.scale.set(0.25);
			bullet.anchor.set(0.5);

			this.bullets.add(bullet);
		}

	    var style = { font: "14px Arial", fill: "#ffffff", align: "center" };

	    label = game.add.text(this.ship.x - 20, this.ship.y + 36, id, style);

		return this.ship;
	};

	var update = function () {
		label.x = this.ship.x - 20;
		label.y = this.ship.y + 36;
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

		bullet.rotation = this.ship.rotation;
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
