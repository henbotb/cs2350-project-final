import "bootstrap"
let buttonsDiv = document.getElementById("buttons")
let featured = document.getElementById("featured")

let buttons = [
    {
        buttonText: "Tetris",
        buttonDesc: "Simple implementation of tetris, with all the features of the classic."
    },
    {
        buttonText: "Wave Function Collapse Tile Editor",
        buttonDesc: `A page that allows you to create your own WFC tiles and define connections, or import tile sets. <a href="https://youtu.be/2SuvO4Gi7uY?si=ECQt3seJ1Yau9PcH">Click here</a> to learn about the wave function collapse algorithm.`
    },
    {
        buttonText: "Tic Tac Toe",
        buttonDesc: "Simple implementation of tic tac toe, with different difficulties, such as impossible which will be implemented via the minimax algorithm with alpha-beta pruning."
    },
    {
        buttonText: "Minesweeper",
        buttonDesc: "Simple implementation of minesweeper, with guarantees for solvable boards."
    },
    {
        buttonText: "Bug fixes and dynamic games",
        buttonDesc: "The ability to change any of the currently existing games features (think ball size, bird size, paddle size, amount of apples, canvas size, colors, etc. alongside fixing some persisting bugs."
    }
]

function loadButtons() {
    let buttonsHtml = ``
    for(let i = 0; i < buttons.length; i++) {
        buttonsHtml += `<button class="btn btn-primary my-2" id="button-${i}">${buttons[i].buttonText}</button>`
    }

    buttonsDiv.innerHTML = buttonsHtml

    buttons.forEach((button, index) => {
        document.getElementById(`button-${index}`).addEventListener('click', () => {
            updateFeatured(button.buttonText, button.buttonDesc)
        })
    })
}


function updateFeatured(title, description) {
    featured.innerHTML = `<h1 class="text-center">${title}</h1>
    <p class="fs-4 ">${description}</p>`
}

document.addEventListener('DOMContentLoaded', () => {
    loadButtons()
    updateFeatured(buttons[0].buttonText, buttons[0].buttonDesc);
})