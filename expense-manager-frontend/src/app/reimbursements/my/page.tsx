'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/app/components/AdminLayout';
import axios from '@/app/utils/axiosInstance';
import { toast } from 'react-toastify';
import Link from 'next/link';

interface Reimbursement {
  id: string;
  montantTotal: number | string;
  statut: string;
  dateCreation: string;
  notes?: string;
}

export default function MyReimbursementsPage() {
  const [requests, setRequests] = useState<Reimbursement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/reimbursements/me')
      .then((res) => setRequests(res.data))
      .catch(() => toast.error('Erreur lors du chargement des demandes'))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('fr-FR', { dateStyle: 'medium' });

  const badgeClass = (statut: string) => {
    switch (statut) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-700';
      case 'APPROVED':
        return 'bg-lime-100 text-lime-700';
      case 'REJECTED':
        return 'bg-rose-100 text-rose-700';
      case 'PAID':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatMontant = (value: string | number): string => {
    const montant = typeof value === 'number' ? value : parseFloat(value);
    return isNaN(montant) ? '0.00' : montant.toFixed(2);
  };

  return (
    <AdminLayout>
      <main className="p-6 max-w-5xl mx-auto space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-800">Mes demandes de remboursement</h1>
          <p className="text-sm text-gray-500">
            Suivez ici l'état de vos demandes récentes.
          </p>
        </div>

        {loading ? (
          <p className="text-gray-500">Chargement...</p>
        ) : requests.length === 0 ? (
          <p className="text-sm text-gray-500 italic">Aucune demande trouvée.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((r) => (
              <Link key={r.id} href={`/reimbursements/${r.id}`}>
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer flex justify-between items-center">
                  <div className="space-y-1 text-sm text-gray-700">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatMontant(r.montantTotal)} MAD
                    </p>
                    <p className="text-sm text-gray-500">
                      Créée le {formatDate(r.dateCreation)}
                    </p>
                    {r.notes && (
                      <p className="text-sm italic text-gray-600">Note : {r.notes}</p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${badgeClass(r.statut)}`}
                  >
                    {r.statut.toLowerCase()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </AdminLayout>
  );
}
