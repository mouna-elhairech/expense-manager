'use client';

import { useEffect, useState } from 'react';
import { Users, Wallet, BarChart2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [expenseStats, setExpenseStats] = useState<{
    totalCount: number;
    totalAmount: number;
    statusCounts: Record<string, number>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:3000/users/count', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setUserCount)
      .catch(() => setError("Impossible de charger le nombre d'utilisateurs."));

    fetch('http://localhost:3000/expenses/stats', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setExpenseStats)
      .catch(() => setError('Erreur lors du chargement des statistiques de dépenses.'));
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (userCount === null || !expenseStats)
    return (
      <div className="flex items-center gap-2 text-blue-600">
        <Loader2 className="animate-spin" /> Chargement des données...
      </div>
    );

  return (
    <div className="mt-8 space-y-10">
      <h2 className="text-3xl font-semibold text-gray-800">
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          label="Nombre d'utilisateurs"
          value={userCount}
          icon={<Users size={28} />}
          bg="bg-slate-100"
        />
        <StatCard
          label="Nombre total de dépenses"
          value={expenseStats.totalCount}
          icon={<Wallet size={28} />}
          bg="bg-emerald-100"
        />
        <StatCard
          label="Montant cumulé"
          value={`${expenseStats.totalAmount.toFixed(2)} MAD`}
          icon={<BarChart2 size={28} />}
          bg="bg-indigo-100"
        />
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          Répartition des dépenses par statut
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Object.entries(expenseStats.statusCounts).map(([statut, count]) => (
            <div
              key={statut}
              className="bg-white hover:shadow-md transition rounded-lg border border-gray-200 p-4 text-center"
            >
              <p className="text-sm text-gray-500 font-medium mb-1 capitalize">
                {statut.toLowerCase()}
              </p>
              <p className="text-xl font-semibold text-gray-800">{count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const StatCard = ({
  label,
  value,
  icon,
  bg,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  bg: string;
}) => (
  <div
    className={cn(
      'rounded-lg p-6 text-center hover:shadow-md transition border border-gray-200',
      bg
    )}
  >
    <div className="flex justify-center mb-3 text-gray-700">{icon}</div>
    <p className="text-sm text-gray-600 font-medium">{label}</p>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);
