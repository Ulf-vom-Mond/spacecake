var keys = 0
var keymap = [87, 65, 83, 68]

var xpos = 300



var spacecraftMass = 3000;
var spacecraftRotationalInertia = 100000;
var friction = 5
var rotFriction = 10000
var bgspeed = 0.3

var obstacles = []

window.onload = function() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var updateInterval

    var width = window.innerWidth;
    var height = window.innerHeight;
    // Set canvas size to window size
    canvas.width = width
    canvas.height = height

    var bgImg = new Image()
    bgImg.src = "/img/background.png"

    var spacecraftImg = new Image();
    spacecraftImg.src = "/img/spacecraft.png"

    var asteroidImgs = ["/img/asteroid_25.png", "/img/asteroid_50.png", "/img/asteroid_100.png", "/img/asteroid_150.png", "/img/asteroid_200.png"]

    var last_update = new Date();

    var thrusters = [[-50, -30, -Math.PI/4*5], [-40, 20, Math.PI/12], [40, 20, -Math.PI/12], [50, -30, Math.PI/4*5]]
    //var thrusters = [[0, 40, Math.PI/2], [50, 0, Math.PI], [0, -40, -Math.PI/2], [-50, 0, 0]]

    var spacecraftpos = [xpos, height/2, Math.PI/2]
    var spacecraftspeed = [0, 0, 0]

    for (var i = 500; i < width; i += nextObstacle()) {
        obstacles.push([i, Math.random()*height, Math.random()*60+10, Math.random()*2*Math.PI, new Image()])
        obstacles[obstacles.length - 1][4].src = asteroidImgs[Math.floor(Math.random()*5)]
    }

    function update() {
        var elapsed = new Date() - last_update;
        last_update = new Date();
        ctx.save()

        //console.log(elapsed)
        
        ctx.clearRect(spacecraftpos[0] - xpos, 0, canvas.width, canvas.height);
        ctx.drawImage(bgImg, Math.floor(bgspeed*spacecraftpos[0]/bgImg.width)*bgImg.width-width+spacecraftpos[0]*(1-bgspeed), 0, bgImg.width, height)
        ctx.drawImage(bgImg, Math.floor(bgspeed*spacecraftpos[0]/bgImg.width)*bgImg.width-width+bgImg.width-1+spacecraftpos[0]*(1-bgspeed), 0, bgImg.width, height)
        //ctx.drawImage(bgImg, spacecraftpos[0]*0.8-width, 0, bgImg.width, height)

        var lastObstacle = obstacles[obstacles.length-1][0]
        for (var i = lastObstacle += nextObstacle(); i < lastObstacle + width; i += nextObstacle()) {

            obstacles.push([i, Math.random()*height, Math.random()*60+10, Math.random()*2*Math.PI, new Image()])
            obstacles[obstacles.length - 1][4].src = asteroidImgs[Math.floor(Math.random()*5)]
        }   

        for (var i = 0; i < obstacles.length; i++) {
            ctx.drawImage(obstacles[i][4], obstacles[i][0]-obstacles[i][2], obstacles[i][1]-obstacles[i][2], obstacles[i][2]*2, obstacles[i][2]*2)

            if(Math.sqrt(Math.pow(obstacles[i][0] - spacecraftpos[0], 2) + Math.pow(obstacles[i][1] - spacecraftpos[1], 2)) < obstacles[i][2] + 60) {
                clearInterval(updateInterval)
            }
            if(spacecraftpos[1] < -60 || spacecraftpos[1] > height+60) {
                clearInterval(updateInterval)
            }
        }

        ctx.font = "30px Arial";
        ctx.fillStyle = "white"
        ctx.fillText(((spacecraftpos[0] - xpos)/10).toFixed(1), spacecraftpos[0] - xpos + 10, 50); 

        ctx.translate(spacecraftpos[0], spacecraftpos[1]);
        ctx.rotate(spacecraftpos[2]);
        // ctx.beginPath();
        // ctx.lineWidth = "1";
        // ctx.strokeStyle = "green";
        // ctx.rect(-50, -40, 100, 80);
        // ctx.stroke();
        ctx.drawImage(spacecraftImg, -spacecraftImg.width/2, -spacecraftImg.height/2, spacecraftImg.width, spacecraftImg.height)

        fetch("/keys").then(function(response) {
                return response.json();
            }).then(function(data) {
                keys = data.keys
                //console.log(keys)
            }).catch(function(err) {
                console.log('Fetch Error :-S', err);
            });

        var force = [0, 0, 0]
        force[0] -= Math.sign(spacecraftspeed[0]) * Math.pow(spacecraftspeed[0], 2) * friction
        force[1] -= Math.sign(spacecraftspeed[1]) * Math.pow(spacecraftspeed[1], 2) * friction
        force[2] -= Math.sign(spacecraftspeed[2]) * Math.pow(spacecraftspeed[2], 2) * rotFriction

        for(var i = 0; i < thrusters.length; i++) {
            var thruster = thrusters[i]

            ctx.save()
            ctx.translate(thruster[0], thruster[1]);
            ctx.rotate(thruster[2]);
            // ctx.beginPath();
            // ctx.strokeStyle = "red";
            // ctx.rect(-10, -5, 20, 10);
            // ctx.stroke();

            
            

            if(keys & 0b1<<i){
                ctx.beginPath();
                ctx.strokeStyle = "red";
                ctx.lineWidth = "3";
                var flameLength = Math.random() * 20 + 30
                ctx.moveTo(-10, 5)
                ctx.lineTo(0, flameLength)
                ctx.lineTo(10, 5)
                ctx.stroke();
                ctx.beginPath();
                ctx.strokeStyle = "orange";
                ctx.lineWidth = "3";
                flameLength = Math.random() * 15 + 20
                ctx.moveTo(-10, 5)
                ctx.lineTo(0, flameLength)
                ctx.lineTo(10, 5)
                ctx.stroke();
                ctx.beginPath();
                ctx.strokeStyle = "yellow";
                ctx.lineWidth = "3";
                flameLength = Math.random() * 10 + 10
                ctx.moveTo(-10, 5)
                ctx.lineTo(0, flameLength)
                ctx.lineTo(10, 5)
                ctx.stroke();
                var thrusterAngle = Math.PI/2 - thruster[2] + Math.atan2(thruster[1], thruster[0])
                var absThrusterAngle = thruster[2] + spacecraftpos[2]
                
                force[0] += Math.sin(absThrusterAngle)
                force[1] -= Math.cos(absThrusterAngle)
                force[2] -= Math.sin(thrusterAngle)
                                
            }
            ctx.restore()

            

        }

        spacecraftspeed[0] += force[0] / spacecraftMass * elapsed
        spacecraftspeed[1] += force[1] / spacecraftMass * elapsed
        spacecraftspeed[2] += force[2] / spacecraftRotationalInertia * elapsed


        spacecraftpos[0] += spacecraftspeed[0] * elapsed;

        spacecraftpos[1] += spacecraftspeed[1] * elapsed;
        spacecraftpos[2] += spacecraftspeed[2] * elapsed;
        spacecraftpos[2] = spacecraftpos[2] //% (2*Math.PI)



        keys = [0, 0, 0, 0]
        ctx.restore()
        ctx.translate(-spacecraftspeed[0] * elapsed, 0)
    }


    updateInterval = setInterval(update, 40);
    //update();
};


// document.addEventListener('keydown', function(event) {
//     if(event.keyCode == 49) {
//         keys[0] = 1
//     }
//     if(event.keyCode == 50) {
//         keys[1] = 1
//     }
//     if(event.keyCode == 51) {
//         keys[2] = 1
//     }
//     if(event.keyCode == 52) {
//         keys[3] = 1
//     }
// });


window.addEventListener("keydown",
    function(e){
        keys[e.keyCode] = true;
    },
false);

window.addEventListener('keyup',
    function(e){
        keys[e.keyCode] = false;
    },
false);

function roundp(number, precision) {
    return Math.pow(10, -precision) * Math.trunc(Math.round(Math.pow(10, precision) * number))
}

function nextObstacle(){
    return Math.random()*300+100
}