const express = require('express');
const cors = require('cors');
const { Task } = require('./db');
const app = express();
const port = 3001; // Backend läuft auf Port 3001

// CORS-Middleware hinzufügen
app.use(cors());
app.use(express.json());  // Um JSON-Daten im Body zu verarbeiten

// Datenbankabfrage in der Route integrieren
app.get('/', (req, res) => {
  Task.findAll()
    .then(tasks => {
      res.json(tasks);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// Route zum Erstellen einer neuen Aufgabe
app.post('/tasks', (req, res) => {
  const { title, description, status } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Titel ist erforderlich' });
  }

  Task.create({
    title,
    description,
    status
  })
    .then(task => {
      res.status(201).json(task);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// Route zum Löschen einer Aufgabe
app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  
  Task.destroy({
    where: {
      id: id
    }
  })
    .then(result => {
      if (result === 0) {
        return res.status(404).json({ error: 'Task nicht gefunden' });
      }
      res.json({ message: 'Task erfolgreich gelöscht' });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// Route zum Aktualisieren einer Aufgabe
app.put('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const { title, description, status } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Titel ist erforderlich' });
  }

  Task.update(
    {
      title,
      description,
      status
    },
    {
      where: {
        id: id
      }
    }
  )
    .then(result => {
      if (result[0] === 0) {
        return res.status(404).json({ error: 'Task nicht gefunden' });
      }
      res.json({
        id: id,
        title,
        description,
        status,
        created_at: new Date().toISOString()
      });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// Den Server starten
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
