function detectAdjacentValue(targetValue, cx, cy, grid) {
    let directions = ( // x, y
        [0, -1],   // up
        [-1, 1],   // up right
        [1, 0],    // right
        [1, 1],    // down right
        [0, 1],    // down
        [1, -1],   // down left
        [-1, 0],   // left
        [-1, -1]); // up left


    let gridH = grid.length;
    let gridW = grid[0].length;
    let relativeEqualValues = [];

    directions.forEach((direction) => {
        let dx = direction[0];
        let dy = direction[1];
        if((dy + cy > gridH - 1) || (dy + cy < 0) || (dx + dy > gridW - 1) || (dx + cx < 0)) { // if oob do nothing

        } else if(grid[dy + cy][dx + cx] === targetValue) relativeEqualValues.append(direction); // add if target value found
    })

    if(relativeEqualValues.length === 0) return 0; // no value found
    return relativeEqualValues;
}

function solveMinesweeper(grid) {
    if(!grid) throw Error("Insufficient grid passed");

    let gridH = grid.length
    let gridW = grid[0].length

    const flag = -3; // player has flagged tile
    const mine = -2; // mine in current location
    const empty_tile = -1; // 0 adjacent mines, and shown
    const covered_tile = 0; // yet to be clicked

    grid.forEach((row, y) => {row.forEach((element, x) => { 
        if(element === empty_tile) { // test on empty grids
            let adjacentOneTiles = detectAdjacentValue(1, x, y, grid);

            if(adjacentOneTiles === 0) {

            } else {
                return 
            }
        }
    })})
    
}