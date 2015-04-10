var canvasWidth = 505, // ctx.canvas.width per engine.js
    numCol = 5, // Also per engine.js
    blockWidth = canvasWidth / numCol,
    halfCanvasWidth = (canvasWidth / 2) - (blockWidth / 2),
    spriteWidth = 101,
    halfSprite = spriteWidth / 2;

function generateRandomNumber(bottomNumber, topNumber) {
    return Math.random() * (topNumber - bottomNumber) + bottomNumber;
}

function generateXCoordinate() {
    return Math.round( generateRandomNumber(0, 50) ) * 101; // Objects bearing this function are aligned with player's x-axis movement and are generated on-canvas 1/10 times
}

function generateYCoordinate() {
    return Math.round( generateRandomNumber(1, 3) ) * 75; // // Objects bearing this function are aligned with player's y-axis movement.  Possibilities = 75, 150, and 225; 75 was chosen over 83 (block height) because it keeps enemies on stone blocks and relatively evenly spaced.
}

function checkCollision(x1, x2) {
    if (x2 > x1 - halfSprite && x2 < x1 + halfSprite) {
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
    this.x = this.x + dt * 100;
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
        $('h1').text('Player Triumphs!').removeClass('collision-message, success-message').addClass('win-message');
        bogusCodeToEndGame // Not sure how to do this properly!
    }

    if (this.x > canvasWidth) {
        this.x = 0; // Loops enemies
        this.y = generateYCoordinate();
        // console.log(this.y);
    }

    if ( this.y === player.y && checkCollision(player.x, this.x) ) { // Moves player back to starting point in the case of enemy collision
        player.health -= 10;
        if (player.health > 0) {
            $('h1').text('Ouch! Health: ' + player.health).removeClass('success-message').addClass('collision-message');
        } else {
            $('h1').text('Game Over').removeClass('success-message').addClass('collision-message');
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
    if (this.y === 0) { // When player reaches water,
        this.score++; // increase score by 1
        if (this.score % 10 !== 0) {
            $('h1').text(this.successMessages[this.randomSuccessMessage] + ' Score: ' + this.score + '/100').removeClass('collision-message').addClass('success-message');
        } else {
            this.level++;
            $('h1').text('Level: ' + this.level).removeClass('collision-message').addClass('success-message');
            heart.x = generateXCoordinate();
            heart.y = generateYCoordinate();
            key.x = generateXCoordinate();
            key.y = generateYCoordinate();
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
    this.x = generateXCoordinate();
    this.y = generateYCoordinate();
};

Heart.prototype.update = function() {
    if (this.x === player.x && this.y === player.y) {
        player.health += 100;
        this.x = -101; // Makes heart disappear
        this.y = -101; // Makes heart disappear
        $('h1').text('Refreshing! Health: ' + player.health + '/100').removeClass('collision-message').addClass('success-message');
    }
};

var Key = function() {
    this.sprite = 'images/Key.png';
    this.x = generateXCoordinate();
    this.y = generateYCoordinate();
};

Key.prototype.update = function() {
    if (this.x === player.x && this.y === player.y) {
        player.score += 10;
        player.level++;
        this.x = -101; // Makes key disappear
        this.y = -101; // Makes key disappear
        $('h1').text('Next level! Level: ' + player.level).removeClass('collision-message').addClass('success-message');
        player.x = halfCanvasWidth; // Returns player to starting X-coordinate
        player.y = 375; // Returns player to starting Y-coordinate
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