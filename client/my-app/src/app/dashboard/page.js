'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

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
