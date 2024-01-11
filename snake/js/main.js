const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;
let highScore = localStorage.getItem("high-score") || 0;

 // Mostrar la puntuación máxima permanentemente sobre el tablero.
 highScoreElement.innerHTML = `Puntuación máxima: ${highScore}`;

// Función que genera la alatoriedad en el tablero de la comida que comerá la serpiente

const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

// HandleGameOver, función para cuando el juego termina, por el choque con un borde o con el cuerpo de la serpiente, reseteo del intervalo de movimiento, alerta de juego terminado y recarga de la página para volver a iniciar el juego

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Juego Terminado");
    location.reload();
}

// Movimiento de la serpiente con las teclas arrow, utilizando las variables velocity, impidiendo que la serpiente de marcha atrás

const changeDirection = (e) => {
 //console.log(e);
 if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
 } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
 } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
 } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
 }
//  initGame();
}

// Creación de la clase food, cuadrícula en la que estará ubicada la comida, y creación de la posición inicial de la serpiente, dando inicio al juego con la función "initGame()" 

const initGame = () => {
    if(gameOver) return handleGameOver();
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Comer Fruta: al momento que la serpiente pasa sobre la comida, una nueva comida aparecerá aleatoriamente en el tablero, además hace crecer el array snakeBody con el método push:
    // Agregar el contador de puntaje y que vaya sumando cuando la serpiente coma una fruta. Además guardar la puntuación máxima en el localstorage
    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++;

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);

        scoreElement.innerHTML = `Puntuación: ${score}`;

    }

   

    // Arreglando el crecimiento de la serpiente: al momento de pasar la serpiente sobre la comida va a correr el cuadrado hacia atras, creando y haciendo crecer el cuerpo de la serpiente.
    for(let i = snakeBody.length -1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }


    // Serpiente Inicial:
    snakeBody[0] = [snakeX, snakeY];

    // Generación del movimiento de la serpiente, junto con los valores iniciales y la escucha del presionar teclas correspondientes

    snakeX += velocityX;
    snakeY += velocityY;

    // Choque contra la pared, si la serpiente se choca con algún borde del tablero el juego se termina

    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true
    }


    // Hacer crecer el cuerpo de la serpiente con el método for, cada vez que la serpiente pase por encima de una comida se va a estar creando un nuevo div: 
    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = htmlMarkup;
}

changeFoodPosition();
//initGame();
// Generar movimiento automático de la serpiente a partir que se inicia el juego con setInterval
setIntervalId = setInterval(initGame, 125);

document.addEventListener("keydown", changeDirection);