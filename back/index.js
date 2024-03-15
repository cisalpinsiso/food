// import express and mysql2
const express = require('express');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'food'
});

connection.connect(error => {
    if (error) throw error;
    console.log('Successfully connected to the database.');
});


const app = express();
app.use(express.json());

app.get('/api/favorites', (req, res) => {
    connection.query('SELECT * FROM favorites', (error, results) => {
        if (error) throw error;
        res.send(results);
    });
});

app.post('/api/favorites', (req, res) => {
    const { idMeal, strMeal, strMealThumb } = req.body;
    connection.query('INSERT INTO favorites (idMeal, strMeal, strMealThumb) VALUES (?, ?, ?)', [idMeal, strMeal, strMealThumb], (error, results) => {
        if (error) throw error;
        res.send(results);
    });
});

app.delete('/api/favorites/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM favorites WHERE idMeal = ?', [id], (error, results) => {
        if (error) throw error;
        res.send(results);
    });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});