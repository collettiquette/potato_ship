var Player = function (id) {
        var id = id;

	var drag = 200,
		maxVelocity = 200;

	var ship,
		thruster,
		bullets,
		label,
		isAccelerating = false,
		isDecelerating = false,
		isTurningLeft = false,
		isTurningRight = false;

	var create = function (isLocalPlayer, ship_type) {
                if (isLocalPlayer)
                  var selected_ship_type = ConnectionHandler.shipType;
                else
                  var selected_ship_type = ship_type


		this.thruster = game.add.sprite(game.world.centerX, game.world.centerY, 'ship-thruster');
		this.thruster.anchor.set(0.5, 0.5);


		this.ship = game.add.sprite(game.world.centerX, game.world.centerY, 'player-ship-' + selected_ship_type);
		this.ship.bringToTop();

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
			if (isLocalPlayer)
				var bullet = this.bullets.create(-100, -100, 'laser-green-thin');
			else
				var bullet = this.bullets.create(-100, -100, 'laser-blue-thin');
			bullet.kill();
			//bullet.body.collideWorldBounds = true;
			bullet.checkWorldBounds = true;
			bullet.events.onOutOfBounds.add(bulletReset, this);
			bullet.player = this;
			//bullet.physicsBodyType = Phaser.Physics.ARCADE;
			//bullet.body.immovable = true;
			//bullet.scale.set(0.25);
			bullet.anchor.set(0.5);

			this.bullets.add(bullet);
		}

	    var style = { font: "14px Arial", fill: "#ffffff", align: "center" };

	    label = game.add.text(this.ship.x, this.ship.y + 36, id, style);

		return this.ship;
	};

	var update = function () {
		label.x = this.ship.x - (label.width / 2);
		label.y = this.ship.y + 36;

		this.thruster.x = this.ship.x;
		this.thruster.y = this.ship.y;
		this.thruster.rotation = this.ship.rotation;

		if (this.isAccelerating) {
			var tween = game.add.tween(this.thruster.anchor).to({ x: 1.5 }, 500);
			tween.start();
			game.physics.arcade.accelerationFromRotation(this.ship.rotation, maxVelocity, this.ship.body.acceleration);
		} else if (this.isDecelerating) {
			game.physics.arcade.accelerationFromRotation(this.ship.rotation, -1 * maxVelocity, this.ship.body.acceleration);
		} else {
			this.ship.body.acceleration.set(0);
			var tween = game.add.tween(this.thruster.anchor).to({ x: 0.5 }, 100);
			tween.start();
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
		label.destroy();
		this.thruster.destroy();
	}

	var shoot = function () {
		var bullet = this.bullets.getFirstDead();

		bullet.reset(this.ship.x, this.ship.y);
		bullet.body.velocity.x = 0;
		bullet.body.velocity.y = 0;

		bullet.rotation = this.ship.rotation;
		game.physics.arcade.velocityFromAngle(this.ship.rotation * (180 / Math.PI), maxVelocity * 3, bullet.body.velocity);
	}

	var bulletReset = function (bullet) {
		bullet.kill();
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
