'use client';

import { useEffect, useState } from 'react';
import axios from '@/app/utils/axiosInstance';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ManagerStats {
  totalPending: number;
  montantPending: number;
  countByStatut: Record<string, number>;
  lastSubmissions: {
    id: string;
    montant: number;
    dateDepense: string;
    statut: string;
    user: {
      prenom: string;
      nom: string;
      email: string;
    };
  }[];
}

export default function ManagerDashboard() {
  const [stats, setStats] = useState<ManagerStats | null>(null);

  useEffect(() => {
    axios
      .get('/expenses/manager/stats')
      .then((res) => setStats(res.data))
      .catch(() => setStats(null));
  }, []);

  if (!stats) {
    return <p className="text-gray-500 text-sm mt-4">Chargement des statistiques en cours...</p>;
  }

  return (
    <div className="space-y-12 mt-6">
      <h2 className="text-2xl font-semibold text-gray-800"></h2>

      {/* Résumé haut */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Dépenses à valider" value={stats.totalPending} color="bg-rose-100" />
        <StatCard label="Montant en attente" value={`${stats.montantPending.toFixed(2)} MAD`} color="bg-indigo-100" />
      </div>

      {/* Compteurs par statut */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Répartition des statuts</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.countByStatut).map(([statut, count]) => (
            <div
              key={statut}
              className="bg-white border border-gray-200 rounded-lg p-4 text-center shadow-sm hover:shadow transition"
            >
              <p className="text-sm text-gray-500 capitalize">{statut.toLowerCase()}</p>
              <p className="text-xl font-bold text-gray-800">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dernières soumissions */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-5">Dernières dépenses soumises</h3>
        <ul className="space-y-5">
          {stats.lastSubmissions.map((e) => (
            <li key={e.id} className="flex flex-col md:flex-row md:justify-between md:items-center border-b pb-4 last:border-0 gap-2">
              <div className="space-y-1">
                <p className="font-medium text-gray-900">
                  {e.user.prenom} {e.user.nom}
                </p>
                <p className="text-sm text-gray-500">{e.user.email}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm font-semibold text-indigo-700">{e.montant.toFixed(2)} MAD</p>
                <p className="text-xs text-gray-500">
                  {format(new Date(e.dateDepense), 'dd MMM yyyy', { locale: fr })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Composant Statistique
const StatCard = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) => (
  <div
    className={`rounded-xl p-6 text-center border border-gray-200 shadow-sm hover:shadow-md transition ${color}`}
  >
    <p className="text-sm text-gray-600 mb-2">{label}</p>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);
