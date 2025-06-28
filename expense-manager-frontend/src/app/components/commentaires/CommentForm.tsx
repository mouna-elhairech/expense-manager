'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '@/app/utils/axiosInstance';

interface CommentFormProps {
  entityId: string;
  entityType?: 'EXPENSE' | 'REIMBURSEMENT_REQUEST';
  onSuccess?: () => void;
}

export default function CommentForm({
  entityId,
  entityType = 'EXPENSE',
  onSuccess,
}: CommentFormProps) {
  const [contenu, setContenu] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsConnected(!!token);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isConnected) {
      setError('Vous devez être connecté pour commenter.');
      return;
    }

    if (!contenu.trim()) {
      setError('Le commentaire est requis.');
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post('/commentaires', {
        contenu,
        entityId,
        entityType,
      });

      setContenu('');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error(err);
      setError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
      <textarea
        value={contenu}
        onChange={(e) => setContenu(e.target.value)}
        placeholder="Ajouter un commentaire..."
        className="w-full border rounded-md p-2"
        rows={3}
        disabled={loading || !isConnected}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading || !isConnected}
        className="self-end bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? 'Envoi en cours...' : 'Envoyer'}
      </button>
    </form>
  );
}
