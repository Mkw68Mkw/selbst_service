'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registrierung fehlgeschlagen');
      }

      router.push('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-transparent p-2 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Zurück</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Neues Konto erstellen</h1>
          <p className="text-gray-500">Registrieren Sie sich, um loszulegen</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Benutzername
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passwort
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passwort bestätigen
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Registrierung läuft...' : 'Registrieren'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Bereits registriert?{' '}
            <a 
              href="/login" 
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Zum Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}