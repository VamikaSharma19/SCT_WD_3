const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset");
const playerModeBtn = document.getElementById("playerMode");
const computerModeBtn = document.getElementById("computerMode");

let currentPlayer = "X";
let gameActive = false;
let gameState = ["", "", "", "", "", "", "", "", ""];
let vsComputer = false;

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

playerModeBtn.addEventListener("click", () => {
  vsComputer = false;
  startGame("Player vs Player");
});

computerModeBtn.addEventListener("click", () => {
  vsComputer = true;
  startGame("Player vs Computer");
});

resetBtn.addEventListener("click", () => {
  startGame(vsComputer ? "Player vs Computer" : "Player vs Player");
});

function startGame(mode) {
  gameActive = true;
  gameState = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("winner", "x", "o");
  });
  statusText.textContent = `${mode} - Player ${currentPlayer}'s Turn`;
}

cells.forEach(cell => {
  cell.addEventListener("click", (event) => {
    const index = event.target.getAttribute("data-index");
    if (gameState[index] !== "" || !gameActive) return;
    gameState[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    event.target.classList.add(currentPlayer.toLowerCase());
    if (checkWinner()) return;
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
    if (vsComputer && currentPlayer === "O" && gameActive) {
      setTimeout(computerMove, 400);
    }
  });
});

function checkWinner() {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      cells[a].classList.add("winner");
      cells[b].classList.add("winner");
      cells[c].classList.add("winner");
      statusText.textContent = `🎉 Player ${currentPlayer} Wins!`;
      gameActive = false;
      return true;
    }
  }
  if (!gameState.includes("")) {
    statusText.textContent = "😮 It's a Draw!";
    gameActive = false;
    return true;
  }
  return false;
}

function computerMove() {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (gameState[a] === "O" && gameState[b] === "O" && gameState[c] === "") return makeMove(c);
    if (gameState[a] === "O" && gameState[c] === "O" && gameState[b] === "") return makeMove(b);
    if (gameState[b] === "O" && gameState[c] === "O" && gameState[a] === "") return makeMove(a);
  }
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (gameState[a] === "X" && gameState[b] === "X" && gameState[c] === "") return makeMove(c);
    if (gameState[a] === "X" && gameState[c] === "X" && gameState[b] === "") return makeMove(b);
    if (gameState[b] === "X" && gameState[c] === "X" && gameState[a] === "") return makeMove(a);
  }
  if (gameState[4] === "") return makeMove(4);
  const corners = [0, 2, 6, 8];
  for (let corner of corners) {
    if (gameState[corner] === "") return makeMove(corner);
  }
  const sides = [1, 3, 5, 7];
  for (let side of sides) {
    if (gameState[side] === "") return makeMove(side);
  }
}

function makeMove(index) {
  gameState[index] = "O";
  cells[index].textContent = "O";
  cells[index].classList.add("o");
  if (checkWinner()) return;
  currentPlayer = "X";
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
}