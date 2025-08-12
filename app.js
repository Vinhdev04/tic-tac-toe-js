const boxes = document.querySelectorAll(".box");
const newGameBtn = document.getElementById("new-game");
const clearScoreBtn = document.getElementById("clear-score");
const modehumanVsHuman = document.getElementById("human-vs-human");
const modeVsComputer = document.getElementById("vs-computer");

const currentWinner = document.querySelector(".player-winnerX");
const scoreX = document.getElementById("score-x");
const scoreO = document.getElementById("score-o");
const scoreDraw = document.getElementById("score-draw"); // Đổi draw thành scoreDraw để đồng bộ

// default player1: X, Player2: O
let player = true; // True: X, False: O
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

// Sự kiện click cho các ô
boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (player) {
      box.innerText = "X";
      player = false;
    } else {
      box.innerText = "O";
      player = true;
    }
    box.disabled = true;

    checkWinner();
    checkDraw();
  });
});

// Reset game (không reset điểm)
const resetGame = () => {
  player = true;
  boxes.forEach((box) => {
    box.innerText = "";
    box.disabled = false;
    box.classList.remove("pattern-winner");
  });
  currentWinner.innerText = "";
};

newGameBtn.addEventListener("click", resetGame);

// Kiểm tra thắng
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
      return;
    }
  }
};

// Kiểm tra hòa
const checkDraw = () => {
  // kiểm tra xem tất cả các ô đã được điền chưa
  const allFilled = [...boxes].every((box) => box.innerText !== "");
  if (allFilled && !winnerFound()) {
    currentWinner.innerText = "Draw";
    scoreDraw.innerText = parseInt(scoreDraw.innerText) + 1;
    localStorage.setItem("Draw", scoreDraw.innerText);
    disabledBtn();
  }
};

// Hàm phụ kiểm tra có người thắng chưa
const winnerFound = () => {
  // k
  return [...boxes].some((box) => box.classList.contains("pattern-winner"));
};

// Hiển thị người thắng
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

// Vô hiệu hóa toàn bộ ô
const disabledBtn = () => {
  boxes.forEach((btn) => (btn.disabled = true));
};

// Bật lại toàn bộ ô
const enableBtn = () => {
  boxes.forEach((btn) => (btn.disabled = false));
};

// Chế độ chơi với máy (sẽ viết sau)
const playVsComputer = () => {};

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

// Load điểm khi bắt đầu
const loadScore = () => {
  scoreX.innerText = localStorage.getItem("Player1") || "0";
  scoreO.innerText = localStorage.getItem("Player2") || "0";
  scoreDraw.innerText = localStorage.getItem("Draw") || "0";
};

// Xử lý reest điểm
clearScoreBtn.addEventListener("click", removeScore);

loadScore();
