let isTwoPlayer = false
const easy = 1;
const hard = 2;

const canvasHeight = 500;
const canvasWidth = 500;

const paddleSpeed = 15;
const paddleWidth = 20;
const paddleHeight = 100;
const paddleLeftX = 20;
const paddleRightX = canvasWidth - (20 + paddleWidth);

let gameInProgress = false;
let gameTypeChosen = false;

let paddleLeftY = 250 - (Math.floor(paddleHeight / 2));
let paddleRightY = 250 - (Math.floor(paddleHeight / 2));

const ballSpeed = 3;
const ballSize = 20;
let ballDirection = [0, 0]; // maybe come up with a better way of initializing the direction
let ballGoingRight = true;
let ballCoords = [Math.floor(canvasWidth / 2), Math.floor(canvasHeight / 2)]

let leftScore = 0;
let rightScore = 0;

let cnv;


function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function choice(array) {
    if (array.length === 0) {
      throw new Error('Cannot choose from an empty array');
    }
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}

function setBall() {
    ballCoords = [Math.floor(canvasWidth / 2), Math.floor(canvasHeight / 2)]
    if(ballGoingRight) {
        let y = (randInt(0, 1) === 0) ? 2 : -2 
        ballDirection = [2 * ballSpeed, y * ballSpeed]
        ballGoingRight = false;
    } else {
        let y = (randInt(0, 1) === 0) ? 2 : -2 
        ballDirection = [-2 * ballSpeed, y * ballSpeed]
    }

    paddleLeftY, paddleRightY = 250 - (Math.floor(paddleHeight / 2));
}

function displayWin() {

}


function updatePaddle() {
    // Allow paddle control regardless of game state; check directly with keyIsDown
    if (keyIsDown(UP_ARROW)) {
        paddleRightY = max(0, paddleRightY - paddleSpeed);  // Prevents going above canvas
    }
    if (keyIsDown(DOWN_ARROW)) {
        paddleRightY = min(canvasHeight - paddleHeight, paddleRightY + paddleSpeed);  // Prevents going below canvas
    }
    if (keyIsDown(87)) {  // 'W'
        paddleLeftY = max(0, paddleLeftY - paddleSpeed);  // Prevents going above canvas
    }
    if (keyIsDown(83)) {  // 'S'
        paddleLeftY = min(canvasHeight - paddleHeight, paddleLeftY + paddleSpeed);  // Prevents going below canvas
    }

    if(!isTwoPlayer) {
        paddleLeftY = ballCoords[1] - paddleHeight / 2
    }
}

function updateBall() {
    let dx = ballDirection[0];
    let dy = ballDirection[1];

    let newX = ballCoords[0] + dx;
    let newY = ballCoords[1] + dy;

    if( 
     ((newX + (ballSize / 2) > paddleRightX) && ((ballCoords[1] < paddleRightY + paddleHeight) && (ballCoords[1] > paddleRightY))) ||
     ((newX - (ballSize / 2) < paddleLeftX + paddleWidth) && ((ballCoords[1] < paddleLeftY + paddleHeight) && (ballCoords[1] > paddleLeftY))) // paddle collision detection
    ){
        ballDirection[0] *= -1; // reflect x velocity
        if(ballDirection[0] >= 10) {
            ballDirection[0] -= 2 * Math.random(); // bump value for variablity in gameplay and not perfect
        } else if(ballDirection[0] <= -10 || randInt(0, 1) == 0) {
            ballDirection[0] += 2 * Math.random();
        } else {
            ballDirection[0] -= 2 * Math.random();
        }

        if(ballDirection[1] >= 10) {
            ballDirection[1] -= 2 * Math.random();
        } else if(ballDirection[1] <= -10 || randInt(0, 1) == 0) {
            ballDirection[1] += 2 * Math.random();
        } else {
            ballDirection[1] -= 2 * Math.random();
        }

    }

    if(newX + (ballSize / 2) > canvasWidth) {
        return -2; // left score
    } else if(newX - (ballSize / 2) < 0) {
        return -1; // right score
    }

    if(
        (newY + ballSize / 2 > canvasHeight) ||
        (newY - ballSize / 2 < 0)
        ) {
           // ballDirection[1] = 0;
           ballDirection[1] *= -1;
       } // canvas edge detection

    
    ballDirection[0] += ((ballDirection[0] < 3) && (ballDirection[0] > 0)) ? randInt(1, 3) : ((ballDirection[0] > -3) && (ballDirection[0] < 0)) ? randInt(-1, -3) : 0; 

    ballDirection[1] += ((ballDirection[1] < 3) && (ballDirection[1] > 0)) ? randInt(1, 3) : ((ballDirection[1] > -3) && (ballDirection[1] < 0)) ? randInt(-1, -3) : 0;

    ballCoords[0] += ballDirection[0]; // update ball value
    ballCoords[1] += ballDirection[1];

    return 0; //running normally
}

function drawGame() {
    noStroke();
    fill(255, 255, 255)
    rect(paddleLeftX, paddleLeftY, paddleWidth, paddleHeight) // draw left paddle
    rect(paddleRightX, paddleRightY, paddleWidth, paddleHeight) // draw right paddle
    ellipse(ballCoords[0], ballCoords[1], ballSize, ballSize) // draw ball
    textSize(30);
    fill(255)
    text(leftScore, paddleLeftX + 30, 40); // draw left score
    text(rightScore, paddleRightX - 30, 40); // draw right score
    // strokeWeight(4);
    // stroke(127);
    // line(x, topY, x, bottomY)
}

function displayStartRoundScreen() {
    background(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Press Space to Start Round", width / 2, height / 2 - 90);
}

function displayStartScreen() {
    background(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Press 1 for single player", width / 2, height / 2 - 90);
    text("Press 2 for two player", width / 2, height / 2 - 45);

}

/* 
centerCanvas(), windowResized, and part of setup all thanks to:
https://github.com/processing/p5.js/wiki/Positioning-your-canvas

For some reason, I cannot figure out how to center it without messing up the webpage as a whole.

*/


function setup() {
    setBall();
    let cnv = createCanvas(canvasHeight, canvasWidth);
    cnv.parent('canvas-container')
}

function draw() {

    if (!gameInProgress && gameTypeChosen) { // if player has yet to start game, display start state
        displayStartRoundScreen();
    }

    if(!gameTypeChosen) { // if player has yet to choose game type, display start screen
        displayStartScreen();
    }
    
    updatePaddle();
    if (gameInProgress && gameTypeChosen) { 
        background(0);
        
        let gameState = updateBall();
        if (gameState !== 0) {  // On scoring
            if (gameState === -2) leftScore++;
            else if (gameState === -1) rightScore++;
            setBall();
            gameInProgress = false;  // Reset gameInProgress to require restart
        }
    }

    drawGame();

    if (keyIsDown(32) && !gameInProgress) {  // SPACE bar to start the game
        gameInProgress = true;
    }   

    if (keyIsDown(49) && !gameTypeChosen) { // extract game type chosen by player
        gameTypeChosen = true;
        isTwoPlayer = false;
    } else if (keyIsDown(50) && !gameTypeChosen) {
        gameTypeChosen = true;
        isTwoPlayer = true;
    }
}
