class Entity{
	x;
	y;
	radius;
	angle;

	xVelocity = 0;
	yVelocity = 0;
	angularVelocity = 0;

	transInertia = 1;
	rotInertia = 1;
	transFriction = 1;
	rotFriction = 1;

	constructor(x, y, radius, angle) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.angle = angle;
	}

	draw(context, image) {
		context.save();
		context.translate(this.x, this.y);
		context.rotate(this.angle);
		context.drawImage(image, -this.radius, -this.radius, this.radius*2, this.radius*2);
		context.restore();
	}

	distance(foreignEntity) {
		return Math.sqrt(Math.pow(this.x - foreignEntity.x, 2) + Math.pow(this.y - foreignEntity.y, 2));
	}

	isColliding(foreignEntity) {
		return this.distance(foreignEntity) < this.radius + foreignEntity.radius;
	}

	push(x, y, angle, amount, dt) {
		this.xVelocity += x / this.transInertia * dt * amount
        this.yVelocity += y / this.transInertia * dt * amount
        this.angularVelocity += angle / this.rotInertia * dt * amount

        this.x += this.xVelocity * dt;
        this.y += this.yVelocity * dt;
        this.angle += this.angularVelocity * dt;
	}
}