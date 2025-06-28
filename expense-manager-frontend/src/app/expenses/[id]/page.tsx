'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axiosInstance from '@/app/utils/axiosInstance';
import CommentForm from '@/app/components/commentaires/CommentForm';
import { useAuth } from '@/app/components/AuthProvider';
import AdminLayout from '@/app/components/AdminLayout';

interface User {
  id: string;
  prenom: string;
  nom: string;
}

interface Commentaire {
  id: string;
  contenu: string;
  dateCreation: string;
  utilisateur: User;
}

interface Expense {
  id: string;
  montant: number;
  devise: string;
  dateDepense: string;
  description: string;
  statut: string;
  user: User;
  recu?: {
    cheminStockage: string;
  };
}

export default function ExpenseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [depense, setDepense] = useState<Expense | null>(null);
  const [commentaires, setCommentaires] = useState<Commentaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  const fetchDepense = async () => {
    try {
      const res = await axiosInstance.get(`/expenses/${id}`);
      const data = res.data;

      const isOwner = user?.id === data.user?.id;
      const isManagerOrAdmin = user?.role === 'MANAGER' || user?.role === 'ADMIN';

      if (!isOwner && !isManagerOrAdmin) {
        setAccessDenied(true);
        return;
      }

      setDepense(data);
    } catch {
      setDepense(null);
    }
  };

  const fetchCommentaires = async () => {
    try {
      const res = await axiosInstance.get(`/commentaires?entityId=${id}`);
      setCommentaires(res.data);
    } catch {
      setCommentaires([]);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Supprimer ce commentaire ?')) return;
    try {
      await axiosInstance.delete(`/commentaires/${commentId}`);
      await fetchCommentaires();
    } catch {
      alert('❌ Erreur lors de la suppression.');
    }
  };

  useEffect(() => {
    if (!id || !user?.id) return;
    const load = async () => {
      await fetchDepense();
      await fetchCommentaires();
      setLoading(false);
    };
    load();
  }, [id, user?.id]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { dateStyle: 'long' });

  const isManagerOrAdmin = user?.role === 'MANAGER' || user?.role === 'ADMIN';
  const isOwner = user?.id === depense?.user?.id;

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-center mt-8 text-gray-500">Chargement...</p>
      </AdminLayout>
    );
  }

  if (accessDenied) {
    return (
      <AdminLayout>
        <p className="text-center text-red-500 mt-8">⛔️ Accès non autorisé</p>
      </AdminLayout>
    );
  }

  if (!depense) {
    return (
      <AdminLayout>
        <p className="text-center text-red-500 mt-8">❌ Dépense introuvable</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto p-4 space-y-10">
        <button
          onClick={() => router.back()}
          className="inline-block bg-gray-100 text-sm text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition"
        >
          ← Retour
        </button>

        {/* Détail de la dépense */}
        <div className="bg-white border border-gray-200 rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Détail de la dépense</h2>
          <div className="text-sm text-gray-700 space-y-1">
            <p><span className="font-medium">Montant :</span> {Number(depense.montant).toFixed(2)} {depense.devise}</p>
            <p><span className="font-medium">Description :</span> {depense.description}</p>
            <p><span className="font-medium">Date :</span> {formatDate(depense.dateDepense)}</p>
            <p><span className="font-medium">Statut :</span> <StatutBadge statut={depense.statut} /></p>
          </div>
        </div>

        {/* Justificatif */}
        {depense.recu?.cheminStockage && (
          <div className="bg-white border border-gray-200 rounded-xl shadow p-6">
            <h3 className="text-md font-semibold text-gray-800 mb-3">Justificatif</h3>
            <img
              src={depense.recu.cheminStockage}
              alt="Reçu OCR"
              className="max-w-full rounded-md border"
            />
          </div>
        )}

        {/* Commentaires */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Commentaires</h3>
          {commentaires.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun commentaire pour l’instant.</p>
          ) : (
            <div className="space-y-4">
              {commentaires.map((com) => (
                <div key={com.id} id={`comment-${com.id}`} className="bg-gray-50 border rounded p-4">
                  <div className="flex justify-between items-center text-sm font-medium text-gray-700 mb-1">
                    <span>{com.utilisateur.prenom} {com.utilisateur.nom}</span>
                    {com.utilisateur.id === user?.id && (
                      <button onClick={() => handleDeleteComment(com.id)} className="text-red-500 hover:underline text-xs">Supprimer</button>
                    )}
                  </div>
                  <p className="text-sm text-gray-800">{com.contenu}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(com.dateCreation).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Formulaire commentaire */}
        {(isOwner || isManagerOrAdmin) && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow">
            <h4 className="text-md font-semibold text-gray-800 mb-2">Ajouter un commentaire</h4>
            <CommentForm
              entityId={id as string}
              entityType="EXPENSE"
              onSuccess={fetchCommentaires}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

const StatutBadge = ({ statut }: { statut: string }) => {
  const styles = {
    SUBMITTED: 'bg-amber-100 text-amber-700',
    APPROVED: 'bg-lime-100 text-lime-700',
    REJECTED: 'bg-rose-100 text-rose-700',
    REIMBURSED: 'bg-indigo-100 text-indigo-700',
  }[statut.toUpperCase()] || 'bg-gray-100 text-gray-700';

  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full capitalize ${styles}`}>
      {statut.toLowerCase()}
    </span>
  );
};
