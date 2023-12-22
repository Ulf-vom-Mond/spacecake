class Thruster {
	x;
	y;
	angle;
    burnTime = 0;

	constructor(x, y, angle) {
		this.x = x;
		this.y = y;
		this.angle = angle;
	}

	drawFlame(context) {
		context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        context.beginPath();
        context.strokeStyle = "red";
        context.lineWidth = "3";
        var flameLength = Math.random() * 20 + 30;
        context.moveTo(-10, 5);
        context.lineTo(0, flameLength);
        context.lineTo(10, 5);
        context.stroke();
        context.beginPath();
        context.strokeStyle = "orange";
        context.lineWidth = "3";
        flameLength = Math.random() * 15 + 20;
        context.moveTo(-10, 5);
        context.lineTo(0, flameLength);
        context.lineTo(10, 5);
        context.stroke();
        context.beginPath();
        context.strokeStyle = "yellow";
        context.lineWidth = "3";
        flameLength = Math.random() * 10 + 10;
        context.moveTo(-10, 5);
        context.lineTo(0, flameLength);
        context.lineTo(10, 5);
        context.stroke();
        context.restore();
	}

    addBurnTime(time) {
        this.burnTime += time;
    }

    resetBurnTime() {
        this.burnTime = 0;
    }

    get burnTime() {
        return this.burnTime;
    }
}