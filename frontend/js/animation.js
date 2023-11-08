class Animation {
	frames = [];
	frame = 0;
	last_update = 0;

	constructor(path, context, scale, fps, framecount) {
		this.path = path;
		this.context = context;
		this.scale = scale;
		this.fps = fps;

		for(var i = 0; i < framecount; i++) {
			var newFrame = new Image();
			newFrame.src = path + "/" + i + ".png";
			this.frames.push(newFrame);
		}
	}

	drawFrame(x, y) {
		if(this.frame >= this.frames.length) {
			return;
		}

		if(this.frame == 0) {
			this.last_update = Date.now();
			this.frame++;
		}

		var elapsed = Date.now() - this.last_update;

        this.context.drawImage(this.frames[this.frame], x, y, this.frames[this.frame].width*this.scale, this.frames[this.frame].height*this.scale);

        if(elapsed > 1000/this.fps) {
        	this.last_update += 1000/this.fps;
        	this.frame++;
        }
	}

	getWidth() {
		if(this.frame >= this.frames.length) {
			return 0;
		}
		return this.frames[this.frame].width*this.scale;
	}

	getHeight() {
		if(this.frame >= this.frames.length) {
			return 0;
		}
		return this.frames[this.frame].height*this.scale;
	}
}