const btnStart = document.getElementById('start');
let level = 'low';

const buttonLow = document.querySelector('button#low');
const buttonMedium = document.querySelector('button#medium');
const buttonHigh = document.querySelector('button#high');

const changeLevel = function () {
    buttonLow.classList.remove('active');
    buttonMedium.classList.remove('active');
    buttonHigh.classList.remove('active');
    this.classList.add('active');
    level = this.textContent;
}

let games = 0;
let wins = 0;
let losses = 0;

let displayResult = () => {
    const result = document.querySelector('section.result div.stats');
    result.innerHTML = `<p>Rozegrane gry: ${games}</p><p>Wygrane: ${wins}</p><p>Przegrane: ${losses}</p>`;
}

buttonLow.addEventListener('click', changeLevel);
buttonMedium.addEventListener('click', changeLevel);
buttonHigh.addEventListener('click', changeLevel);

const startGame = () => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1000;
    canvas.height = 500;
    const cw = canvas.width;
    const ch = canvas.height;
    const ballSize = 20;
    let ballX = cw / 2 - ballSize / 2
    let ballY = ch / 2 - ballSize / 2

    const paddleHeight = 100;
    const paddleWidth = 20;

    const playerX = 70;
    const aiX = 910;

    let playerY = 200;
    let aiY = 200;

    const lineWidth = 6;
    const lineHeight = 16;

    let ballSpeedX = 4;
    let ballSpeedY = 4;

    function player() {
        ctx.fillStyle = '#7FFF00';
        ctx.fillRect(playerX, playerY, paddleWidth, paddleHeight);

        if (ballX - paddleWidth <= playerX && ballY >= playerY - ballSize && ballY <= playerY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        }
    }

    function ai() {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(aiX, aiY, paddleWidth, paddleHeight);

        if (ballX + ballSize >= aiX && ballY <= aiY + paddleHeight && ballY >= aiY - ballSize) {
            ballSpeedX = -ballSpeedX;
        }
    }

    function ball() {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(ballX, ballY, ballSize, ballSize);

        const randomize = [1, 1.1];
        function randomX() {
            let index = Math.floor(Math.random() * 2);
            let multiply = randomize[index];
            ballX += ballSpeedX * multiply;
        }
        function randomY() {
            let index = Math.floor(Math.random() * 2);
            let multiply = randomize[index];
            ballY += ballSpeedY * multiply;
        }
        randomX();
        randomY();

        if (ballY <= 0 || ballY + ballSize >= ch) {
            ballSpeedY = -ballSpeedY;
            speedUp()
        }
        if (ballX <= 0) {
            clearInterval(intervalId);
            alert('Przegrałeś');
            games++;
            losses++;
            ballX = cw / 2 - ballSize / 2
            ballY = ch / 2 - ballSize / 2
            ballSpeedX = 4;
            ballSpeedY = 4;
            displayResult();
            intervalId = setInterval(game, 1000 / 60);
        }
        if (ballX >= 1000) {
            clearInterval(intervalId);
            alert('Wygrałeś');
            games++;
            wins++;
            ballX = cw / 2 - ballSize / 2
            ballY = ch / 2 - ballSize / 2
            ballSpeedX = 4;
            ballSpeedY = 4;
            displayResult();
            intervalId = setInterval(game, 1000 / 60);
        }
    }

    function table() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, cw, ch);

        for (let linePosition = 20; linePosition < ch; linePosition += 30) {
            ctx.fillStyle = "gray"
            ctx.fillRect(cw / 2 - lineWidth / 2, linePosition, lineWidth, lineHeight)
        }
    }

    topCanvas = canvas.offsetTop;

    function playerPosition(e) {
        playerY = e.clientY - topCanvas - paddleHeight / 2;

        if (playerY >= ch - paddleHeight) {
            playerY = ch - paddleHeight
        }

        if (playerY <= 0) {
            playerY = 0;
        }
    }

    function speedUp() {
        if (ballSpeedX > 0 && ballSpeedX < 16) {
            ballSpeedX += .2;
        } else if (ballSpeedX < 0 && ballSpeedX > -16) {
            ballSpeedX -= .2;
        }

        if (ballSpeedY > 0 && ballSpeedY < 16) {
            ballSpeedY += .2;
        } else if (ballSpeedY < 0 && ballSpeedY > -16) {
            ballSpeedY -= .2;
        }
    }

    function aiPosition() {
        function ballBehaviour(a, b, c) {
            if (ballX > 500) {
                if (middlepaddle - middleBall > 200) {
                    aiY -= a;
                }
                else if (middlepaddle - middleBall > 50) {
                    aiY -= b;
                }
                else if (middlepaddle - middleBall < -200) {
                    aiY += a;
                } else if (middlepaddle - middleBall < -50) {
                    aiY += b;
                }
            }

            if (ballX <= 500 && ballX > 100) {
                if (middlepaddle - middleBall > 100) {
                    aiY -= c;
                }
                if (middlepaddle - middleBall < -100) {
                    aiY += c;
                }
            }

            if (aiY >= ch - paddleHeight) {
                aiY = ch - paddleHeight
            }

            if (aiY <= 0) {
                aiY = 0;
            }
        }

        const middlepaddle = aiY + paddleHeight / 2;
        const middleBall = ballY + ballSize / 2;


        if (level === 'Wysoki') {
            ballBehaviour(30, 16, 9);
        } else if (level === 'Średni') {
            ballBehaviour(26, 13, 7);
        } else {
            ballBehaviour(22, 10, 7);
        }

    }

    canvas.addEventListener("mousemove", playerPosition);

    function game() {
        table()
        aiPosition()
        player()
        ball()
        ai()
        btnStart.removeEventListener('click', startGame);
        buttonLow.removeEventListener('click', changeLevel);
        buttonMedium.removeEventListener('click', changeLevel);
        buttonHigh.removeEventListener('click', changeLevel);
    }

    let intervalId = setInterval(game, 1000 / 60);
}

btnStart.addEventListener('click', startGame);