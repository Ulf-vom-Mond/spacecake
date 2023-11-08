class Spacecraft extends Entity {
	transInertia = 3000;
	rotInertia = 100000;
	transFriction = 5;
	rotFriction = 10000;
	thrusters = [new Thruster(-50, -30, -Math.PI/4*5), 
		         new Thruster(-40, 20, Math.PI/12),
		         new Thruster(40, 20, -Math.PI/12),
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
	        }
	    }

        this.push(force[0], force[1], force[2], 1, elapsed);
        this.update(elapsed);
	}

	explode(context, elapsed) {

	}
}