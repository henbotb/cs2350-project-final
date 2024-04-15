const twoPlayer = 0
const easy = 1;
const hard = 2;

const canvasHeight = 500;
const canvasWidth = 500;

const paddleSpeed = 12;
const paddleWidth = 20;
const paddleHeight = 100;
const paddleLeftX = 20;
const paddleRightX = canvasWidth - (20 + paddleWidth);

let paddleLeftY = 250 - (Math.floor(paddleHeight / 2));
let paddleRightY = 250 - (Math.floor(paddleHeight / 2));

const ballSpeed = 2;
const ballSize = 20;
let ballDirection = [0, 0]; // maybe come up with a better way of initializing the direction
let ballGoingRight = true;
let ballCoords = [Math.floor(canvasWidth / 2), Math.floor(canvasHeight / 2)]

let leftScore = 0;
let rightScore = 0;

let difficulty = twoPlayer;


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
    switch(difficulty) {
        case 0:
            if(keyIsDown(UP_ARROW) && paddleRightY - paddleSpeed > 0) {
                paddleRightY -= paddleSpeed;
            }

            if(keyIsDown(DOWN_ARROW) && paddleRightY + paddleHeight + paddleSpeed < canvasHeight) {
                paddleRightY += paddleSpeed;
            }

            if(keyIsDown(87) && paddleLeftY - paddleSpeed > 0) {
                paddleLeftY -= paddleSpeed;
            }

            if(keyIsDown(83) && paddleLeftY + paddleHeight + paddleSpeed < canvasHeight) {
                paddleLeftY += paddleSpeed;
            }
    }
}

function updateBall() {
    let dx = ballDirection[0];
    let dy = ballDirection[1];

    let newX = ballCoords[0] + dx;
    let newY = ballCoords[1] + dy;


    // if(
    //     ((newX + (ballSize / 2) > paddleRightX) && (newX + (ballSize / 2) < paddleRightX + paddleWidth)
    // )

    if( 
     ((newX + (ballSize / 2) > paddleRightX) && ((ballCoords[1] < paddleRightY + paddleHeight) && (ballCoords[1] > paddleRightY))) ||
     ((newX - (ballSize / 2) < paddleLeftX + paddleWidth) && ((ballCoords[1] < paddleLeftY + paddleHeight) && (ballCoords[1] > paddleLeftY))) 
    ){
        ballDirection[0] *= -1;
        if(ballDirection[0] >= 10) {
            ballDirection[0] -= 2 * Math.random();
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

    } // canvas edge detection

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

    ballCoords[0] += ballDirection[0]
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
    fill(0)
    stroke(255);
    strokeWeight(4);
    text(leftScore, paddleLeftX + 30, 40); // draw left score
    text(rightScore, paddleRightX - 30, 40); // draw right score
}

function setup() {
    setBall();
    createCanvas(canvasHeight, canvasWidth);
}

function draw() {
    let bouncesTotal = 0;
    
    background(0, 0, 0);
    updatePaddle();
    let gameState = updateBall();
    if(gameState === -2) {
        leftScore++;
        gameState = 0;
        setBall();
    } else if(gameState === -1) {
        rightScore++;
        gameState = 0;
        setBall();
    } else if(gameState === 0) {
        bouncesTotal++;
    }


    // win detection
    if(rightScore === 10 || leftScore === 10) {
        displayWin();
        setBall();
        ballCoords = [Math.floor(canvasWidth / 2), Math.floor(canvasHeight / 2)];
    }

    drawGame();

}