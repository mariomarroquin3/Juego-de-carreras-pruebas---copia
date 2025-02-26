// URL del backend (asegúrate de que el servidor esté corriendo)
const API_URL = 'http://localhost:5000/leaderboard';

// Función para obtener los datos del leaderboard
async function fetchLeaderboard() {
    try {
        console.log('Fetching leaderboard data...');
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Datos recibidos del servidor:', data); // Mensaje de depuración
        displayTopPlaces(data);
        displayLeaderboard(data);
    } catch (error) {
        console.error('Error al obtener el leaderboard:', error);
    }
}

// Función para mostrar los datos en las tarjetas de los tres primeros lugares
function displayTopPlaces(data) {
    const topPlaces = data.slice(0, 3);

    if (topPlaces[0]) {
        document.querySelector('#first-place .name').textContent = topPlaces[0].player_name;
        document.querySelector('#first-place .score').textContent = `Puntaje: ${topPlaces[0].score}`;
    }

    if (topPlaces[1]) {
        document.querySelector('#second-place .name').textContent = topPlaces[1].player_name;
        document.querySelector('#second-place .score').textContent = `Puntaje: ${topPlaces[1].score}`;
    }

    if (topPlaces[2]) {
        document.querySelector('#third-place .name').textContent = topPlaces[2].player_name;
        document.querySelector('#third-place .score').textContent = `Puntaje: ${topPlaces[2].score}`;
    }
}

// Función para mostrar los datos en la tabla
function displayLeaderboard(data) {
    console.log('Displaying leaderboard data...');
    const tbody = document.querySelector('#leaderboard tbody');
    if (!tbody) {
        console.error('Elemento tbody no encontrado');
        return;
    }
    tbody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

    // Limitar a 25 registros
    const top25 = data.slice(0, 25);

    top25.forEach((row, index) => {
        const tr = document.createElement('tr');

        // Posición
        const tdPosition = document.createElement('td');
        tdPosition.textContent = index + 1;
        tr.appendChild(tdPosition);

        // Nombre
        const tdName = document.createElement('td');
        tdName.textContent = row.player_name;
        tr.appendChild(tdName);

        // Puntaje
        const tdScore = document.createElement('td');
        tdScore.textContent = row.score;
        tr.appendChild(tdScore);

        // Fecha
        const tdDate = document.createElement('td');
        tdDate.textContent = new Date(row.date).toLocaleString();
        tr.appendChild(tdDate);

        tbody.appendChild(tr);
    });
}

// Cargar el leaderboard cuando la página se abra
document.addEventListener('DOMContentLoaded', fetchLeaderboard);

// _____________________________________________________________
// Reproducción de música
const music3 = document.getElementById('music3');

function startMusic() {
    if (music3.paused) {
        music3.play();
    } else {
        music3.pause();
    }
}

music3.addEventListener('ended', () => {
    music3.currentTime = 0;
    music3.play();
});

// Iniciar la reproducción automáticamente cuando el usuario interactúa con la página
document.addEventListener('DOMContentLoaded', () => {
    if (music3.paused) {
        music3.play();
    }
});