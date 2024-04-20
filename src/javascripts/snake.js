let scHeight = 500; // sc prefix means screen
let scWidth = 500;

let gRows = 9; // y,  g prefix means grid
let gCols = 9; // x

let tHeight = Math.floor(scHeight / gRows); // t prefix means tile
let tWidth = Math.floor(scWidth / gCols);

let sLength = 1; // s prefix means snake
let sDirection = [0, 0];

let firstMoveMade = false;

let grid = new Array(gRows); // init grid
for(let i = 0; i < gRows; i++) {
    grid[i] = new Array(gCols).fill(0);
}

let drawGame = true;

const apple = -1;
let gameState = 0;

grid[Math.floor(gCols / 2)][Math.floor(gRows / 2)] = apple; // -1 represents an apple, place starting apple
grid[Math.floor(gCols / 2) + 2][Math.floor(gRows / 2)] = sLength; // place snake head at center tile

// c + any of the previous prefixes means current

function reset() {
    sLength = 1;
    firstMoveMade = false;
    gameState = 0;
    sDirection = [0, 0];
    grid = grid.map(() => new Array(gCols).fill(0));
    grid[Math.floor(gCols / 2) - 2][Math.floor(gRows / 2)] = apple;
    grid[Math.floor(gCols / 2)][Math.floor(gRows / 2)] = sLength;
}


function compareArrays(a1, a2) {
    if(a1.length != a2.length) {
        return false;
    }

    for(let i = 0; i < a1.length; i++) {
        if(a1[i] !== a2[i]) {
            return false;
        }
    }

    return true;
}

function negArray(a1) { // flip the signs of all elements of an array
    return a1.map(element => -element);
}

function getHeadLocation() {
    for(let y = 0; y < gRows; y++) {
        for(let x = 0; x < gCols; x++) {
            if(grid[y][x] == sLength) { // if is snake length, return vector of locations
                return [x, y]; 
            }
        }
    }
    return null;
}

function drawBoard() { 
    for (let y = 0; y < gRows; y++) {
        for (let x = 0; x < gCols; x++) {
            let ctValue = grid[y][x]; // current tile value
            if (ctValue === apple) {
                fill('#B64B2B'); // apple color
            } else if (ctValue === 0) {
                if ((x + y) % 2 === 0) {
                    fill('#DED8FD'); // empty tile color 1
                } else {
                    fill('#CFC5FC'); // empty tile color 2
                }
            } else if (ctValue > 0) {
                // Color the snake based on whether the segment number is odd or even
                if (ctValue % 2 === 1) {
                    fill('#04A777'); // color for odd segments
                } else {
                    fill('#093A3E'); // color for even segments
                }
            }
            rect(x * tWidth, y * tHeight, tWidth, tHeight); // Draw the tile
        }
    }
}


function generateApple() {
    // Check if the grid is full (snake occupies all but one space)
    if (sLength > gRows * gCols) {
      return 1; // Indicate game over (grid full)
    }
  
    while (true) {
      // Generate random coordinates for the apple
      const appleX = Math.floor(random(0, gCols)); // Floor the value for array access
      const appleY = Math.floor(random(0, gRows)); // Floor the value for array acces
  
      // Check if the space is empty and place the apple if so
      if (grid[appleY][appleX] === 0) {
        grid[appleY][appleX] = apple;
        return 0; // Indicate successful placement
      }
    }
  }
  

/*
keyPressed return codes
11: snake up
12: snake right
13: snake down
14: snake left

21: game failed -> restart
22: mid game -> restart 

-1: default <- movesnake
-2: default <- testForCondition

0: nothing
*/

function keyPressed() {
    if (gameState !== 0) { // Game is not in the initial playable state
        reset();
        gameState = 0;
        loop();
        return;
    } else {
        // Update sDirection based on the key pressed to control the snake's movement
        switch (keyCode) {
            case UP_ARROW:
            case 87: // 'W' key
                if (sDirection[1] !== 1) {
                    sDirection = [0, -1];
                    firstMoveMade = true; // Player has made the first move
                }
                break;
            case DOWN_ARROW:
            case 83: // 'S' key
                if (sDirection[1] !== -1) {
                    sDirection = [0, 1];
                    firstMoveMade = true; // Player has made the first move
                }
                break;
            case RIGHT_ARROW:
            case 68: // 'D' key
                if (sDirection[0] !== -1) {
                    sDirection = [1, 0];
                    firstMoveMade = true; // Player has made the first move
                }
                break;
            case LEFT_ARROW:
            case 65: // 'A' key
                if (sDirection[0] !== 1) {
                    sDirection = [-1, 0];
                    firstMoveMade = true; // Player has made the first move
                }
                break;
        }
    }
}



/*
updateGameState return codes

11: snake ran into wall or self

1: game won
0: return as normal

error codes:
-1: direction <- default
*/

function updateGameState() {
    if(!firstMoveMade) return 0;

    let sHeadCoords = getHeadLocation(); // Unpack snake's head coordinates
    if (!sHeadCoords) {
        console.log("Snake head not found.");
        return 11; // Game over if no head is found, should not happen.
    }
    
    let sHeadX = sHeadCoords[0];
    let sHeadY = sHeadCoords[1];

    // Use the global sDirection to determine the snake's next move
    let sNewX = sDirection[0] + sHeadX;
    let sNewY = sDirection[1] + sHeadY;

    // Check if the new position is out of bounds
    if (sNewX >= gCols || sNewY >= gRows || sNewX < 0 || sNewY < 0) {
        console.log(`Snake hit the wall at new x: ${sNewX}, new y: ${sNewY}`);
        return 11; // Game over condition
    }

    // Check if the snake runs into itself
    if (grid[sNewY][sNewX] > 0) {
        console.log(`Snake ran into itself at new x: ${sNewX}, new y: ${sNewY}`);
        return 11; // Game over condition
    }

    // Snake eats the apple
    if (grid[sNewY][sNewX] === apple) { 
        sLength++;
        grid[sNewY][sNewX] = sLength; // Increase snake length
        return generateApple(); // Generate a new apple
    } else { // Normal movement
        // Move snake forward
        grid[sNewY][sNewX] = sLength + 1; 
        // Decrease the value of snake parts to simulate movement
        for (let y = 0; y < gRows; y++) {
            for (let x = 0; x < gCols; x++) {
                if (grid[y][x] > 0) grid[y][x]--;
            }
        }
    }
    return 0; // Normal game state
}

function displayLostScreen() {
    noLoop();  // Stop the draw loop
    let scoreText = `Final Score: ${sLength - 1}`
    gameState = 21;
    filter(BLUR, 5);
    fill(255);
    textSize(35);
    textAlign(CENTER, CENTER);
    text("You lost!", scWidth / 2, scHeight / 2);
    text(scoreText, scWidth / 2, scHeight / 2 - scHeight / 10);
    textSize(22);
    text("Press any key to restart.", scWidth / 2, scHeight / 2 + 75);
}

function displayWinScreen() {
    // Similar to displayLostScreen but for winning scenario
    filter(BLUR, 5);
    fill(0);
    textSize(35);
    textAlign(CENTER, CENTER);
    text("You won!", scWidth / 2, scHeight / 2);
    // Additional text or actions for the win screen
}

function setup() {
    let cnv = createCanvas(scWidth, scHeight);
    noStroke();
    frameRate(8); // determine game framerate

    cnv.parent('canvas-container')
} 

function draw() {
    if(!drawGame) return;
    gameState = updateGameState(sDirection);
    
    if (gameState !== 11 && gameState !== 1) {
        drawBoard();
    } else if (gameState === 1) {
        displayWinScreen();  // Display a win screen instead of logging to console
    } else {
        displayLostScreen();
    }
}



/* once this is done and working -> 
p5js project that allows the user to make one of those like ninja roller type games but
make it interactive so you can choose where the blocks that block the path go, think TOTM
*/