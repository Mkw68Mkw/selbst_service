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

const User = sequelize.define('User', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'users'
});

// Synchronisierung mit Testdaten
const initializeDatabase = async () => {
  try {
    const [tasksTableExists, usersTableExists] = await Promise.all([
      sequelize.getQueryInterface().tableExists('tasks'),
      sequelize.getQueryInterface().tableExists('users')
    ]);

    await sequelize.sync();

    if (!tasksTableExists) {
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

    if (!usersTableExists) {
      await User.bulkCreate([
        {
          username: 'admin',
          password: 'admin123' // In Produktion hashen!
        },
        {
          username: 'user',
          password: 'test456'
        }
      ]);
      console.log('Testbenutzer angelegt');
    }
  } catch (error) {
    console.error('Initialisierungsfehler:', error);
  }
};

initializeDatabase();

module.exports = { sequelize, Task, User };
