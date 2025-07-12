const rows = 8;
const cols = 8;
const totalBombs = 10;
let board =[];
let bombPositions = new Set();

const boardElement = document.getElementById("board");
const messageElement = document.getElementById("message");
const resetButton = document.getElementById("resetButton");

function initGame() {
    board = []
    bombPositions.clear();
    boardElement.innerHTML = "";
    messageElement.style.display = "none";

    while (bombPositions.size < totalBombs) {
        let randomIndex = Math.floor(Math.random() * rows * cols);
        bombPositions.add(randomIndex);
    }

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = i;
            cell.dataset.col = j;

            cell.addEventListener('click' , () => revealCell(i, j));
            cell.addEventListener('contextmenu', (event) => placeFlag(event, i, j)); //adicionado clique com o botão direito

            boardElement.appendChild(cell);
            board[i][j] = cell;
        }
    }
}

//Funcão para colocar ou remover bandeira
function placeFlag(event, row, col) {
    event.preventDefault(); // Previne o menu padrão do clique direito

    let cell = board[row][col];

    if (cell.classList.contains("revealed")) return; // Não pode colocar a bandeira em células já reveladas
    
    if (cell.innerText === "🚩") {
        cell.innerText = ""; //Remove a bandeira
    }   else {
        cell.innerText = "🚩"; // Coloca a bandeira
    }    
}

// Revelar célula ao clicar
function revealCell(row, col) {
    let index = row * cols + col;
    let cell = board[row][col];

    if (cell.classList.contains("revealed") || cell.innerText === "🚩") return; // Evita revelar células já abertas ou com bandeira

    if (bombPositions.has(index)) {
        cell.classList.add("bomb");
        cell.innerText = "💣";
        gameOver(false);
        return;        
    }

    let adjacentBombs = countAdjacentBombs (row, col);
    cell.classList.add("revealed");

if (adjacentBombs > 0) {
    cell.dataset.value = adjacentBombs;
    cell.innerText = adjacentBombs;
    } else {
        revealAdjacentCells(row, col);
        }

        checkWin();
    }

    // Contar bombas ao redor
    function countAdjacentBombs(row, col) {
        let count = 0;
        let directions =[
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],            [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        for (let [dx, dy] of directions) {
            let newRow = row + dx;
            let newCol = col + dy;
            let index = newRow * cols + newCol;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && bombPositions.has(index)) {
                count++;
            }
        }

        return count;
    }

    // Revelar células vizinhas
    function revealAdjacentCells(row, col) {
        let directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        for (let [dx, dy] of directions) {
            let newRow = row + dx;
            let newCol = col + dy;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                revealCell(newRow, newCol);

            }
        }
    }

    // Verificar vitória
    function checkWin() {
        let revealedCells = document.querySelectorAll(".cell.revealed") .length;
        if (revealedCells === rows * cols - totalBombs) {
            gameOver(true);
        }
    }

    // finalizar jogo
    function gameOver(win) {
        messageElement.style.display = "block";
        if (win) {
            messageElement.innerText = "Você Venceu!!";
            messageElement.classList.add("win");
       } else {
            messageElement.innerText = "Game Over!";
            messageElement.classList.add("loss");

            bombPositions.forEach(index => {
                let row = Math.floor(index / cols);
                let col = index % cols;
                let cell = board[row][col];
                cell.classList.add("bomb");
                cell.innerText = "💣";
            });
       }

       document.querySelectorAll(".cell").forEach(cell => {
        cell.replaceWith(cell.cloneNode(true));
       });
        }

        // Resetar jogo
        resetButton.addEventListener("click", initGame);

        initGame();