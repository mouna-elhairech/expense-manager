'use client';

import { useEffect, useState } from 'react';
import axios from '@/app/utils/axiosInstance';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Statistiques {
  totalMontant: number;
  countByStatut: Record<string, number>;
  lastExpenses: {
    id: string;
    montant: number;
    dateDepense: string;
    statut: string;
    description: string;
  }[];
}

export default function EmployeeDashboard() {
  const [stats, setStats] = useState<Statistiques | null>(null);

  useEffect(() => {
    axios.get('/expenses/me/stats').then((res) => {
      setStats(res.data);
    });
  }, []);

  if (!stats) {
    return (
      <p className="text-gray-500 text-sm mt-4">
        Chargement de vos données...
      </p>
    );
  }

  return (
    <div className="space-y-12 mt-8">
      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Card
          label="Total des dépenses"
          value={`${stats.totalMontant.toFixed(2)} MAD`}
          color="bg-blue-100"
        />
        {Object.entries(stats.countByStatut).map(([statut, count]) => (
          <Card
            key={statut}
            label={`Dépenses ${statut.toLowerCase()}`}
            value={count}
            color={getStatutColor(statut)}
          />
        ))}
      </div>

      {/* Historique des dernières dépenses */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          Historique des dernières dépenses
        </h3>
        <ul className="space-y-6">
          {stats.lastExpenses.map((dep) => (
            <li
              key={dep.id}
              className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b last:border-none pb-4"
            >
              {/* Colonne gauche : date + statut */}
              <div className="min-w-[150px] space-y-1">
                <p className="text-gray-900 font-medium">
                  {format(new Date(dep.dateDepense), 'dd MMMM yyyy', {
                    locale: fr,
                  })}
                </p>
                <StatutBadge statut={dep.statut} />
              </div>

              {/* Colonne droite : montant + description */}
              <div className="flex-1 space-y-1">
                <p className="text-sm text-gray-800 font-semibold">
                  {parseFloat(dep.montant as any).toFixed(2)} MAD
                </p>
                <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">
                  {dep.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Composant Carte
const Card = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) => (
  <div
    className={`rounded-xl p-6 text-center shadow-sm hover:shadow-md transition border border-gray-200 ${color}`}
  >
    <p className="text-sm text-gray-600 mb-2">{label}</p>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

// Composant Badge Statut
const StatutBadge = ({ statut }: { statut: string }) => {
  const style = {
    APPROVED: 'bg-green-100 text-green-700',
    SUBMITTED: 'bg-yellow-100 text-yellow-800',
    REJECTED: 'bg-red-100 text-red-700',
    REIMBURSED: 'bg-indigo-100 text-indigo-700',
  }[statut.toUpperCase()] || 'bg-gray-100 text-gray-700';

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium uppercase ${style}`}
    >
      {statut.toLowerCase()}
    </span>
  );
};

// Couleurs par statut pour les cartes
const getStatutColor = (statut: string) => {
  switch (statut.toUpperCase()) {
    case 'APPROVED':
      return 'bg-green-100';
    case 'SUBMITTED':
      return 'bg-yellow-100';
    case 'REJECTED':
      return 'bg-red-100';
    case 'REIMBURSED':
      return 'bg-indigo-100';
    default:
      return 'bg-gray-100';
  }
};
