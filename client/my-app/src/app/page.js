'use client'
import { useEffect, useState } from 'react';
import Image from "next/image";

export default function Home() {
  // State, um die Antwort vom Express-Server zu speichern
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'open'
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // useEffect, um beim Laden der Seite die API anzufragen
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001'); // Adjust URL to match your backend endpoint
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
        setData({ message: 'Failed to load data' });
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      
      if (response.ok) {
        setShowModal(false);
        // Daten neu laden
        const result = await fetch('http://localhost:3001');
        const newData = await result.json();
        setData(newData);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/tasks/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        const newData = data.filter(task => task.id !== id);
        setData(newData);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingTask),
      });
      
      if (response.ok) {
        setShowEditModal(false);
        const updatedData = data.map(task => 
          task.id === editingTask.id ? {...editingTask} : task
        );
        setData(updatedData);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <button 
        onClick={() => setShowModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Neue Aufgabe erstellen
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Neue Aufgabe</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Titel*</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Beschreibung</label>
                <textarea
                  className="w-full p-2 border rounded"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Status</label>
                <select
                  className="w-full p-2 border rounded"
                  value={newTask.status}
                  onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                >
                  <option value="open">Offen</option>
                  <option value="in progress">In Bearbeitung</option>
                  <option value="done">Erledigt</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Erstellen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {data && (
          <div className="w-full max-w-2xl">
            <h2 className="text-lg font-bold mb-4">Tasks:</h2>
            <ul className="space-y-2">
              {data.map(task => (
                <li key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{task.title}</h3>
                    {task.description && <p className="text-gray-600 text-sm">{task.description}</p>}
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.status === 'done' ? 'bg-green-100 text-green-800' :
                        task.status === 'in progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {task.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(task.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => {
                        setEditingTask(task);
                        setShowEditModal(true);
                      }}
                      className="p-2 text-gray-500 hover:text-blue-600 transition-transform duration-200 hover:scale-125"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-2 text-gray-500 hover:text-red-600 transition-transform duration-200 hover:scale-125"
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Aufgabe bearbeiten</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block mb-2">Titel*</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Beschreibung</label>
                <textarea
                  className="w-full p-2 border rounded"
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Status</label>
                <select
                  className="w-full p-2 border rounded"
                  value={editingTask.status}
                  onChange={(e) => setEditingTask({...editingTask, status: e.target.value})}
                >
                  <option value="open">Offen</option>
                  <option value="in progress">In Bearbeitung</option>
                  <option value="done">Erledigt</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Aktualisieren
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
