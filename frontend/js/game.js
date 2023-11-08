class Game {
	keys = 0;
	xpos = 300;
	bgspeed = 0.3;
	obstacles = [];
	canvas;
    context;
    updateInterval;
    last_update = 0;
    score = 0;
    gameState = 0;

    width = window.innerWidth;
    height = window.innerHeight;

    spacecraft;
    spacecraftImg = new Image();
    asteroidImgs = [];
    bgImg = new Image();

    explosionAnimation;

	constructor() {
	    this.bgImg.src = "/img/background.png";

	    this.spacecraftImg.src = "/img/spacecraft.png";
	    
	    var asteroidImgSrcs = ["/img/asteroid_25.png", "/img/asteroid_50.png", "/img/asteroid_100.png", "/img/asteroid_150.png", "/img/asteroid_200.png"];

	    this.last_update = new Date();
	    this.canvas = document.getElementById("canvas");
	    this.context = canvas.getContext("2d");
	    this.explosionAnimation = new Animation("/img/explosion", this.context, 3, 20, 46);

    	canvas.width = this.width;
    	canvas.height = this.height;

	    this.spacecraft = new Spacecraft(this.xpos, this.height/2, 60, Math.PI/2);

	    for (var i = 0; i < asteroidImgSrcs.length; i++) {
	        this.asteroidImgs.push(new Image());
	        this.asteroidImgs[i].src = asteroidImgSrcs[i];
	    }

	    for (var i = 800; i < this.width; i += this.nextObstacle(2)) {
	        this.obstacles.push(new Asteroid(i, Math.random()*this.height, Math.random()*60+10, Math.random()*2*Math.PI, Math.floor(Math.random()*5)));
	    }

		this.updateInterval = setInterval(this.update.bind(this), 40);
	}

	update() {
		var elapsed = new Date() - this.last_update;
        this.last_update = new Date();
        this.context.save();
        // if(this.gameState) {
		// 	this.context.translate((Math.random()-0.5)*6, (Math.random()-0.5)*6);
		// 	this.context.rotate((Math.random()-0.5)*0.15);
        // }
        this.context.clearRect(this.spacecraft.x - this.xpos, 0, this.width, this.height);
        this.context.drawImage(this.bgImg, Math.floor(this.bgspeed*this.spacecraft.x/this.bgImg.width)*this.bgImg.width-this.width+this.spacecraft.x*(1-this.bgspeed), 0, this.bgImg.width, this.height);
        this.context.drawImage(this.bgImg, Math.floor(this.bgspeed*this.spacecraft.x/this.bgImg.width)*this.bgImg.width-this.width+this.bgImg.width-1+this.spacecraft.x*(1-this.bgspeed), 0, this.bgImg.width, this.height);

        

        this.score = ((this.spacecraft.x - this.xpos)/100).toFixed(2);

        this.createObstacles();
        this.refreshObstacles(elapsed);
        if(!this.gameState) {
        	this.checkGameOver();
        }
        this.printScore();

        this.context.translate(this.spacecraft.x, this.spacecraft.y);
        this.context.rotate(this.spacecraft.angle);
        
        this.context.drawImage(this.spacecraftImg, -this.spacecraftImg.width/2, -this.spacecraftImg.height/2, this.spacecraftImg.width, this.spacecraftImg.height);

        if(!this.gameState) {
	        this.getKeys();
	        this.spacecraft.steer(this.keys, this.context, elapsed);
	    }

        this.context.restore();
        if(this.gameState) {
			this.explosionAnimation.drawFrame(this.spacecraft.x-this.spacecraft.radius/2, this.spacecraft.y-this.explosionAnimation.getHeight());
        }
        if(!this.gameState) {
        	this.context.translate(-this.spacecraft.xVelocity * elapsed, 0);
        }
	}

	explosion(context, x, y) {
		
	}

	async getKeys() {
		try {
			var response = await fetch("/keys");
			var obj = await response.json();
			this.keys = obj.keys;
		}
			catch (err) {
			console.error(err.message, err);
		}
	}

	checkGameOver() {
		for (var i = 0; i < this.obstacles.length; i++) {
            if(this.spacecraft.isColliding(this.obstacles[i])) {
                this.gameOver();
            }
        }

        if(this.spacecraft.y < -80 || this.spacecraft.y > this.height+80) {
            this.gameOver();
        }
	}

	gameOver() {
		this.gameState = 1;
		//clearInterval(this.updateInterval);
		//setInterval(this.explosion.bind(this), 40);
	}

	printScore() {
		this.context.font = "30px Arial";
        this.context.fillStyle = "white"
        this.context.fillText(this.score, this.spacecraft.x - this.xpos + 10, 50);
        this.context.font = "15px Arial";
        this.context.fillText("lightyears away from home", this.spacecraft.x - this.xpos + 10, 70);
	}

	createObstacles() {
		var lastObstacle = this.obstacles[this.obstacles.length-1].x;
        if(lastObstacle < this.spacecraft.x + this.width) {
        	var newObstacle = new Asteroid(lastObstacle + this.nextObstacle(this.score / 10 + 6), Math.random()*this.height*3-this.height, Math.random()*60+10, Math.random()*2*Math.PI, Math.floor(Math.random()*5));
            newObstacle.xVelocity = (Math.random()-0.5)*0.001*this.score;
            newObstacle.yVelocity = (Math.random()-0.5)*0.001*this.score;
            newObstacle.angularVelocity = (Math.random()-0.5)*0.001;
            this.obstacles.push(newObstacle);
        }
	}

	refreshObstacles(elapsed) {
		for (var i = 0; i < this.obstacles.length; i++) {
            if(this.obstacles[i].x + this.obstacles[i].radius < this.spacecraft.x - this.xpos) {
                this.obstacles.splice(i, 1);
                i--;
                continue;
            }

            this.obstacles[i].update(elapsed);
            this.obstacles[i].draw(this.context, this.asteroidImgs[this.obstacles[i].texture]);
        }
	}

	nextObstacle(density){
	    return Math.random()*this.width/density*2+50;
	}
}