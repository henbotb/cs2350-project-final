let gridActual = []; // the "final" values of the grid,
let gridVisible = []; // the visible values of the grid to the player


// "magic number" declaration
const flag = -3; // player has flagged tile
const mine = -2; // mine in current location
const empty_tile = -1; // 0 adjacent mines, and shown
const covered_tile = 0; // yet to be clicked
// mine tiles 1-8 will just be recognized as such.

const gridW = 12; // eventually make a call to a function like getGridW/getGridH to extract from somewhere in the website;
const gridH = 12;



function initalizeGrid() {
    for(let i = 0; i < gridW; i++) { // initialize grid(s) to be 2d
        gridActual[i] = [];
        gridVisible[i] = [];
        for(let j = 0; j < gridH; j++) {
            gridActual[i][j] = 0;
            gridVisible[i][j] = 0;
        }
    }
}




function setup() {
    createCanvas(576, 576);
    background(220);
}

function draw() {
    background(255, 0, 0)
}