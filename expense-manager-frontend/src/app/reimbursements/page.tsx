'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/app/components/AdminLayout';
import axios from '@/app/utils/axiosInstance';
import { toast } from 'react-toastify';

interface Depense {
  id: string;
  montant: number;
  devise: string;
  dateDepense: string;
  description: string;
}

interface ReimbursementRequest {
  id: string;
  statut: string;
  montantTotal: number | string;
  dateCreation: string;
  notes?: string;
  depenses: Depense[];
}

export default function ReimbursementsManagerPage() {
  const [requests, setRequests] = useState<ReimbursementRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/reimbursements')
      .then((res) => setRequests(res.data))
      .catch(() => toast.error('Erreur lors du chargement des demandes'))
      .finally(() => setLoading(false));
  }, []);

  const formatMontant = (val: number | string) => {
    const montant = typeof val === 'number' ? val : parseFloat(val);
    return isNaN(montant) ? '0.00' : montant.toFixed(2);
  };

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

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { dateStyle: 'medium' });

  return (
    <AdminLayout>
      <main className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-800">
            Toutes les demandes de remboursement
          </h1>
          <p className="text-sm text-gray-500">Demandes soumises par les employés.</p>
        </div>

        {loading ? (
          <p className="text-gray-500">Chargement...</p>
        ) : requests.length === 0 ? (
          <p className="text-sm text-gray-500 italic">Aucune demande trouvée.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-semibold text-indigo-700">
                    {formatMontant(req.montantTotal)} MAD
                  </p>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${badgeClass(
                      req.statut
                    )}`}
                  >
                    {req.statut.toLowerCase()}
                  </span>
                </div>

                <p className="text-sm text-gray-500">
                  Créée le : {formatDate(req.dateCreation)}
                </p>

                {req.notes && (
                  <p className="text-sm italic text-gray-700 mt-1">
                    Note : {req.notes}
                  </p>
                )}

                <p className="text-sm text-gray-500 mt-2">
                  {req.depenses.length} dépense(s) incluse(s)
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </AdminLayout>
  );
}
