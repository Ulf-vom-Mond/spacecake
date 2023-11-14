class Rocket {
	type = 0;
	lim;
	y = 0;
	yVelocity = 0;
	ystart;
	files = ["img/rocket_green.png", "img/rocket_blue.png", "img/rocket_red.png", "img/rocket_yellow.png"];
	colors = ["green", "blue", "red", "yellow"];
	image = new Image();
	height = 0;
	width = 0;

	constructor(y, type, lim) {
		this.y = y;
		this.type = type;
		this.ystart = y;
		this.lim = lim;
		this.image.src = this.files[type];
		this.height = this.image.height;
		this.width = this.image.width;
	}

	update(buttons, dt) {
		this.yVelocity += dt/5000;
		if(buttons & 0b1<<this.type) {
			//this.y -= dt / (this.lim - this.ystart + this.y);
			this.yVelocity -= dt/1000;
		}
		this.y += dt * this.yVelocity;
		if(this.y > this.ystart) {
			//this.y += dt;
			this.yVelocity = 0;
			this.y = this.ystart;
		}
		if(this.y < -this.height) {
			//this.y += dt;
			this.yVelocity = 0;
			this.y = -this.height;
		}
	}

	draw(x, context) {
		context.drawImage(this.image, x-this.width/2, this.y, this.width, this.height);
		context.fillStyle = this.colors[this.type];
		context.fillRect(x-8, this.y+this.height, 16, this.ystart-this.y);
	}

	hasFinished() {
		return this.y <= this.ystart - this.lim;
	}

	reset() {
		this.y = this.ystart;
		this.yVelocity = 0;
	}
}