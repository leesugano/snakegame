document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startButton');
    const scoreDisplay = document.getElementById('score');

    const box = 20;
    let snake;
    let food;
    let score;
    let d;
    let game;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    function initGame() {
        snake = [];
        snake[0] = { x: 9 * box, y: 10 * box };

        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };

        score = 0;
        d = null;

        scoreDisplay.innerHTML = `Score: ${score}`;
    }

    document.addEventListener('keydown', direction);
    startButton.addEventListener('click', startGame);

    // Touch event listeners for mobile devices
    canvas.addEventListener('touchstart', handleTouchStart, false);
    canvas.addEventListener('touchmove', handleTouchMove, false);

    function handleTouchStart(event) {
        const firstTouch = event.touches[0];
        touchStartX = firstTouch.clientX;
        touchStartY = firstTouch.clientY;
    }

    function handleTouchMove(event) {
        if (!touchStartX || !touchStartY) {
            return;
        }

        touchEndX = event.touches[0].clientX;
        touchEndY = event.touches[0].clientY;

        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            if (diffX > 0 && d != 'LEFT') {
                d = 'RIGHT';
            } else if (diffX < 0 && d != 'RIGHT') {
                d = 'LEFT';
            }
        } else {
            // Vertical swipe
            if (diffY > 0 && d != 'UP') {
                d = 'DOWN';
            } else if (diffY < 0 && d != 'DOWN') {
                d = 'UP';
            }
        }

        // Reset values
        touchStartX = 0;
        touchStartY = 0;
    }

    function direction(event) {
        if (event.keyCode == 37 && d != 'RIGHT') {
            d = 'LEFT';
        } else if (event.keyCode == 38 && d != 'DOWN') {
            d = 'UP';
        } else if (event.keyCode == 39 && d != 'LEFT') {
            d = 'RIGHT';
        } else if (event.keyCode == 40 && d != 'UP') {
            d = 'DOWN';
        }
    }

    function collision(newHead, snake) {
        for (let i = 0; i < snake.length; i++) {
            if (newHead.x == snake[i].x && newHead.y == snake[i].y) {
                return true;
            }
        }
        return false;
    }

    function drawRoundedRect(x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    function draw() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = (i == 0) ? '#34A853' : '#37B659';
            drawRoundedRect(snake[i].x, snake[i].y, box, box, 5);
            ctx.fill();
            ctx.strokeStyle = '#FBBC04';
            ctx.stroke();
        }

        ctx.fillStyle = '#FBBC04';
        drawRoundedRect(food.x, food.y, box, box, 5);
        ctx.fill();

        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        if (d == 'LEFT') snakeX -= box;
        if (d == 'UP') snakeY -= box;
        if (d == 'RIGHT') snakeX += box;
        if (d == 'DOWN') snakeY += box;

        if (snakeX == food.x && snakeY == food.y) {
            score++;
            scoreDisplay.innerHTML = `Score: ${score}`;
            food = {
                x: Math.floor(Math.random() * 19 + 1) * box,
                y: Math.floor(Math.random() * 19 + 1) * box
            };
        } else {
            snake.pop();
        }

        let newHead = {
            x: snakeX,
            y: snakeY
        };

        if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
            clearInterval(game);
            alert('Game Over');
        }

        snake.unshift(newHead);
    }

    function startGame() {
        initGame();
        clearInterval(game);
        game = setInterval(draw, 100);
    }
});
