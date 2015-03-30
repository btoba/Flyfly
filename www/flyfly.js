var Ship = function(x, y, canvas) {
    this.x = x;
    this.y = y;
    this.dead = false;
    this.moving = false;

    this.img = new Image();
    this.img.src = "/img/ship.png";

    this.Draw = function(context) {
        var size = 150;
        context.drawImage(this.img, this.x - size / 2, this.y - size / 2, size, size);
    }

    var that = this;

    var status = document.getElementById("status");

    this.handleStart = function() {
        that.moving = true;
    }

    this.handleEnd = function() {
        that.moving = false;
        status.innerText = "Not moving";
    }

    this.handleMove = function(e) {
        e.preventDefault();

        var speed = 5;
        if (that.moving) {
            var initialX = e.clientX || e.changedTouches[0].pageX;
            var initialY = e.clientY || e.changedTouches[0].pageY;

            var newX = that.x - initialX,
                newY = that.y - initialY;

            that.x -= newX < 0 ? Math.max(newX, -speed) : Math.min(newX, speed);
            that.y -= newY < 0 ? Math.max(newY, -speed) : Math.min(newY, speed);

            status.innerText = "Moving to: " + that.x + ", " + that.y;
        }
    }

    canvas.addEventListener("touchstart", this.handleStart, false);
    canvas.addEventListener("touchend", this.handleEnd, false);
    canvas.addEventListener("touchmove", this.handleMove, false);
    canvas.addEventListener("mousedown", this.handleStart, false);
    canvas.addEventListener("mouseup", this.handleEnd, false);
    canvas.addEventListener("mousemove", this.handleMove, false);
};

var mainCanvas = document.getElementById('mainCanvas');

function Render(ship) {
    var context = mainCanvas.getContext("2d");

    // Clear canvas
    context.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    ship.Draw(context);
}

// Game

var ship = new Ship(10, 10, mainCanvas);

// Game loop

var fps = 60;
setInterval(function() {
    Render(ship);
}, 1000 / fps);

