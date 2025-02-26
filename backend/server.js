const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Para procesar datos JSON

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       // Usuario de MySQL
    password: '1123581321seriedefibonacci',       // Contraseña de MySQL (si tienes)
    database: 'intense_ddb'
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos MySQL');
    }
});

// Ruta para obtener el leaderboard
app.get('/leaderboard', (req, res) => {
    const query = 'SELECT * FROM leaderboard ORDER BY score DESC LIMIT 25';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta' });
        }
        res.json(results);
    });
});

// Ruta para agregar un nuevo puntaje
app.post('/leaderboard', (req, res) => {
    const { player_name, score } = req.body;
    const query = 'INSERT INTO leaderboard (player_name, score) VALUES (?, ?)';
    db.query(query, [player_name, score], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al insertar el puntaje' });
        }
        res.json({ message: 'Puntaje agregado correctamente' });
    });
});

// Iniciar el servidor
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});