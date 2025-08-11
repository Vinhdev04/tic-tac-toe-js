const boxes = document.querySelectorAll(".box");
const newGameBtn = document.getElementById("new-game");
const clearScoreBtn = document.getElementById("clear-score");
const modehumanVsHuman = document.getElementById("human-vs-human");
const modeVsComputer = document.getElementById("vs-computer");

let isPlayerXTurn = true; // true = X, false = O
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

// Cache các phần tử DOM liên quan điểm số và hiển thị
const currentWinner = document.querySelector(".player-winnerX");
const scoreX = document.getElementById("score-x");
const scoreO = document.getElementById("score-o");
const scoreDraw = document.getElementById("score-draw");

// Hàm load điểm từ localStorage lúc khởi tạo
const loadScores = () => {
  scoreX.innerText = localStorage.getItem("Player1") || "0";
  scoreO.innerText = localStorage.getItem("Player2") || "0";
  scoreDraw.innerText = localStorage.getItem("Draw") || "0";
};

// Hàm vô hiệu hóa tất cả ô
const disableAllBoxes = () => {
  boxes.forEach((box) => (box.disabled = true));
};

// Hàm reset game
const resetGame = () => {
  isPlayerXTurn = true;
  gameOver = false;
  boxes.forEach((box) => {
    box.innerText = "";
    box.disabled = false;
    box.classList.remove("pattern-winner");
  });
  currentWinner.innerText = "";
};

// Hàm xử lý khi có người thắng
const showWinner = (winner) => {
  currentWinner.innerText = winner;
  gameOver = true;

  if (winner === "X") {
    scoreX.innerText = parseInt(scoreX.innerText) + 1;
    localStorage.setItem("Player1", scoreX.innerText);
  } else if (winner === "O") {
    scoreO.innerText = parseInt(scoreO.innerText) + 1;
    localStorage.setItem("Player2", scoreO.innerText);
  }

  disableAllBoxes();
};

// Kiểm tra người thắng
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

// Kiểm tra hòa
const checkDraw = () => {
  if (gameOver) return false;
  const allFilled = [...boxes].every((box) => box.innerText !== "");
  if (allFilled) {
    currentWinner.innerText = "Draw";
    scoreDraw.innerText = parseInt(scoreDraw.innerText) + 1;
    localStorage.setItem("Draw", scoreDraw.innerText);
    gameOver = true;
    disableAllBoxes();
    return true;
  }
  return false;
};

// Xử lý click từng ô
boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (gameOver || box.innerText !== "") return;

    box.innerText = isPlayerXTurn ? "X" : "O";
    box.disabled = true;

    if (!checkWinner()) {
      checkDraw();
      isPlayerXTurn = !isPlayerXTurn;
    }
  });
});

// Xử lý nút new game
newGameBtn.addEventListener("click", resetGame);

// Xử lý nút clear điểm
clearScoreBtn.addEventListener("click", () => {
  localStorage.removeItem("Player1");
  localStorage.removeItem("Player2");
  localStorage.removeItem("Draw");
  scoreX.innerText = "0";
  scoreO.innerText = "0";
  scoreDraw.innerText = "0";
});

// Load điểm lúc bắt đầu
loadScores();
