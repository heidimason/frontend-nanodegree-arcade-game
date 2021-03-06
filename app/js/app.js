var canvasWidth = 505, // ctx.canvas.width per engine.js
    numCol = 5, // Also per engine.js
    blockWidth = canvasWidth / numCol,
    halfCanvasWidth = (canvasWidth / 2) - (blockWidth / 2),
    spriteWidth = 101,
    halfSprite = spriteWidth / 2;

function generateRandomNumber(bottomNumber, topNumber) {
    return Math.random() * (topNumber - bottomNumber) + bottomNumber;
}

function generateXCoordinateOnOrOffCanvas() {
    return Math.round( generateRandomNumber(0, 25) ) * 101; // Objects bearing this function are aligned with player's x-axis movement and are generated on-canvas 1 in 5 times
}

function generateXCoordinateOnCanvas() {
    return Math.round( generateRandomNumber(0, 4) ) * 101; // Objects bearing this function are aligned with player's x-axis movement and are generated on-canvas every time
}

function generateYCoordinate() {
    return Math.round( generateRandomNumber(1, 3) ) * 75; // // Objects bearing this function are aligned with player's y-axis movement.  Possibilities = 75, 150, and 225; 75 was chosen over 83 (block height) because it keeps enemies on stone blocks and relatively evenly spaced.
}

function hideObjects() { // Hides objects so that they are not left on canvas
    heart.x = -101;
    heart.y = -101;
    star.x = -101;
    star.y = -101;
    gemOrange.x = -101;
    gemOrange.y = -101;
    gemGreen.x = -101;
    gemGreen.y = -101;
    gemBlue.x = -101;
    gemBlue.y = -101;
    key.x = -101;
    key.y = -101;
}

// Draw objects on the screen, required method for game
Object.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

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
    this.x = this.x + dt * 100;
    // TODO: Find out if it's possible to loop this without speed increasing exponentially!
    // i.e. if (player.score > 0 && player.score % 10 == 0) {

    // }

    // Increments enemy speed with level increase
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
    } else if (player.score >= 100 || player.health === 0) { // i.e. If player wins or game is over,
        this.x = -101; // hide enemies
        hideObjects(); // and other objects too
    }

    if (this.x > canvasWidth) {
        this.x = 0; // Loops enemies
        this.y = generateYCoordinate();
        // console.log(this.y);
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/grass-block.png'; // Placeholder - see /js/avatar.js for possible values
    this.x = halfCanvasWidth;
    // this.y = 375; // See /js/avatar.js for this value
    this.score = 0;
    this.level = 1;
    this.health = 100;
    this.successMessages = ['Booyah!', 'Woohoo!', 'Yeehaw!', 'Bam!'];

    this.checkCollision = function(x1, x2) {
        if (x2 > x1 - halfSprite && x2 < x1 + halfSprite) {
            return true;
        }
    };

    this.resetPlayerCoordinates = function() {
        this.x = halfCanvasWidth; // Returns player to starting X-coordinate
        this.y = 375; // Returns player to starting Y-coordinate
    };

    this.increaseLevel = function() {
        this.level++;
        $('h1').text('Level: ' + this.level).removeClass('collision-message').addClass('success-message');
        this.resetPlayerCoordinates();
        heart.x = generateXCoordinateOnOrOffCanvas();
        heart.y = generateYCoordinate();
        star.x = generateXCoordinateOnOrOffCanvas();
        star.y = generateYCoordinate();
        gemOrange.x = generateXCoordinateOnOrOffCanvas();
        gemOrange.y = generateYCoordinate();
        gemBlue.x = generateXCoordinateOnOrOffCanvas();
        gemBlue.y = generateYCoordinate();
        gemGreen.x = generateXCoordinateOnOrOffCanvas();
        gemGreen.y = generateYCoordinate();
        key.x = generateXCoordinateOnOrOffCanvas();
        key.y = generateYCoordinate();
    };

    this.increaseScore = function() {
        this.score++;
        if (this.score % 10 !== 0) {
            $('h1').text(this.successMessages[this.randomSuccessMessage] + ' Score: ' + this.score + '/100').removeClass('collision-message').addClass('success-message');
        } else {
            this.increaseLevel();
        }
    };
};

Player.prototype.update = function() {
    if ( (this.checkCollision(this.x, allEnemies[0].x) && allEnemies[0].y === this.y) || (this.checkCollision(this.x, allEnemies[1].x) && allEnemies[1].y === this.y) || (this.checkCollision(this.x, allEnemies[2].x) && allEnemies[2].y === this.y) ) {
        this.health -= 10;
        if (this.health > 0) {
            $('h1').text('Ouch! Health: ' + this.health).removeClass('success-message').addClass('collision-message');
        } else {
            $('h1').text('Game Over').removeClass('success-message').addClass('collision-message');
        }
        this.resetPlayerCoordinates();
    }

    if (this.x === heart.x && this.y === heart.y) {
        this.health += 50;
        $('h1').text('Refreshing! Health: ' + this.health).removeClass('collision-message').addClass('success-message');
    }

    if (this.x === star.x && this.y === star.y) {
        this.score += 10;
        this.increaseLevel();
    }

    if ( (this.x === gemOrange.x && this.y === gemOrange.y) || (this.x === gemBlue.x && this.y === gemBlue.y) || (this.x === gemGreen.x && this.y === gemGreen.y) ) {
        this.increaseScore();
        $('h1').text('Cha-ching! Score: ' + this.score + '/100').removeClass('collision-message').addClass('success-message');
    }

    if (this.y === 0) { // If player reaches water
        this.randomSuccessMessage = Math.floor( Math.random() * 4 );
        this.increaseScore();
        this.resetPlayerCoordinates();
        hideObjects();
        gemOrange.x = generateXCoordinateOnOrOffCanvas();
        gemOrange.y = generateYCoordinate();
        gemGreen.x = generateXCoordinateOnOrOffCanvas();
        gemGreen.y = generateYCoordinate();
        gemBlue.x = generateXCoordinateOnOrOffCanvas();
        gemBlue.y = generateYCoordinate();
    }

    if (this.score === 100) {
        $('h1').text('Player Triumphs!').removeClass('collision-message, success-message').addClass('win-message');
    }
};

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
            if ( this.x < 404 ) { // Keeps player from going off right-hand side of canvas
                this.x = this.x + blockWidth;
            }
            break;
        case 'down' :
            if (this.y < 375) { // Keeps player from going below canvas
                this.y = this.y + 75;
            }
            break;
    }
    // console.log(this.x + ', ' + this.y);
};


var Heart = function() {
    this.sprite = 'images/Heart.png';
    this.x = generateXCoordinateOnOrOffCanvas();
    this.y = generateYCoordinate();
};

Heart.prototype.update = function() {
    if (this.x === player.x && this.y === player.y) {
        this.x = -101; // Hides heart
        this.y = -101; // Hides heart
    }

    if (key.x === player.x && key.y === player.y) {
        this.x = generateXCoordinateOnCanvas();
        this.y = generateYCoordinate();
    }
};


var Star = function() {
    this.sprite = 'images/Star.png';
    this.x = generateXCoordinateOnOrOffCanvas();
    this.y = generateYCoordinate();
};

Star.prototype.update = function() { // Takes player to next level
    if (this.x === player.x && this.y === player.y) {
        this.x = -101; // Hides star
        this.y = -101; // Hides star
        hideObjects();
    }

    if (key.x === player.x && key.y === player.y) {
        this.x = generateXCoordinateOnCanvas();
        this.y = generateYCoordinate();
    }
};


var Gem = function() {
    this.x = generateXCoordinateOnOrOffCanvas();
    this.y = generateYCoordinate();
};

Gem.prototype.update = function() {
    if (this.x === player.x && this.y === player.y) {
        this.x = -101; // Hides gem
        this.y = -101; // Hides gem
    }

    if (key.x === player.x && key.y === player.y) {
        this.x = generateXCoordinateOnCanvas();
        this.y = generateYCoordinate();
    }
};


var Key = function() {
    this.sprite = 'images/Key.png';
    this.x = generateXCoordinateOnOrOffCanvas();
    this.y = generateYCoordinate();
};

Key.prototype.update = function() {
    if (this.x === player.x && this.y === player.y) {
        this.x = -101; // Hides key
        this.y = -101; // Hides key
        $('h1').text('Jackpot!').removeClass('collision-message').addClass('success-message');
    }
};


// Now instantiate your objects.

// Place all enemy objects in an array called allEnemies
var allEnemies = [];
allEnemies.push(
    new Enemy( generateRandomNumber(0, canvasWidth), generateYCoordinate() ),
    new Enemy( generateRandomNumber(0, canvasWidth), generateYCoordinate() ),
    new Enemy( generateRandomNumber(0, canvasWidth), generateYCoordinate() )
);

// Place the player object in a variable called player
var player = new Player();

var heart = new Heart();
var star = new Star();

var gemOrange = new Gem();
gemOrange.sprite = 'images/Gem Orange.png';

var gemGreen = new Gem();
gemGreen.sprite = 'images/Gem Green.png';

var gemBlue = new Gem();
gemBlue.sprite = 'images/Gem Blue.png';

var key = new Key();

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