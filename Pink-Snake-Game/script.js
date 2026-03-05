const board = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");

const rows = 20;
const cols = 20;

let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let direction = { x: 0, y: 0 };
let score = 0;
let gameInterval;

const cells = [];

for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        board.appendChild(cell);
        cells.push(cell);
    }
}

function draw() {

    cells.forEach(cell => cell.className = "cell");

    snake.forEach((segment, index) => {

        const idx = segment.y * cols + segment.x;

        if(index === 0){
            cells[idx].classList.add("snake","snake-head");
        } else {
            cells[idx].classList.add("snake");
        }

    });

    const foodIndex = food.y * cols + food.x;
    cells[foodIndex].classList.add("food");

}

function placeFood(){

    let x,y;

    do{

        x = Math.floor(Math.random()*cols);
        y = Math.floor(Math.random()*rows);

    } while(snake.some(seg => seg.x === x && seg.y === y));

    food = {x,y};

}

function update(){

    if(direction.x === 0 && direction.y === 0) return;

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    snake.unshift(head);

    if(head.x === food.x && head.y === food.y){

        score++;
        scoreDisplay.textContent = score;
        placeFood();

    } else {

        snake.pop();

    }

    if(
        head.x < 0 || head.x >= cols ||
        head.y < 0 || head.y >= rows ||
        snake.slice(1).some(seg => seg.x === head.x && seg.y === head.y)
    ){

        clearInterval(gameInterval);
        alert("Game Over! Score: "+score);
        return;

    }

    draw();

}

document.addEventListener("keydown", e => {

    switch(e.key){

        case "ArrowUp":
        if(direction.y === 0) direction = {x:0,y:-1};
        break;

        case "ArrowDown":
        if(direction.y === 0) direction = {x:0,y:1};
        break;

        case "ArrowLeft":
        if(direction.x === 0) direction = {x:-1,y:0};
        break;

        case "ArrowRight":
        if(direction.x === 0) direction = {x:1,y:0};
        break;

    }

});

document.getElementById("up").onclick = () => { if(direction.y === 0) direction={x:0,y:-1} };
document.getElementById("down").onclick = () => { if(direction.y === 0) direction={x:0,y:1} };
document.getElementById("left").onclick = () => { if(direction.x === 0) direction={x:-1,y:0} };
document.getElementById("right").onclick = () => { if(direction.x === 0) direction={x:1,y:0} };

placeFood();
draw();

gameInterval = setInterval(update,200);