const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./tasks.db', (err) => {
  if (err) {
    console.error('Datenbank konnte nicht geöffnet werden', err);
  } else {
    console.log('Datenbank erfolgreich geöffnet');
  }
});

// Tabelle "tasks" erstellen, falls sie noch nicht existiert
db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;
