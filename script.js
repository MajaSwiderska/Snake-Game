const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const grid = 32;
let count = 0;
const FRAME_SKIP = 4;

let snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4
};

let raspberry = {
    x: 320,
    y: 320
};

let score = 0;
let gameRunning = true;

const raspberryImg = new Image();
raspberryImg.src = "https://image2url.com/r2/default/images/1772808943078-7535a717-d223-43a6-8fd1-af3f29940db6.jpg";

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function resetGame() {
    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;

    raspberry.x = getRandomInt(0, 20) * grid;
    raspberry.y = getRandomInt(0, 20) * grid;

    score = 0;
    gameRunning = true;
    document.getElementById("restartBox").style.display = "none";
}

window.restartGame = function() {
    resetGame();
};

CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r);
    this.lineTo(x, y + r);
    this.quadraticCurveTo(x, y, x + r, y);
    this.closePath();
    return this;
};

function loop() {
    requestAnimationFrame(loop);

    if (!gameRunning) return;

    if (++count < FRAME_SKIP) return;
    count = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
        gameRunning = false;
        document.getElementById("restartBox").style.display = "block";
        return;
    }

    snake.cells.unshift({ x: snake.x, y: snake.y });
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    ctx.drawImage(raspberryImg, raspberry.x, raspberry.y, 32, 32);

    snake.cells.forEach(function(cell, index) {
        ctx.fillStyle = "#cfa6ff";
        ctx.beginPath();
        ctx.roundRect(cell.x, cell.y, grid - 0.5, grid - 0.5, 12);
        ctx.fill();

        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "#f3d6ff";
        ctx.beginPath();
        ctx.roundRect(cell.x + 2, cell.y + 2, grid - 5, grid - 5, 8);
        ctx.fill();
        ctx.restore();

        if (index === 0) {
            ctx.fillStyle = "white";
            ctx.shadowColor = '#b38fcc';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(cell.x + 9, cell.y + 11, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(cell.x + 23, cell.y + 11, 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.shadowBlur = 0;
            ctx.fillStyle = "#301934";
            ctx.beginPath();
            ctx.arc(cell.x + 9, cell.y + 11, 2.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(cell.x + 23, cell.y + 11, 2.4, 0, Math.PI * 2);
            ctx.fill();

            ctx.save();
            ctx.translate(cell.x + 16, cell.y + 22);
            ctx.scale(1, 0.7);
            ctx.beginPath();
            ctx.strokeStyle = "#5a2d7a";
            ctx.lineWidth = 2.5;
            ctx.arc(0, 0, 9, 0.1, Math.PI - 0.1);
            ctx.stroke();
            ctx.restore();

            ctx.shadowBlur = 8;
            ctx.shadowColor = '#ffa5d2';
            ctx.fillStyle = "#ffb3d9";
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.arc(cell.x + 5, cell.y + 19, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(cell.x + 27, cell.y + 19, 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.globalAlpha = 1.0;
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
        }

        if (cell.x === raspberry.x && cell.y === raspberry.y) {
            snake.maxCells++;
            score++;

            raspberry.x = getRandomInt(0, 20) * grid;
            raspberry.y = getRandomInt(0, 20) * grid;
        }

        for (let i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                gameRunning = false;
                document.getElementById("restartBox").style.display = "block";
                return;
            }
        }
    });
}

document.addEventListener("keydown", function(e) {
    if (!gameRunning) return;
    if (e.key === "ArrowLeft" && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    } else if (e.key === "ArrowUp" && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    } else if (e.key === "ArrowRight" && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    } else if (e.key === "ArrowDown" && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

document.getElementById("up").addEventListener("click", function() {
    if (!gameRunning) return;
    if (snake.dy === 0) { snake.dy = -grid; snake.dx = 0; }
});
document.getElementById("down").addEventListener("click", function() {
    if (!gameRunning) return;
    if (snake.dy === 0) { snake.dy = grid; snake.dx = 0; }
});
document.getElementById("left").addEventListener("click", function() {
    if (!gameRunning) return;
    if (snake.dx === 0) { snake.dx = -grid; snake.dy = 0; }
});
document.getElementById("right").addEventListener("click", function() {
    if (!gameRunning) return;
    if (snake.dx === 0) { snake.dx = grid; snake.dy = 0; }
});

resetGame();
requestAnimationFrame(loop);