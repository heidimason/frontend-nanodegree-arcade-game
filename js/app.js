var canvasWidth = 505, // ctx.canvas.width per engine.js
    numCol = 5, // Also per engine.js
    blockWidth = canvasWidth / numCol,
    halfCanvasWidth = (canvasWidth / 2) - (blockWidth / 2),
    spriteWidth = 101,
    halfSprite = spriteWidth / 2;

function generateRandomNumber(bottomNumber, topNumber) {
    return Math.random() * (topNumber - bottomNumber) + bottomNumber;
}

function checkCollision(p1, p2) {
    if (p2 > p1 - halfSprite && p2 < p1 + halfSprite) {
        return true;
    }
}

// Enemies our player must avoid
var Enemy = function(xCoordinate, yCoordinate) {
    // Variables applied to each of our instances go here

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
    this.speed = this.x + dt * 100;
    this.x = this.speed;
    // TODO: Find out if it's possible to loop this without speed increasing exponentially!
    // i.e. if (player.score > 0 && player.score % 10 == 0) {

    // }
    if (player.score >= 10 && player.score < 20) {
        this.x = this.x + dt * 150;
    } else if (player.score >= 20 && player.score < 30) {
        this.x = this.x + dt * 200;
    } else if (player.score >= 30 && player.score < 40) {
        this.x = this.x + dt * 250;
    } else if (player.score >= 40 && player.score < 50) {
        this.x = this.x + dt * 300;
    } else if (player.score >= 50 && player.score < 60) {
        this.x = this.x + dt * 350;
    } else if (player.score >= 60 && player.score < 70) {
        this.x = this.x + dt * 400;
    } else if (player.score >= 70 && player.score < 80) {
        this.x = this.x + dt * 450;
    } else if (player.score >= 80 && player.score < 90) {
        this.x = this.x + dt * 500;
    } else if (player.score >= 90 && player.score < 100) {
        this.x = this.x + dt * 550;
    } else if (player.score >= 100) {
        $('h1#successMessages').text('Player Triumphs!');
        this.x = this.x + dt * 0;
    }

    if (this.x > canvasWidth) {
        this.x = 0; // Loops enemies
        this.y = Math.round( generateRandomNumber(1, 3) ) * 75; // Possibilities = 75, 150, or 225 (75 chosen over 83 (blockHeight) because it keeps enemies on stone blocks)
        // console.log(this.y);
    }

    if ( this.y === player.y && checkCollision(player.x, this.x) ) { // Moves player back to starting point in the case of enemy collision
        player.health -= 10;
        if (player.health > 0) {
            $('h1#collisionMessages').text('Ouch! Health: ' + player.health + '/100');
        } else {
            $('h1#collisionMessages').text('Game Over');
            $('h1#successMessages').remove();
            bogusCodeToEndGame // Not sure how to do this properly!
        }
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
var Player = function() {
    this.sprite = 'images/char-princess-girl.png';
    this.x = halfCanvasWidth;
    this.y = 375;
    this.health = 100;
    this.score = 0;
    this.level = 1;
    this.successMessages = ['Booyah!', 'Woohoo!', 'Yeehaw!'];
    this.randomSuccessMessage = Math.floor( Math.random() * 3 );
};

Player.prototype.update = function() {
    this.x = this.x;
    this.y = this.y;

    if (this.y === 0) { // When player reaches water,
        this.score++; // increase score by 1
        if (this.score % 10 !== 0) {
            $('h1#successMessages').text(this.successMessages[this.randomSuccessMessage] + ' Score: ' + this.score + '/100');
        } else {
            this.level++;
            $('h1#successMessages').text('Level: ' + this.level);
        }
        this.x = halfCanvasWidth; // Returns player to starting X-coordinate
        this.y = 375; // Returns player to starting Y-coordinate
   }
};

// See Object.prototype for Player render() method

Player.prototype.handleInput = function(keys) {
    switch(keys) {
        case 'left' :
            if (this.x > 0 ) { // Keeps player from going off left-hand side of canvas
                this.x = this.x - blockWidth;
            }
            break;
        case 'up' :
            this.y = this.y - 75;
            break;
        case 'right' :
            if ( this.x < blockWidth * 4 ) { // Keeps player from going off right-hand side of canvas
                this.x = this.x + blockWidth;
            }
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
    new Enemy( generateRandomNumber(0, canvasWidth), 75 ),
    new Enemy( generateRandomNumber(0, canvasWidth), 75 * 2 ),
    new Enemy( generateRandomNumber(0, canvasWidth), 75 * 3 )
);

// Place the player object in a variable called player
var player = new Player();


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