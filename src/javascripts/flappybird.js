let canvasHeight = 500
let canvasWidth = 500

let birdY = 250
let birdX = 250

let birdSize = 50 

let birdVeloX = 0
let birdVeloY = -10

let birdAcceleration = 0.5

let flap = -10

const pipeWidth = 50
const pipeGap = 200
const pipeSpacing = 300

let cnv
let playerInControl = true
let pipes
const LOST = -1
const INPROG = 0

let keyPressBuffer = false

let score = 0
let start = true

function initPipes() {
  pipes = [
  {
    x: canvasWidth + pipeSpacing * 0,
    gapStart: floor(random(pipeGap + 25, canvasHeight - 25)),
    passed: false
  },
  {
    x: canvasWidth + pipeSpacing * 1,
    gapStart: random(pipeGap + 25, canvasHeight - 25),
    passed: false
  },
  {
    x: canvasWidth + pipeSpacing * 2,
    gapStart: floor(random(pipeGap + 25, canvasHeight - 25)),
    passed: false
  },
  {
    x: canvasWidth + pipeSpacing * 3,
    gapStart: floor(random(pipeGap + 25, canvasHeight - 25)),
    passed: false
  }
] // [pipe left x, pipe gap start point, pipe gap length]
}

function setup() {
  initPipes()
  let cnv = createCanvas(canvasHeight, canvasWidth);
  cnv.parent('canvas-container')
}

function drawBird() {
  noStroke()
  fill(255, 255, 0)
  ellipse(birdX, birdY, birdSize)
  fill(255, 185, 0)
  ellipse(birdX + birdSize / 2, birdY, birdSize / 2.5) // beak (?)
  fill(255, 255, 255)
  ellipse(birdX - birdSize / 10, birdY - birdSize / 10, birdSize / 2)
  fill(0)
  ellipse(birdX, birdY - birdSize / 10, birdSize / 4)
}

function keyPressed() {
  if(keyCode === 32 && playerInControl && !start) {
    birdVeloY = flap
  } else if(keyCode === 32 && !playerInControl && !start) {
    restartGame()
  } else if(start) {
    start = false
  }
  return false
}

function birdLogic() {
  if (birdVeloY < 80) {
    birdVeloY += birdAcceleration
  }
  
  birdY += birdVeloY;
  
  if (birdY + birdSize / 2 >= canvasHeight) {
    birdY = canvasHeight - birdSize / 2
    birdVeloY = 0
    playerInControl = false
    // playerInControl = false uncomment when done with game
    return LOST
  }
  
  if (birdY - birdSize / 2 < 0) {
    birdVeloY = 0
    playerInControl = false
    return LOST
  } 
}


/*
                 (pipeX, 0) # (pipeX + pipeWidth, 0)
                            #
                            #
(pipeX, gapStart - pipeGap) # (pipeX + pipeWidth, gapStart - pipeGap)


          (pipeX, gapStart) # (pipeX + pipeWidth, gapStart)
                            #
                            #
      (pipeX, canvasHeight) # (pipeX + pipeWidth, canvasHeight)
*/

function pipeCollision() { // I had an old implementation that worked for most of it, but was throwing some errors. That old version was thanks to https://www.jeffreythompson.org/collision-detection/circle-rect.php but with how mine is set up probably incorrectly implemented. thanks chatgpt for the newer version of collision
  let radius = birdSize / 2;
  
  for (let pipe of pipes) {
    // Check collision with both top and bottom parts of each pipe
    // Calculate the nearest x-coordinate
    let nearestX = Math.max(pipe.x, Math.min(birdX, pipe.x + pipeWidth));
    
    // Check the top segment of the pipe
    let nearestYTop = Math.max(0, Math.min(birdY, pipe.gapStart - pipeGap));
    let distanceTop = Math.sqrt((birdX - nearestX) ** 2 + (birdY - nearestYTop) ** 2);
    if (distanceTop <= radius) {
      return LOST;
    }

    // Check the bottom segment of the pipe
    let nearestYBottom = Math.max(pipe.gapStart, Math.min(birdY, canvasHeight));
    let distanceBottom = Math.sqrt((birdX - nearestX) ** 2 + (birdY - nearestYBottom) ** 2);
    if (distanceBottom <= radius) {
      return LOST;
    }
  }
  return INPROG;  // No collision detected, game continues
}

function displayStart() {
  background(125, 165, 255);
  textAlign(CENTER, CENTER)
  fill(255)
  textSize(40)
  text("Flappy Bird", canvasWidth / 2, canvasHeight / 2 - canvasHeight / 3)
  text("Press space to begin", canvasWidth / 2, canvasHeight / 2)
}

function displayLost() {
  let finalScoreText = "Final Score: " + score
  textAlign(CENTER, CENTER)
  fill(255)
  textSize(32)
  text("You lost!", canvasWidth / 2, canvasHeight / 2 - canvasHeight / 10)
  text(finalScoreText, canvasWidth / 2, canvasHeight / 2)
  text("Press space to restart!", canvasWidth / 2, canvasHeight / 2 + canvasHeight / 10)
  if(keyIsPressed) return true
}

function restartGame() {
  initPipes();
  birdY = 250;
  birdX = 250;
  birdVeloY = -10;
  score = 0;
  playerInControl = true;
}

function drawPipes() {
  for (let i = 0; i < pipes.length; i++) {
    let pipe = pipes[i];
    if(!pipe.passed && birdX > pipe.x + pipeWidth / 2) {
      pipe.passed = true
      score++
    }
    
    if (pipe.x + pipeWidth <= 0) {
      // Reset the pipe to a new position based on the last pipe's position
      let lastPipe = pipes[(i - 1 + pipes.length) % pipes.length];
      pipe.x = lastPipe.x + pipeSpacing;
      pipe.gapStart = floor(random(pipeGap + 25, canvasHeight - 25));
      pipe.passed = false
    } else {
      fill(100, 255, 100);
      rect(pipe.x, pipe.gapStart, pipeWidth, canvasHeight - pipe.gapStart); // Bottom segment
      rect(pipe.x, 0, pipeWidth, pipe.gapStart - pipeGap); // Top segment
    }
  }
}

function pipeLogic() {
  for(let pipe of pipes) {
    pipe.x -= 3 + sqrt(score)
  }
}


function drawScore() {
  textAlign(CENTER, CENTER)
  fill(255)
  textSize(32)
  text(score, canvasWidth / 2, canvasHeight / 2 - canvasHeight / 3)
}

function draw() {
  if(start) {
    displayStart()
  } else {
    background(125, 165, 255);
    if (playerInControl) {
      drawScore();
      drawPipes();
      drawBird();
      pipeLogic();
      if (pipeCollision() === LOST || birdLogic() === LOST) {
        displayLost();
        playerInControl = false;
      }
    } else {
      displayLost();
    }
  }
}
  
