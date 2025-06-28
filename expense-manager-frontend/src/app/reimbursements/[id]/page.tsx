'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/app/components/AdminLayout';
import axios from '@/app/utils/axiosInstance';
import { toast } from 'react-toastify';
import Link from 'next/link';

interface Expense {
  id: string;
  montant: number;
  devise: string;
  dateDepense: string;
  description: string;
}

interface ReimbursementDetail {
  id: string;
  montantTotal: number | string;
  statut: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  notes?: string;
  dateCreation: string;
  depenses: Expense[];
}

export default function ReimbursementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id =
    typeof params.id === 'string'
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : '';

  const [data, setData] = useState<ReimbursementDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`/reimbursements/${id}`)
      .then((res) => setData(res.data))
      .catch(() => toast.error('Erreur lors du chargement des détails'))
      .finally(() => setLoading(false));
  }, [id]);

  const badgeClass = (statut: ReimbursementDetail['statut']) => {
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

  const formatMontant = (value: number | string) => {
    const montant = typeof value === 'number' ? value : parseFloat(value);
    return isNaN(montant) ? '0.00' : montant.toFixed(2);
  };

  const formatDateTime = (date: string) =>
    new Date(date).toLocaleString('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  if (loading) {
    return (
      <AdminLayout>
        <p className="p-6 text-gray-500">Chargement...</p>
      </AdminLayout>
    );
  }

  if (!data) {
    return (
      <AdminLayout>
        <p className="p-6 text-red-600 font-semibold">
           Aucune donnée trouvée pour cette demande.
        </p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <main className="p-6 max-w-3xl mx-auto space-y-8">
        <Link
          href="/reimbursements/my"
          className="inline-block text-sm text-indigo-600 hover:underline"
        >
          ← Retour à mes demandes
        </Link>

        {/* Titre + statut */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Détail de la demande</h1>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${badgeClass(
              data.statut
            )}`}
          >
            {data.statut.toLowerCase()}
          </span>
        </div>

        {/* Bloc informations */}
        <div className="bg-white border border-gray-200 rounded-xl shadow p-5 space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Créée le :</span>{' '}
            {formatDateTime(data.dateCreation)}
          </p>
          <p className="text-lg font-semibold text-gray-800">
            Montant total :{' '}
            <span className="text-indigo-600">
              {formatMontant(data.montantTotal)} MAD
            </span>
          </p>
          {data.notes && (
            <p className="text-sm text-gray-700 italic">📝 Notes : « {data.notes} »</p>
          )}
        </div>

        {/* Dépenses associées */}
        <div className="bg-white border border-gray-200 rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Dépenses associées</h2>
          <ul className="space-y-4">
            {data.depenses.map((d) => (
              <li
                key={d.id}
                className="border rounded-md p-4 bg-gray-50 hover:bg-white transition"
              >
                <Link href={`/expenses/${d.id}`} className="block space-y-1">
                  <p className="text-sm font-medium text-indigo-700 underline">
                    {formatMontant(d.montant)} {d.devise} —{' '}
                    {new Date(d.dateDepense).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-sm text-gray-700">
                    {d.description || <span className="italic text-gray-500">Aucune description</span>}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </AdminLayout>
  );
}
