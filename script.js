const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const birdImg = new Image(); birdImg.src = "assets/bird.png";
const bgImg = new Image(); bgImg.src = "assets/bg.png";
const pipeImg = new Image(); pipeImg.src = "assets/pipe.png";

// ЗБІЛЬШЕНО ПЕРСОНАЖА: 64x46
let bird = {
    x: 50,
    y: 150,
    width: 64,
    height: 46,
    gravity: 0.25,
    velocity: 0,
    jump: 5.0
};

let pipes = [];
let score = 0;
let frame = 0;
const pipeGap = 135; // Трохи більше місця для прольоту великої пташки

function draw() {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (frame % 100 === 0) {
        let minPipeHeight = 50;
        let maxPipeHeight = canvas.height - pipeGap - minPipeHeight - 50;
        let randomY = Math.floor(Math.random() * maxPipeHeight) + minPipeHeight;
        pipes.push({ x: canvas.width, y: randomY, width: 50, passed: false });
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= 2;
        ctx.save();
        ctx.translate(pipes[i].x + pipes[i].width, pipes[i].y);
        ctx.rotate(Math.PI);
        ctx.drawImage(pipeImg, 0, 0, pipes[i].width, canvas.height);
        ctx.restore();
        ctx.drawImage(pipeImg, pipes[i].x, pipes[i].y + pipeGap, pipes[i].width, canvas.height);

        // Перевірка колізій з урахуванням нових розмірів пташки
        if (bird.x + 5 < pipes[i].x + pipes[i].width &&
            bird.x + bird.width - 5 > pipes[i].x &&
            (bird.y + 5 < pipes[i].y || bird.y + bird.height - 5 > pipes[i].y + pipeGap)) {
            resetGame();
        }

        if (!pipes[i].passed && pipes[i].x + pipes[i].width < bird.x) {
            score++;
            pipes[i].passed = true;
        }
        if (pipes[i].x + pipes[i].width < 0) pipes.splice(i, 1);
    }

    if (bird.y + bird.height > canvas.height || bird.y < 0) resetGame();

    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);

    frame++;
    requestAnimationFrame(draw);
}

function resetGame() {
    bird.y = 150; bird.velocity = 0; pipes = []; score = 0; frame = 0;
}

const handleJump = () => { bird.velocity = -bird.jump; };
window.addEventListener("keydown", (e) => { if (e.code === "Space") handleJump(); });
canvas.addEventListener("touchstart", (e) => { e.preventDefault(); handleJump(); });

bgImg.onload = () => draw();