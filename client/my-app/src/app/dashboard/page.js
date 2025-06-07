'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Prüfe bei jedem Mount und Fokus-Wechsel
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      }
    };

    checkAuth();
    window.addEventListener('focus', checkAuth);

    return () => window.removeEventListener('focus', checkAuth);
  }, [router]);

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/user/tasks', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <button 
        onClick={() => {
          localStorage.removeItem('token');
          router.push('/login');
        }}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Abmelden
      </button>
    </div>
  );
}
