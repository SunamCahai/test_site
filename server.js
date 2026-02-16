const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./database.db');

app.use(express.json());
app.use(express.static('public')); // Frontend

// 1. Registration
app.post('/api/register', (req, res) => {
    const { username, password, age } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    db.run(`INSERT INTO users (username, password, age) VALUES (?, ?, ?)`, 
    [username, hashedPassword, age], (err) => {
        if (err) return res.status(400).json({ error: "Alredy taken" });
        res.json({ message: "Great!" });
    });
});

// 2. (Login)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: "Incorrect login" });
        }
        // Send user data
        res.json({ username: user.username, age: user.age });
    });
});

// 3. Get all comments
app.get('/api/comments', (req, res) => {
    db.all(`SELECT * FROM comments ORDER BY timestamp DESC`, [], (err, rows) => {
        res.json(rows);
    });
});

// 4. Leave comment
app.post('/api/comments', (req, res) => {
    const { username, text } = req.body;
    db.run(`INSERT INTO comments (username, text) VALUES (?, ?)`, [username, text], () => {
        res.json({ success: true });
    });
});

app.listen(3000, () => console.log('Сервер: http://localhost:3000'));
