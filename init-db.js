const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  // Таблица пользователей
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    age INTEGER
  )`);

  // Таблица комментариев
  db.run(`CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    text TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

console.log("База данных создана успешно!");
db.close();