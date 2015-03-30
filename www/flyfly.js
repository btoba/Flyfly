var FPS = 60;

var Ship = function(x, y, canvas) {
    this.x = x;
    this.y = y;
    this.dead = false;
    this.moving = false;
    this.movingIntervalId = -1;
    this.dirX = 0;
    this.dirY = 0;

    this.img = new Image();
    this.img.src = "/img/ship.png";

    this.draw = function(context) {
        var size = 150;
        context.drawImage(this.img, this.x - size / 2, this.y - size / 2, size, size);
    }

    var that = this;

    var status = document.getElementById("status");

    this.doMove = function () {
        var speed = 20;
        if (that.moving) {
            var newX = that.x - that.dirX,
                newY = that.y - that.dirY;

            that.x -= newX < 0 ? Math.max(newX, -speed) : Math.min(newX, speed);
            that.y -= newY < 0 ? Math.max(newY, -speed) : Math.min(newY, speed);

            status.innerText = "Moving to: " + that.x + ", " + that.y;
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
        status.innerText = "Not moving";

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

var mainCanvas = document.getElementById('mainCanvas');
mainCanvas.width = document.body.clientWidth;
mainCanvas.height = document.body.clientHeight;

function Render(ship) {
    var context = mainCanvas.getContext("2d");

    // Clear canvas
    context.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    ship.draw(context);
}

// Game

var ship = new Ship(10, 10, mainCanvas);

// Game loop

setInterval(function() {
    Render(ship);
}, 1000 / FPS);

