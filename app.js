const boxes = document.querySelectorAll(".box");
const newGameBtn = document.getElementById("new-game");
const clearScoreBtn = document.getElementById("clear-score");
const modehumanVsHuman = document.getElementById("human-vs-human");
const modeVsComputer = document.getElementById("vs-computer");

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

// Gán sự kiện click cho các ô
boxes.forEach((box) => {
  box.addEventListener("click", (e) => {
    // console.log("Box clicked:", e.target);
    if (player) {
      box.innerText = "X";
      player = false;
    } else {
      box.innerText = "O";
      player = true;
    }
    box.disabled = true; // Vô hiệu hóa ô đã click

    // Gọi hàm kiểm tra người chiến thắng
    checkWinner();
    checkDraw();
  });
});

// Bắt đâu game mới
const resetGame = () => {
  player = true; // Reset về người chơi X

  // Xóa hết nội dung các ô
  boxes.forEach((box) => {
    box.innerText = "";
    box.disabled = false; // Mở khóa ô để chơi lại
    box.classList.remove("pattern-winner"); // Xóa hiệu ứng thắng
  });

  // Xóa thông báo người thắng
  const currentWinner = document.querySelector(".player-winnerX");
  currentWinner.innerText = "";

  // Nếu muốn reset điểm thì xử lý ở đây (nếu không thì giữ nguyên)
};

newGameBtn.addEventListener("click", resetGame);

// kiểm tra người chiến thắng
const checkWinner = () => {
  for (let pattern of winnerPatterns) {
    let [a, b, c] = pattern;
    let pos1 = boxes[a].innerText;
    let pos2 = boxes[b].innerText;
    let pos3 = boxes[c].innerText;

    if (pos1 !== "" && pos1 === pos2 && pos2 === pos3) {
      // console.log(pos1, pos2, pos3);
      // console.log(pattern);

      // Đánh dấu ô chiến thắng
      boxes[a].classList.add("pattern-winner");
      boxes[b].classList.add("pattern-winner");
      boxes[c].classList.add("pattern-winner");

      // Hiển thị người thắng
      showWinner(pos1);

      return; // thoát khỏi hàm khi đã tìm ra người thắng
    }
  }
};

const checkDraw = () => {
  // Kiểm tra tất cả ô đã được đánh (không còn ô trống)
  const allFilled = [...boxes].every((box) => box.innerText !== "");

  if (allFilled) {
    // Nếu đã đầy ô và chưa ai thắng thì là hòa
    const draw = document.getElementById("score-draw");
    const currentWinner = document.querySelector(".player-winnerX");

    currentWinner.innerText = "Draw";
    draw.innerText = parseInt(draw.innerText) + 1;
    localStorage.setItem("Draw", draw.innerText);

    // Vô hiệu hóa các ô để kết thúc game
    disabledBtn();
  }
};

// Hien thi nguoi chien thang
const showWinner = (winner) => {
  const currentWinner = document.querySelector(".player-winnerX");
  const scoreX = document.getElementById("score-x");
  const scoreO = document.getElementById("score-o");

  currentWinner.innerText = winner;

  if (winner === "X") {
    scoreX.innerText = parseInt(scoreX.innerText) + 1;
    localStorage.setItem("Player1", scoreX.innerText);
  } else if (winner === "O") {
    scoreO.innerText = parseInt(scoreO.innerText) + 1;
    localStorage.setItem("Player2", scoreO.innerText);
  }

  // Vô hiệu hóa các ô còn lại để kết thúc game
  disabledBtn();
};

const disabledBtn = () => {
  for (let btn of boxes) {
    btn.disabled = true;
  }
};
