'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/app/components/AdminLayout';
import axios from '@/app/utils/axiosInstance';
import { toast } from 'react-toastify';
import { useAuth } from '@/app/components/AuthProvider';
import Link from 'next/link';

interface Reimbursement {
  id: string;
  montantTotal: number | string;
  statut: string;
  dateCreation: string;
  notes?: string;
  depenses: {
    user: {
      prenom: string;
      nom: string;
    };
  }[];
}

export default function ApprovalsReimbursementsPage() {
  const [requests, setRequests] = useState<Reimbursement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    axios
      .get('/reimbursements')
      .then((res) => {
        const pendingOnly = res.data.filter((r: Reimbursement) => r.statut === 'PENDING');
        setRequests(pendingOnly);
      })
      .catch(() => toast.error('Erreur lors du chargement'))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (id: string, statut: 'APPROVED' | 'REJECTED') => {
    if (!user?.id) {
      toast.error("Utilisateur non connecté");
      return;
    }

    try {
      await axios.patch(`/reimbursements/${id}`, {
        statut,
        approvedBy: user.id,
      });

      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast.success(`Demande ${statut === 'APPROVED' ? 'approuvée' : 'rejetée'} avec succès`);
    } catch {
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('fr-FR', { dateStyle: 'medium' });

  const formatMontant = (value: number | string): string => {
    const parsed = typeof value === 'number' ? value : parseFloat(value);
    return isNaN(parsed) ? '0.00' : parsed.toFixed(2);
  };

  return (
    <AdminLayout>
      <main className="p-6 max-w-5xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-gray-800">Demandes de remboursement à valider</h1>

        {loading ? (
          <p className="text-gray-500">Chargement...</p>
        ) : requests.length === 0 ? (
          <p className="text-sm text-gray-500 italic">Aucune demande en attente.</p>
        ) : (
          <div className="space-y-5">
            {requests.map((r) => (
              <div
                key={r.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-5"
              >
                <div className="flex justify-between gap-6">
                  {/* Info employé + contenu */}
                  <Link href={`/reimbursements/${r.id}`} className="flex-1 space-y-1">
                    <p className="text-lg font-semibold text-indigo-700">
                      {formatMontant(r.montantTotal)} MAD
                    </p>
                    <p className="text-sm text-gray-600">
                      Créée le : {formatDate(r.dateCreation)}
                    </p>
                    {r.notes && (
                      <p className="text-sm text-gray-700 italic">Notes : {r.notes}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      Employé : {r.depenses[0]?.user?.prenom} {r.depenses[0]?.user?.nom}
                    </p>
                  </Link>

                  {/* Actions */}
                  <div className="flex flex-col justify-center gap-2 min-w-[120px]">
                    <button
                      onClick={() => handleUpdate(r.id, 'APPROVED')}
                      className="w-full bg-lime-600 text-white py-1.5 rounded-md text-sm hover:bg-lime-700 transition"
                    >
                      Approuver
                    </button>
                    <button
                      onClick={() => handleUpdate(r.id, 'REJECTED')}
                      className="w-full bg-rose-600 text-white py-1.5 rounded-md text-sm hover:bg-rose-700 transition"
                    >
                      Rejeter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </AdminLayout>
  );
}
