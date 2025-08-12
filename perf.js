const boxes = document.querySelectorAll(".box");
const newGameBtn = document.getElementById("new-game");
const clearScoreBtn = document.getElementById("clear-score");
const modehumanVsHuman = document.getElementById("human-vs-human");
const modeVsComputer = document.getElementById("vs-computer");

const currentWinner = document.querySelector(".player-winnerX");
const scoreX = document.getElementById("score-x");
const scoreO = document.getElementById("score-o");
const scoreDraw = document.getElementById("score-draw");

// default player1: X, Player2: O
let player = true; // True: X, False: O
let isVsComputer = false; // Cờ bật chế độ AI
let gameOver = false;

const winnerPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Chọn chế độ chơi: người vs người
modehumanVsHuman.addEventListener("click", () => {
  isVsComputer = false;
  modehumanVsHuman.classList.add("active");
  modeVsComputer.classList.remove("active");
  resetGame();
});

// Chọn chế độ chơi: người vs máy
modeVsComputer.addEventListener("click", () => {
  isVsComputer = true;
  modeVsComputer.classList.add("active");
  modehumanVsHuman.classList.remove("active");
  resetGame();
});

// Xử lý click ô
boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (gameOver || box.innerText !== "") return;

    if (player) {
      // Người chơi luôn là X
      box.innerText = "X";
      box.disabled = true;
      player = false;
      checkWinnerOrDraw();

      if (isVsComputer && !gameOver) {
        setTimeout(() => {
          aiRandomMove();
          player = true;
          checkWinnerOrDraw();
        }, 500); // Delay để cảm giác máy "nghĩ"
      }
    } else if (!isVsComputer) {
      // Chế độ người vs người, O cũng đánh bình thường
      box.innerText = "O";
      box.disabled = true;
      player = true;
      checkWinnerOrDraw();
    }
  });
});

function checkWinnerOrDraw() {
  if (checkWinner()) {
    gameOver = true;
    return true;
  }
  if (checkDraw()) {
    gameOver = true;
    return true;
  }
  return false;
}

const resetGame = () => {
  player = true;
  gameOver = false;
  boxes.forEach((box) => {
    box.innerText = "";
    box.disabled = false;
    box.classList.remove("pattern-winner");
  });
  currentWinner.innerText = "";
};

newGameBtn.addEventListener("click", resetGame);

const checkWinner = () => {
  for (let pattern of winnerPatterns) {
    let [a, b, c] = pattern;
    let pos1 = boxes[a].innerText;
    let pos2 = boxes[b].innerText;
    let pos3 = boxes[c].innerText;

    if (pos1 !== "" && pos1 === pos2 && pos2 === pos3) {
      boxes[a].classList.add("pattern-winner");
      boxes[b].classList.add("pattern-winner");
      boxes[c].classList.add("pattern-winner");

      showWinner(pos1);
      return true;
    }
  }
  return false;
};

const checkDraw = () => {
  const allFilled = [...boxes].every((box) => box.innerText !== "");
  if (allFilled && !winnerFound()) {
    currentWinner.innerText = "Draw";
    scoreDraw.innerText = parseInt(scoreDraw.innerText) + 1;
    localStorage.setItem("Draw", scoreDraw.innerText);
    disabledBtn();
    return true;
  }
  return false;
};

const winnerFound = () => {
  return [...boxes].some((box) => box.classList.contains("pattern-winner"));
};

const showWinner = (winner) => {
  currentWinner.innerText = winner;
  if (winner === "X") {
    scoreX.innerText = parseInt(scoreX.innerText) + 1;
    localStorage.setItem("Player1", scoreX.innerText);
  } else if (winner === "O") {
    scoreO.innerText = parseInt(scoreO.innerText) + 1;
    localStorage.setItem("Player2", scoreO.innerText);
  }
  disabledBtn();
};

const disabledBtn = () => {
  boxes.forEach((btn) => (btn.disabled = true));
};

const enableBtn = () => {
  boxes.forEach((btn) => (btn.disabled = false));
};

// AI chơi random: chọn ngẫu nhiên ô trống
function aiRandomMove() {
  const emptyBoxes = [...boxes].filter((box) => box.innerText === "");
  if (emptyBoxes.length === 0) return;

  const randomIndex = Math.floor(Math.random() * emptyBoxes.length);
  const chosenBox = emptyBoxes[randomIndex];
  chosenBox.innerText = "O";
  chosenBox.disabled = true;
}

// Lưu điểm vào LocalStorage
const saveScores = () => {
  localStorage.setItem("Player1", scoreX.innerText);
  localStorage.setItem("Player2", scoreO.innerText);
  localStorage.setItem("Draw", scoreDraw.innerText);
};

// Xóa điểm
const removeScore = () => {
  localStorage.removeItem("Player1");
  localStorage.removeItem("Player2");
  localStorage.removeItem("Draw");
  scoreX.innerText = "0";
  scoreO.innerText = "0";
  scoreDraw.innerText = "0";
};

clearScoreBtn.addEventListener("click", removeScore);

// Load điểm khi bắt đầu
const loadScore = () => {
  scoreX.innerText = localStorage.getItem("Player1") || "0";
  scoreO.innerText = localStorage.getItem("Player2") || "0";
  scoreDraw.innerText = localStorage.getItem("Draw") || "0";
};

loadScore();
