const express = require('express');
const cors = require('cors');
const db = require('./db'); // Datenbankmodul importieren
const app = express();
const port = 3001; // Backend läuft auf Port 3001

// CORS-Middleware hinzufügen
app.use(cors());
app.use(express.json());  // Um JSON-Daten im Body zu verarbeiten

// Datenbankabfrage in der Route integrieren
app.get('/', (req, res) => {
  db.all('SELECT * FROM tasks', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Route zum Erstellen einer neuen Aufgabe
app.post('/tasks', (req, res) => {
  const { title, description, status } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Titel ist erforderlich' });
  }

  const stmt = db.prepare('INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)');
  stmt.run(title, description || '', status || 'open', function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      id: this.lastID,
      title,
      description,
      status,
      created_at: new Date().toISOString(),
    });
  });
  stmt.finalize();
});

// Route zum Löschen einer Aufgabe
app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  
  db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Task nicht gefunden' });
    }
    res.json({ message: 'Task erfolgreich gelöscht' });
  });
});

// Route zum Aktualisieren einer Aufgabe
app.put('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const { title, description, status } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Titel ist erforderlich' });
  }

  db.run(
    `UPDATE tasks 
     SET title = ?, description = ?, status = ? 
     WHERE id = ?`,
    [title, description || '', status || 'open', id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Task nicht gefunden' });
      }
      res.json({
        id: id,
        title,
        description,
        status,
        created_at: new Date().toISOString()
      });
    }
  );
});

// Den Server starten
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
