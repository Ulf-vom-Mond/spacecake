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
    deathX = 0;
    viewPortX = 0;
    shakyshake = 0;
    deathCauses = ["got hit by an asteroid", "got lost in the infinity of the universe"];

    width = window.innerWidth;
    height = window.innerHeight;

    spacecraft;
    spacecraftImg = new Image();
    asteroidImgs = [];
    bgImg = new Image();

    rockets = [];

    highscores = [];
    score = {rank: -1, score: 0, time: 0, date: 0};

    explosionAnimation;

	constructor() {
		this.getHighscores();
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

	    for(var i = 0; i<4; i++) {
	    	this.rockets.push(new Rocket(400, i, 100));
	    }

		this.updateInterval = setInterval(this.update.bind(this), 40);
	}

	restart() {
		this.obstacles = [];
		this.gameState = 0;
		this.shakyshake = 0;
		this.score = {rank: -1, score: 0, time: 0, date: 0};
		this.spacecraftImg.src = "/img/spacecraft.png";

		for (var i = 800; i < this.width; i += this.nextObstacle(2)) {
	        this.obstacles.push(new Asteroid(i, Math.random()*this.height, Math.random()*60+10, Math.random()*2*Math.PI, Math.floor(Math.random()*5)));
	    }

	    for(var i = 0; i<4; i++) {
	    	this.rockets[i].reset();
	    }

	    this.context.translate(this.viewPortX, 0);
	    this.spacecraft.reset(this.xpos, this.height/2, Math.PI/2);
	    this.explosionAnimation.reset();
	    this.viewPortX = 0;
	}

	update() {
		var elapsed = new Date() - this.last_update;
        this.last_update = new Date();
        
        var bgShift = this.bgspeed*this.spacecraft.x+this.bgImg.width*Math.floor((this.viewPortX - this.bgspeed*this.spacecraft.x + this.width)/this.bgImg.width);
        this.context.drawImage(this.bgImg, bgShift, 0, this.bgImg.width, this.height);
        this.context.drawImage(this.bgImg, bgShift - this.bgImg.width, 0, this.bgImg.width, this.height);

        

        this.createObstacles();
        this.refreshObstacles(elapsed, !this.gameState);
        this.printScore();

        this.getKeys();

        this.context.save();
        this.context.translate(this.spacecraft.x, this.spacecraft.y);
        this.context.rotate(this.spacecraft.angle);
        this.context.drawImage(this.spacecraftImg, -this.spacecraftImg.width/2, -this.spacecraftImg.height/2, this.spacecraftImg.width, this.spacecraftImg.height);
        this.spacecraft.steer(this.gameState == 0 ? this.keys : 0, this.context, elapsed);
		this.context.restore();

        if(!this.gameState) { // game running
        	this.score.time += elapsed/1000;
        	this.score.score = this.getScore(this.spacecraft.x);
        	this.checkGameOver();
	        this.viewPortX += this.spacecraft.xVelocity * elapsed;
	        this.context.translate(-this.spacecraft.xVelocity * elapsed, 0);
	    } else { // game over
	    	this.explosionAnimation.drawFrame(this.spacecraft.x-this.spacecraft.radius/2, this.spacecraft.y-this.explosionAnimation.getHeight());
	    	this.context.restore();
	    	this.drawGameOverScreen();
	    	var restart = false;
	    	for(var i = 0; i<4; i++) {
	    		this.rockets[i].update(this.keys, elapsed);
	    		this.rockets[i].draw(this.viewPortX+this.width/2+(i-1.5)*100, this.context);
	    		if(this.rockets[i].hasFinished()) {
	    			restart = true;
	    		}
	    	}
	    	if(restart) {
				this.restart();
			} else {
				this.context.save();
	    	
	        	this.context.translate(this.spacecraft.x, this.spacecraft.y);
	        	this.context.rotate((Math.random()-0.5)*0.3*this.shakyshake);
	        	this.context.translate(-this.spacecraft.x, -this.spacecraft.y);
				this.context.translate((Math.random()-0.5)*10*this.shakyshake, (Math.random()-0.5)*10*this.shakyshake);
				this.shakyshake -= this.shakyshake * 0.2;
			}
	    	
	    }
	}

	async getHighscores() {
		var response = await fetch("highscores");
		var obj = await response.json();
		this.highscores = obj.highscores;
	}

	async postHighscore(score) {
		const request = new Request("/highscores", {
			method: "POST",
			body: JSON.stringify({highscores: [score]})
		});
		fetch(request);
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

	getScore(xpos) {
		return ((xpos - this.xpos)/100).toFixed(2);
	}

	checkGameOver() {
		for (var i = 0; i < this.obstacles.length; i++) {
            if(this.spacecraft.isColliding(this.obstacles[i])) {
                this.gameOver(1);
            }
        }

        if(this.spacecraft.y < -80 || this.spacecraft.y > this.height+80) {
            this.gameOver(2);
        }
	}

	gameOver(reason) {
		this.gameState = reason;
		this.shakyshake = 1;
		this.deathX = this.spacecraft.x;
		this.spacecraftImg.src = "/img/spacecraft_damage3.png";
		//this.score = {rank: -1, score: this.getScore(this.deathX), time: this.score.time, date: Date.parse(new Date())};
		this.score.date = Date.parse(new Date());
		this.postHighscore(this.score);
		this.highscores.push(this.score);
		this.highscores.sort((a, b) => b.score - a.score);
		this.score.rank = this.highscores.findIndex((element) => element == this.score);
		//clearInterval(this.updateInterval);
		//setInterval(this.explosion.bind(this), 40);
	}

	drawGameOverScreen() {
		this.context.font = "100px justbreathe";
		this.context.textAlign = "center";
		this.context.textBaseline = "top"
        this.context.fillStyle = "white";
        this.context.fillText(this.getScore(this.deathX), this.viewPortX + this.width/2, 50);
        this.context.font = "20px astrospace";
        this.context.fillText("You travelled", this.deathX - this.xpos + this.width/2, 30);
        this.context.fillText("lightyears through cold and dark space", this.deathX - this.xpos + this.width/2, 150);
        this.context.fillText("rank", this.viewPortX+1050, 300);
        this.context.fillText("score", this.viewPortX+1150, 300);
        this.context.fillText("time (s)", this.viewPortX+1250, 300);
        this.context.fillText("date", this.viewPortX+1400, 300);
        this.context.font = "20px justbreathe";
        this.context.fillText(this.deathCauses[this.gameState-1], this.deathX - this.xpos + this.width/2, 230);
        this.context.font = "30px astrospace";
        this.context.fillText("until you", this.deathX - this.xpos + this.width/2, 200);

        this.context.font = "20px justbreathe";
        for(var i = 0; i < 10 && i < this.highscores.length; i++) {
        	this.context.fillStyle = "white";
        	if(i == this.score.rank) {
        		this.context.fillStyle = "yellow";
        	}
        	this.context.fillText(i+1, this.viewPortX+1050, 350 + i*30);
        	this.context.fillText(this.highscores[i].score, this.viewPortX+1150, 350 + i*30);
        	this.context.fillText(this.highscores[i].time.toFixed(1), this.viewPortX+1250, 350 + i*30);
        	this.context.fillText(this.formatDate(this.highscores[i].date), this.viewPortX+1400, 350 + i*30);
        }
	}

	printScore() {
		this.context.font = "30px justbreathe";
        this.context.fillStyle = "white";
        this.context.textAlign = "left";
		this.context.textBaseline = "bottom"
        this.context.fillText(this.getScore(this.spacecraft.x), this.spacecraft.x - this.xpos + 10, 50);
        this.context.font = "15px astrospace";
        this.context.fillText("lightyears away from home", this.spacecraft.x - this.xpos + 10, 70);
	}

	createObstacles() {
		var lastObstacle = this.obstacles[this.obstacles.length-1].x;
        if(lastObstacle < this.spacecraft.x + this.width) {
        	var newObstacle = new Asteroid(lastObstacle + this.nextObstacle(this.score.score / 10 + 6), Math.random()*this.height*3-this.height, Math.random()*60+10, Math.random()*2*Math.PI, Math.floor(Math.random()*5));
            newObstacle.xVelocity = (Math.random()-0.5)*0.001*this.score.score;
            newObstacle.yVelocity = (Math.random()-0.5)*0.001*this.score.score;
            newObstacle.angularVelocity = (Math.random()-0.5)*0.001;
            this.obstacles.push(newObstacle);
        }
	}

	refreshObstacles(elapsed, doDelete) {
		for (var i = 0; i < this.obstacles.length; i++) {
            if(this.obstacles[i].x + this.obstacles[i].radius < this.spacecraft.x - this.xpos && doDelete) {
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

	formatDate(timestamp) {
		var date = new Date(timestamp);
		return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')} ${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth()+1).padStart(2, '0')}.${date.getFullYear()}`;
	}
}