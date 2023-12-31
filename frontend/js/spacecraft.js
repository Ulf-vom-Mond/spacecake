class Spacecraft extends Entity {
	transInertia = 3000;
	rotInertia = 100000;
	transFriction = 3;
	rotFriction = 10000;
	thrusters = [new Thruster(-50, -30, -Math.PI/4*5), 
		         new Thruster(-40, 20, Math.PI/6),
		         new Thruster(40, 20, -Math.PI/6),
		         new Thruster(50, -30, Math.PI/4*5)]

	steer(buttons, context, elapsed) {
		var force = [0, 0, 0]

        for(var i = 0; i < this.thrusters.length; i++) {
	        var thruster = this.thrusters[i]
	        if(buttons & 0b1<<i){
	        	thruster.drawFlame(context);

	            var thrusterAngle = Math.PI/2 - thruster.angle + Math.atan2(thruster.y, thruster.x);
	            var absThrusterAngle = thruster.angle + this.angle;
	            
	            force[0] += Math.sin(absThrusterAngle);
	            force[1] -= Math.cos(absThrusterAngle);
	            force[2] -= Math.sin(thrusterAngle);

	            thruster.addBurnTime(elapsed);
	        } else {
	        	thruster.resetBurnTime();
	        }
	    }

        this.push(force[0], force[1], force[2], 1, elapsed);
        this.update(elapsed);
	}

	get burnTimes() {
		var burnTimes = [];
		for(var i = 0; i < this.thrusters.length; i++) {
			burnTimes.push(this.thrusters[i].burnTime);
		}
		return burnTimes;
	}

	reset(x, y, angle) {
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.xVelocity = 0;
		this.yVelocity = 0;
		this.angularVelocity = 0;
	}
}