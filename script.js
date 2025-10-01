const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const startBtn = document.getElementById("startBtn");

const tile = 24;
const rows = canvas.height / tile;
const cols = canvas.width / tile;

let score = 0;
let lives = 3;
let gameLoop;

let pacman = { x: 1, y: 1, dx: 1, dy: 0 };

let ghosts = [
  { x: 10, y: 10, color: "red" },
  { x: 12, y: 10, color: "pink" },
  { x: 10, y: 12, color: "cyan" },
  { x: 12, y: 12, color: "orange" }
];

// 0 = kosong, 1 = dinding, 2 = dot
let map = [];
for (let y = 0; y < rows; y++) {
  map[y] = [];
  for (let x = 0; x < cols; x++) {
    if (x === 0 || y === 0 || x === cols - 1 || y === rows - 1 || (x % 4 === 0 && y % 4 === 0)) {
      map[y][x] = 1; // dinding
    } else {
      map[y][x] = 2; // dot
    }
  }
}
map[pacman.y][pacman.x] = 0;

function drawMap() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (map[y][x] === 1) {
        ctx.fillStyle = "#083";
        ctx.fillRect(x * tile, y * tile, tile, tile);
      } else if (map[y][x] === 2) {
        ctx.fillStyle = "#ffd700";
        ctx.beginPath();
        ctx.arc(x * tile + tile / 2, y * tile + tile / 2, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function drawPacman() {
  ctx.fillStyle = "#ffd54a";
  ctx.beginPath();
  ctx.arc(pacman.x * tile + tile / 2, pacman.y * tile + tile / 2, tile / 2 - 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawGhosts() {
  ghosts.forEach(g => {
    ctx.fillStyle = g.color;
    ctx.beginPath();
    ctx.arc(g.x * tile + tile / 2, g.y * tile + tile / 2, tile / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

function movePacman() {
  let nx = pacman.x + pacman.dx;
  let ny = pacman.y + pacman.dy;
  if (map[ny][nx] !== 1) {
    pacman.x = nx;
    pacman.y = ny;
    if (map[ny][nx] === 2) {
      score += 10;
      scoreEl.textContent = score;
      map[ny][nx] = 0;
    }
  }
}

function moveGhosts() {
  ghosts.forEach(g => {
    let dir = Math.floor(Math.random() * 4);
    let dx = [1, -1, 0, 0][dir];
    let dy = [0, 0, 1, -1][dir];
    let nx = g.x + dx;
    let ny = g.y + dy;
    if (map[ny] && map[ny][nx] !== 1) {
      g.x = nx;
      g.y = ny;
    }
    if (g.x === pacman.x && g.y === pacman.y) {
      lives--;
      livesEl.textContent = lives;
      resetPositions();
      if (lives <= 0) {
        clearInterval(gameLoop);
        alert("Game Over! Skor: " + score);
      }
    }
  });
}

function resetPositions() {
  pacman = { x: 1, y: 1, dx: 1, dy: 0 };
  ghosts = [
    { x: 10, y: 10, color: "red" },
    { x: 12, y: 10, color: "pink" },
    { x: 10, y: 12, color: "cyan" },
    { x: 12, y: 12, color: "orange" }
  ];
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  movePacman();
  moveGhosts();
  drawPacman();
  drawGhosts();
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" || e.key === "w") { pacman.dx = 0; pacman.dy = -1; }
  if (e.key === "ArrowDown" || e.key === "s") { pacman.dx = 0; pacman.dy = 1; }
  if (e.key === "ArrowLeft" || e.key === "a") { pacman.dx = -1; pacman.dy = 0; }
  if (e.key === "ArrowRight" || e.key === "d") { pacman.dx = 1; pacman.dy = 0; }
});

startBtn.addEventListener("click", () => {
  score = 0; lives = 3;
  scoreEl.textContent = score;
  livesEl.textContent = lives;
  resetPositions();
  clearInterval(gameLoop);
  gameLoop = setInterval(update, 200);
});
