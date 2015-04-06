var canvasWidth = 505, // canvas.width per engine.js
    numberHorizontalBlocks = 5,
    halfCanvasWidth = (canvasWidth / numberHorizontalBlocks) * 2,
    oneBlock = canvasWidth / numberHorizontalBlocks,
    halfBlock = oneBlock / 2,
    health = 100,
    score = 0;

function generateRandomNumber(bottomNumber, topNumber) {
    return Math.random() * (topNumber - bottomNumber) + bottomNumber;
}

function rangeCheck(p1, p2) {
    if (p2 > p1 - halfBlock && p2 < p1 + halfBlock) {
        return true;
    }
}

// Enemies our player must avoid
var Enemy = function(xCoordinate, yCoordinate) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    this.x = xCoordinate;
    this.y = yCoordinate;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + dt * 300; // TODO: Increase speed each time player wins

    if (this.x > canvasWidth) {
        this.x = 0; // Loops enemies
        this.y = Math.round( generateRandomNumber(1, 3) ) * 75; // Keeps enemies on stone blocks
    }

    if ( this.y === player.y && rangeCheck(player.x, this.x) ) { // Moves player back to starting point in the case of enemy collision
        health -= 10;
        alert('Ouch!\nHealth: ' + health + '%');
        player.x = halfCanvasWidth;
        player.y = 375;
    }
};

// Draw the enemy (and player) on the screen, required method for game
Object.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(xCoordinate, yCoordinate) {
    this.sprite = 'images/char-princess-girl.png';
    this.x = xCoordinate;
    this.y = yCoordinate;
};

Player.prototype.update = function() {

    this.x = this.x;
    this.y = this.y;

    if (this.y === 0) { // When player reaches water
        score += 1; // Increases score by 1
        alert('Player triumphs over enemies!\nScore: ' + score);
        this.x = halfCanvasWidth; // Returns player to starting X-coordinate
        this.y = 375; // Returns player to starting Y-coordinate
   }
};

// See Object.prototype for Player render() method

Player.prototype.handleInput = function(keys) {
    console.log(this.x + ', ' + this.y);
    switch(keys) {
        case 'left' :
            if (this.x > 0 ) { // Keeps player from going off left-hand side of canvas
                this.x = this.x - oneBlock;
            }
            break;
        case 'right' :
            if (this.x < halfCanvasWidth + ( oneBlock * 2 )) { // Keeps player from going off right-hand side of canvas
                this.x = this.x + oneBlock;
            }
            break;
        case 'up' :
            this.y = this.y - 75;
            break;
        case 'down' :
            if (this.y < 375) { // Keeps player from going below canvas
                this.y = this.y + 75;
            }
            break;
    }
};


// Now instantiate your objects.

// Place all enemy objects in an array called allEnemies
var allEnemies = [];
allEnemies.push(
    new Enemy( generateRandomNumber(0, canvasWidth), 60 ),
    new Enemy( generateRandomNumber(0, canvasWidth), 154 ),
    new Enemy( generateRandomNumber(0, canvasWidth), 234 )
);

// Place the player object in a variable called player
var player = new Player(halfCanvasWidth, 375);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});