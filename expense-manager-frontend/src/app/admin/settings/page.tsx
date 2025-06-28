'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/app/components/AdminLayout';

export default function SettingsPage() {
  const [ocrEnabled, setOcrEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/settings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Erreur lors du chargement des paramètres');

      const data = await res.json();
      setOcrEnabled(data.ocrEnabled);
      setNotificationsEnabled(data.notificationsEnabled);
    } catch (err) {
      setMessage('❌ Erreur lors du chargement');
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ocrEnabled,
          notificationsEnabled,
        }),
      });

      if (!res.ok) throw new Error('Erreur lors de la mise à jour');

      setMessage('✅ Paramètres sauvegardés');
    } catch (err) {
      setMessage('❌ Erreur lors de la sauvegarde');
    }

    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Paramètres du système</h1>

        <div className="bg-white border rounded shadow p-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">OCR automatique</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={ocrEnabled}
                onChange={() => setOcrEnabled(!ocrEnabled)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 relative transition-all duration-300">
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all duration-300 peer-checked:translate-x-5"></div>
              </div>
            </label>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">Notifications utilisateurs</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 relative transition-all duration-300">
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all duration-300 peer-checked:translate-x-5"></div>
              </div>
            </label>
          </div>

          <button
            onClick={handleSave}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
          </button>

          {message && <p className="text-green-600 font-semibold mt-2">{message}</p>}
        </div>
      </div>
    </AdminLayout>
  );
}
