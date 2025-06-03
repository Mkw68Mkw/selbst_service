const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './tasks.db',
  logging: console.log // Optional für Debugging
});

// Modelldefinition
const Task = sequelize.define('Task', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: Sequelize.TEXT,
  status: {
    type: Sequelize.STRING,
    defaultValue: 'open'
  },
  created_at: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  timestamps: false,
  tableName: 'tasks'
});

// Synchronisierung mit Testdaten
const initializeDatabase = async () => {
  try {
    // Prüfe ob die Tabelle bereits existiert
    const tableExists = await sequelize.getQueryInterface().tableExists('tasks');
    
    await sequelize.sync();

    if (!tableExists) {
      await Task.bulkCreate([
        {
          title: 'Erste Aufgabe',
          description: 'Dies ist ein Beispieltask',
          status: 'open'
        },
        {
          title: 'Erledigte Aufgabe',
          description: 'Bereits abgeschlossener Task',
          status: 'done'
        }
      ]);
      console.log('Testdaten erfolgreich eingefügt');
    }
  } catch (error) {
    console.error('Initialisierungsfehler:', error);
  }
};

initializeDatabase();

module.exports = { sequelize, Task };
