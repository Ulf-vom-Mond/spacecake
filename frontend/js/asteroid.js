class Asteroid extends Entity {
	texture;

	constructor(x, y, radius, angle, texture) {
		super(x, y, radius, angle);
		this.texture = texture;
	}

	get texture() {
		return this.texture;
	}
}