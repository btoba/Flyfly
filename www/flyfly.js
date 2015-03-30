var Ship = function(x, y) {
    this.x = x;
    this.y = y;
    this.dead = false;

    this.img = new Image();
    this.img.src = "/img/ship.png";

    this.Draw = function(context) {
        context.drawImage(this.img, this.x, this.y, 40, 40);
    }
};

function Render(ship) {
    var context = document.getElementById('mainCanvas').getContext("2d");
    ship.Draw(context);
}

var ship = new Ship(10, 10);
setInterval(function() {
    Render(ship);
}, 200);

