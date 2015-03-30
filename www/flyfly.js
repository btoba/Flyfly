var FPS = 60;

function areCollidingInternal(a, b) {
    if ((a.x - a.width / 2 > b.x - b.width / 2 && // Top left
         a.x - a.width / 2 < b.x + b.width / 2 &&
         a.y - a.height / 2 > b.y - b.height / 2 &&
         a.y - a.height / 2 < b.y + b.height / 2) ||
        (a.x + a.width / 2 > b.x - b.width / 2 && // Top right
         a.x + a.width / 2 < b.x + b.width / 2 &&
         a.y - a.height / 2 > b.y - b.height / 2 &&
         a.y - a.height / 2 < b.y + b.height / 2 ) ||
        (a.x - a.width / 2 > b.x - b.width / 2 && // Bottom left
         a.x - a.width / 2 < b.x + b.width / 2 &&
         a.y + a.height / 2 > b.y - b.height / 2 &&
         a.y + a.height / 2 < b.y + b.height / 2) ||
        (a.x + a.width / 2 > b.x - b.width / 2 && // Bottom right
         a.x + a.width / 2 < b.x + b.width / 2 &&
         a.y + a.height / 2 > b.y - b.height / 2 &&
         a.y + a.height / 2 < b.y + b.height / 2)) {
        return true;
    }

    return false;
}

function areColliding(a, b) {
    return areCollidingInternal(a, b) || areCollidingInternal(b, a);
}

var Ship = function(x, y, canvas) {
    this.x = x;
    this.y = y;
    this.size = 150;
    this.width = this.size;
    this.height = this.size;
    this.dead = false;
    this.moving = false;
    this.movingIntervalId = -1;
    this.dirX = 0;
    this.dirY = 0;
    this.hits = 0;
    this.passed = 0;

    this.img = new Image();
    this.img.src = "/img/ship.png";

    this.draw = function(context) {
        context.drawImage(this.img, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }

    var that = this;

    this.doMove = function () {
        var speed = 20;
        if (that.moving) {
            var newX = that.x - that.dirX,
                newY = that.y - that.dirY;

            that.x -= newX < 0 ? Math.max(newX, -speed) : Math.min(newX, speed);
            that.y -= newY < 0 ? Math.max(newY, -speed) : Math.min(newY, speed);
        }
    }

    this.handleStart = function(e) {
        that.moving = true;

        if (that.movingIntervalId == -1) {
            that.movingIntervalId = setInterval(function() {
                that.doMove();
            }, 1000 / FPS);
        }
    }

    this.handleEnd = function() {
        that.moving = false;

        // Stop following the finger
        if (that.movingIntervalId != -1) {
            clearInterval(that.movingIntervalId);
            that.movingIntervalId = -1;
        }
    }

    this.handleMove = function(e) {
        e.preventDefault();

        that.dirX = e.clientX || e.changedTouches[0].pageX;
        that.dirY = e.clientY || e.changedTouches[0].pageY;
    }

    canvas.addEventListener("touchstart", this.handleStart, false);
    canvas.addEventListener("touchend", this.handleEnd, false);
    canvas.addEventListener("touchmove", this.handleMove, false);
    canvas.addEventListener("mousedown", this.handleStart, false);
    canvas.addEventListener("mouseup", this.handleEnd, false);
    canvas.addEventListener("mousemove", this.handleMove, false);
};

var Obstacle = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.colission = false;

    this.draw = function (ctx) {
        ctx.fillStyle = this.collision ? "red" : "green";
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }

    this.move = function(speed) {
        this.y -= speed;
    }
}

var statusElem = document.getElementById("status");
var mainCanvas = document.getElementById('mainCanvas');
mainCanvas.width = document.body.clientWidth;
mainCanvas.height = document.body.clientHeight;

function Render(ship, obstacles) {
    var context = mainCanvas.getContext("2d");

    // Clear canvas
    context.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    ship.draw(context);

    obstacles.forEach(function(e) {
        e.draw(context);
    })

    statusElem.innerText = "Hits: " + ship.hits + " Passed: " + ship.passed + " (" + Math.floor(ship.hits / (ship.passed + ship.hits) * 100) + "%)";
}

// Game

var ship = new Ship(mainCanvas.width / 2, mainCanvas.height / 2, mainCanvas);
var obstacles = [];

var xLeft = 0,
    xRight = 0;

// Create path
function addMapSliceInternal(obstacles, centerX, x, y) {
    var rnd = Math.floor(5 * Math.random());
    var size = 40;

    if (rnd < 2) {
        x += size;
    }
    else if (rnd >= 3)
    {
        x -= size;
    }

    x = Math.min(x, 200);

    obstacles.push(new Obstacle(centerX, y, x + 150, 20));

    return x;
}

function addMapSlice(obstacles, right, y) {
    xLeft = addMapSliceInternal(obstacles, 0, xLeft, y);
    xRight = addMapSliceInternal(obstacles, right, xRight, y);
}

// Game loop

setInterval(function() {
    Render(ship, obstacles);

    obstacles.forEach(function(o) {
        o.collision = areColliding(ship, o);
        if (o.collision) {
            ship.hits++;
        }
        else
        {
            ship.passed++;
        }
        o.move(20);
    })

    addMapSlice(obstacles, mainCanvas.width, mainCanvas.height);
    if (obstacles.length > 100) {
        obstacles.splice(0, 2);
    }
}, 1000 / FPS);

