let currentPlayer = 'X';
let gameMode = 'human'; // 'human' or 'bot'
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const cells = document.querySelectorAll('.cell');
const turnDisplay = document.querySelector('.turn-display');
const newGameButton = document.querySelector('.new-game-button');
const resultMessage = document.querySelector('.result-message');
const modeRadios = document.querySelectorAll('input[name="mode"]');
const themeToggle = document.getElementById('theme-toggle');
const container = document.querySelector('.container');

function checkWin() {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function highlightWinningLine(winner) {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c] && board[a] === winner) {
            document.querySelector(`.cell[data-index="${a}"]`).classList.add('winning-line');
            document.querySelector(`.cell[data-index="${b}"]`).classList.add('winning-line');
            document.querySelector(`.cell[data-index="${c}"]`).classList.add('winning-line');
        }
    }
}

function checkDraw() {
  return board.every((cell) => cell !== '');
}

function updateTurnDisplay() {
  turnDisplay.textContent = `Player ${currentPlayer}'s turn`;
}

function handleResult(winner) {
  gameActive = false;
  if (winner) {
    resultMessage.textContent = `Player ${winner} wins!`;
    highlightWinningLine(winner);
  } else {
    resultMessage.textContent = "It's a draw!";
  }
}

function handleCellClick(index) {
  if (!gameActive || board[index] !== '') return;

  board[index] = currentPlayer;
  cells[index].textContent = currentPlayer;
  cells[index].classList.add(currentPlayer.toLowerCase());

  const winner = checkWin();
  if (winner) {
    handleResult(winner);
    return;
  }

  if (checkDraw()) {
    handleResult(null);
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateTurnDisplay();

  if (gameMode === 'bot' && currentPlayer === 'O') {
    makeBotMove();
  }
}

function makeBotMove() {
  if (!gameActive) return;

  let bestMove = findBestMove();
  handleCellClick(bestMove);
}

function findBestMove() {
  // Very simple AI:  First, try to win.  Second, try to block.  Third, pick a random available cell.
  // 1. Check if AI can win in the next move
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = 'O';
      if (checkWin() === 'O') {
        board[i] = ''; // Reset for next check
        return i;
      }
      board[i] = ''; // Reset
    }
  }

  // 2. Check if player can win in the next move and block
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = 'X';
      if (checkWin() === 'X') {
        board[i] = '';
        return i;
      }
      board[i] = '';
    }
  }

  // 3. Choose a random available cell
  let availableMoves = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      availableMoves.push(i);
    }
  }
  if (availableMoves.length > 0) {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = 'X';
  updateTurnDisplay();
  resultMessage.textContent = '';
  cells.forEach((cell) => {
    cell.textContent = '';
    cell.classList.remove('x', 'o', 'winning-line');
  });

  if (gameMode === 'bot' && currentPlayer === 'O') {
    makeBotMove();
  }
}

// Theme Toggle Logic
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// Initialize Theme
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);
container.style.display = 'block'; // Prevent theme flash

themeToggle.addEventListener('click', toggleTheme);

cells.forEach((cell, index) => {
  cell.addEventListener('click', () => handleCellClick(index));
});

newGameButton.addEventListener('click', resetGame);

modeRadios.forEach(radio => {
  radio.addEventListener('change', (event) => {
    gameMode = event.target.value;
    resetGame();
  });
});

updateTurnDisplay();
