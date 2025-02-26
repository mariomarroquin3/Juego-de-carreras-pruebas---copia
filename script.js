const score = document.querySelector('.score');
const startScreen = document.querySelector('.startScreen');
const gameArea = document.querySelector('.gameArea');
const crashSound = document.getElementById('crashSound'); // Obtiene el audio del choque
const music = document.getElementById('backgroundMusic'); // Obtiene el audio

startScreen.addEventListener('click', start);
let player = { speed: 5, score: 0 };
let keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Variables para el control táctil
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

gameArea.addEventListener('touchstart', handleTouchStart, false);
gameArea.addEventListener('touchmove', handleTouchMove, false);
gameArea.addEventListener('touchend', handleTouchEnd, false);

function keyDown(e) {
    e.preventDefault();
    keys[e.key] = true;
}

function keyUp(e) {
    e.preventDefault();
    keys[e.key] = false;
}

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}

function handleTouchMove(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;

    // Calcular la diferencia de desplazamiento
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Actualizar la posición del auto
    player.x += deltaX;
    player.y += deltaY;

    // Actualizar las coordenadas de inicio para el próximo movimiento
    touchStartX = touchEndX;
    touchStartY = touchEndY;
}

function handleTouchEnd(e) {
    // Resetear las coordenadas de toque
    touchStartX = 0;
    touchEndX = 0;
    touchStartY = 0;
    touchEndY = 0;
}

function isCollide(a, b) {
    const hitboxReduction = 0.1; // Reducir el tamaño de la hitbox en un 10%

    aRect = a.getBoundingClientRect();
    bRect = b.getBoundingClientRect();

    // Reducir el tamaño de los rectángulos de colisión
    aRect = {
        top: aRect.top + aRect.height * hitboxReduction,
        bottom: aRect.bottom - aRect.height * hitboxReduction,
        left: aRect.left + aRect.width * hitboxReduction,
        right: aRect.right - aRect.width * hitboxReduction
    };

    bRect = {
        top: bRect.top + bRect.height * hitboxReduction,
        bottom: bRect.bottom - bRect.height * hitboxReduction,
        left: bRect.left + bRect.width * hitboxReduction,
        right: bRect.right - bRect.width * hitboxReduction
    };

    return !(
        aRect.bottom < bRect.top ||
        aRect.top > bRect.bottom ||
        aRect.right < bRect.left ||
        aRect.left > bRect.right
    );
}

function moveLines() {
    let lines = document.querySelectorAll('.lines');
    lines.forEach(function (item) {
        if (item.y >= 650) {
            item.y -= 740;
        }
        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}

function endGame() {
    player.start = false;
    player.speed = 5;  //  Reiniciar velocidad al valor inicial
    music.pause(); // Detiene la música de fondo
    music.currentTime = 0; // Reinicia la música

    crashSound.play(); // Reproduce el sonido de accidente

    // Guardar la puntuación del jugador
    let playerName = localStorage.getItem("playerName") || "Jugador Anónimo";
    saveScore(playerName, player.score);

    startScreen.classList.remove('hide');
    startScreen.innerHTML = "Fin del juego <br> Puntuación final: " + player.score + "<br>Pulsa de nuevo para volver a empezar";
}

function moveEnemy(car) {
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach(function (item) {
        if (isCollide(car, item)) {
            console.log("Bang!");
            endGame();
        }

        // Mueve los enemigos usando player.speed
        item.y += player.speed * 1.1; // Puedes cambiar por un valor mayor si quieres que los enemigos vayan más rápido

        if (item.y >= 750) {
            item.y = -300;
            item.style.left = Math.floor(Math.random() * 350) + "px";
        }
        item.style.top = item.y + "px";
    });
}

function gamePlay() {
    if (isPaused) return; // Detener el juego si está en pausa

    let car = document.querySelector('.car');
    let road = gameArea.getBoundingClientRect();

    if (player.start) {
        moveLines();
        moveEnemy(car);

        // Mover monedas y detectar colisiones
        let coins = document.querySelectorAll('.coin');
        coins.forEach(function (coin) {
            if (isCollide(car, coin)) {
                player.score += 100; // Incrementa la puntuación
                coin.remove(); // Elimina la moneda al recogerla
                console.log("¡Moneda recogida!");
            }

            coin.y += player.speed; // Mover moneda hacia abajo
            if (coin.y > 700) {
                coin.y = -200; // Reiniciar posición vertical
                coin.style.left = Math.floor(Math.random() * 350) + "px"; // Cambiar posición horizontal
            }
            coin.style.top = coin.y + "px";
        });

        // 📌 Aumento de dificultad basado en la puntuación
        if (player.score >= 500 && player.speed < 5) player.speed = 5;
        if (player.score >= 1000 && player.speed < 6) player.speed = 6;
        if (player.score >= 2000 && player.speed < 8) player.speed = 7;
        if (player.score >= 3000 && player.speed < 9) player.speed = 8;
        if (player.score >= 5000 && player.speed < 10) player.speed = 9;
        if (player.score >= 10000 && player.speed < 10) player.speed = 10;
        if (player.score >= 11000 && player.speed < 11) player.speed = 11;

        // 📌 Movimiento del auto jugador
        const horizontalMoveDistance = 7; // Ajusta este valor para incrementar el desplazamiento horizontal

        if (keys.ArrowUp && player.y > (road.top + 70)) {
            player.y -= player.speed;
        }
        if (keys.ArrowDown && player.y < (road.bottom - 85)) {
            player.y += player.speed;
        }
        if (keys.ArrowLeft && player.x > 0) {
            player.x -= horizontalMoveDistance;
        }
        if (keys.ArrowRight && player.x < (road.width - 50)) {
            player.x += horizontalMoveDistance;
        }

        // Asegurarse de que el auto se mantenga dentro de los límites de la carretera
        if (player.x < 0) player.x = 0;
        if (player.x > (road.width - car.offsetWidth)) player.x = road.width - car.offsetWidth;
        if (player.y < 0) player.y = 0;
        if (player.y > (road.height - car.offsetHeight)) player.y = road.height - car.offsetHeight;

        car.style.top = player.y + "px";
        car.style.left = player.x + "px";

        // Aumenta la puntuación y actualiza la pantalla
        player.score++;
        if (typeof score !== "undefined" && score !== null) {
            score.innerText = "Score: " + (player.score - 1);
        }

        window.requestAnimationFrame(gamePlay);
    }
}

function confirmName() {
    let playerName = document.getElementById("playerNameInput").value.trim();

    if (playerName === "") {
        alert("Por favor, ingresa tu nombre");
        return;
    }

    localStorage.setItem("playerName", playerName);
    document.querySelector(".nameSelection").style.display = "none"; // Ocultar el menú
}

function selectCar(carImage) {
    console.log("Guardando auto seleccionado:", carImage);
    localStorage.setItem('selectedCar', carImage);
    document.querySelector('.carSelection').style.display = 'none';
}

// Función para seleccionar el entorno y guardarlo
function selectEnvironment(environment) {
    localStorage.setItem('selectedBackground', environment); // Guardar en localStorage
    document.querySelector('.environmentSelection').style.display = 'none'; // Ocultar menú
    applyEnvironment(); // Aplicar el fondo de inmediato
}

// Función para aplicar el fondo a .carGame
function applyEnvironment() {
    let selectedBackground = localStorage.getItem('selectedBackground') || 'pastizal.jpg';
    document.querySelector('.carGame').style.background = `url(${selectedBackground}) no-repeat center`;
    document.querySelector('.carGame').style.backgroundSize = "cover";
}

async function saveScore(playerName, score) {
    try {
        console.log('Enviando puntaje al servidor:', playerName, score); // Mensaje de depuración
        const response = await fetch('http://localhost:5000/leaderboard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ player_name: playerName, score: score }),
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json();
        console.log('Respuesta del servidor:', data.message); // Mensaje de depuración
    } catch (error) {
        console.error('Error al guardar el puntaje:', error);
    }
}

function randomColor() {
    function c() {
        let hex = Math.floor(Math.random() * 256).toString(16);
        return ("0" + String(hex)).substr(-2);
    }
    return "#" + c() + c() + c() ;
}

let isPaused = false;

function togglePause() {
    isPaused = !isPaused;
    const pauseButton = document.querySelector('.pause-button');
    if (isPaused) {
        pauseButton.textContent = 'Reanudar';
    } else {
        pauseButton.textContent = 'Pausar';
        window.requestAnimationFrame(gamePlay); // Reanudar el ciclo del juego
    }
}

// Lógica para iniciar el juego cuando se presiona el botón de inicio
document.querySelector('.startScreen').addEventListener('click', start);

function start() {
    applyEnvironment(); // Aplica el entorno seleccionado
    music.play(); // Inicia la música
    startScreen.classList.add('hide');
    gameArea.innerHTML = ""; // Limpiar el área de juego
    player.start = true;
    player.score = 0;

    // Reiniciar velocidad y otros parámetros globales
    player.speed = 5; // Velocidad inicial del jugador

    // 📌 Crear líneas en la carretera
    for (let x = 0; x < 5; x++) {
        let roadLine = document.createElement('div');
        roadLine.setAttribute('class', 'lines');
        roadLine.y = (x * 150);
        roadLine.style.top = roadLine.y + "px";
        gameArea.appendChild(roadLine);
    }

    // 📌 Crear el auto del jugador
    let car = document.createElement('div');
    car.setAttribute('class', 'car');

    // 📌 Obtener el auto seleccionado o usar uno por defecto
    let selectedCar = localStorage.getItem('selectedCar') || 'car1.png';

    // 📌 Aplicar la imagen como fondo
    car.style.background = `url(${selectedCar}) no-repeat center`;
    car.style.backgroundSize = "contain";

    gameArea.appendChild(car);

    // 📌 Esperar para calcular la posición correcta
    setTimeout(() => {
        player.x = car.offsetLeft;
        player.y = car.offsetTop;

        // Asegurar que `car` tenga una posición inicial correcta
        car.style.left = player.x + "px";
        car.style.top = player.y + "px";

        // Iniciar el juego después de que todo esté bien cargado
        window.requestAnimationFrame(gamePlay);
    }, 200);

    // 📌 Crear autos enemigos
    for (let x = 0; x < 3; x++) {
        let enemyCar = document.createElement('div');
        enemyCar.setAttribute('class', 'enemy');
        enemyCar.y = ((x + 1) * 350) * -1;
        enemyCar.style.top = enemyCar.y + "px";
        enemyCar.style.backgroundColor = randomColor();
        enemyCar.style.left = Math.floor(Math.random() * 350) + "px";
        gameArea.appendChild(enemyCar);
    }

    
    let lastLane = -1; // Inicializar con un valor que no sea un carril válido
    let lastY = 0; // Para controlar el espaciado vertical
    for (let x = 0; x < 50; x++) {
        let coin = document.createElement('div');
        coin.setAttribute('class', 'coin');
        
        // Espaciado vertical más variado
        const verticalGap = Math.random() * 200 + 150; // Entre 150 y 350px
        coin.y = lastY - verticalGap;
        lastY = coin.y;
        coin.style.top = coin.y + "px";

        // Distribución horizontal mejorada
        let laneWidth = 350 / 3; // Dividido en 3 "carriles"
        let lane;
        do {
            lane = Math.floor(Math.random() * 3); // Elegir un carril al azar
        } while (lane === lastLane && Math.random() > 0.3); // 70% de probabilidad de cambiar carril

        lastLane = lane; // Actualizar el último carril utilizado
        coin.style.left = (lane * laneWidth + laneWidth / 2 - 15) + "px"; // Centrar en el carril

        coin.style.width = "30px";
        coin.style.height = "30px";
        coin.style.backgroundColor = "gold";
        coin.style.borderRadius = "50%";
        gameArea.appendChild(coin);
    }
}