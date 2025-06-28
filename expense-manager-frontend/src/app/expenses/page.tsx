'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/app/components/AdminLayout';
import { useAuth } from '@/app/components/AuthProvider';
import axiosInstance from '@/app/utils/axiosInstance';

type Expense = {
  id: string;
  montant: number;
  devise: string;
  dateDepense: string;
  description: string;
  statut: 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'REIMBURSED';
  user?: {
    prenom: string;
    nom: string;
    email: string;
  };
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();

  const itemsPerPage = 10;

  const fetchExpenses = async () => {
    if (!user?.role) return;
    const endpoint = user.role === 'EMPLOYEE' ? '/expenses/me' : '/expenses';

    try {
      const res = await axiosInstance.get(endpoint);
      setExpenses(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [user?.role]);

  const filteredExpenses = expenses.filter((exp) => {
    const search = searchTerm.toLowerCase();
    return (
      exp.description.toLowerCase().includes(search) ||
      exp.devise.toLowerCase().includes(search) ||
      exp.statut.toLowerCase().includes(search) ||
      (user?.role !== 'EMPLOYEE' &&
        (`${exp.user?.prenom} ${exp.user?.nom}`.toLowerCase().includes(search) ||
          exp.user?.email.toLowerCase().includes(search)))
    );
  });

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const currentExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <AdminLayout>
      <div className="space-y-10 mt-6">
        {/* Header + search + bouton */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-800">
              {user?.role === 'EMPLOYEE' ? 'Mes Dépenses' : 'Toutes les Dépenses'}
            </h1>
            <input
              type="text"
              placeholder="🔍 Rechercher une dépense..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1 px-4 py-2 border border-gray-300 bg-gray-50 rounded-md text-sm w-72 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          {user?.role === 'EMPLOYEE' && (
            <Link
              href="/expenses/new"
              className="bg-gradient-to-r from-lime-400 to-green-400 text-white px-5 py-2 rounded-md shadow-sm hover:from-lime-500 hover:to-green-500 transition"
            >
              + Nouvelle dépense
            </Link>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-gray-500">Chargement...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="overflow-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50 text-sm text-gray-600 font-medium">
                <tr>
                  <th className="px-4 py-3 text-left">Montant</th>
                  <th className="px-4 py-3 text-left">Devise</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  {user?.role !== 'EMPLOYEE' && <th className="px-4 py-3 text-left">Utilisateur</th>}
                  <th className="px-4 py-3 text-left">Statut</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                {currentExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{Number(exp.montant).toFixed(2)}</td>
                    <td className="px-4 py-3">{exp.devise}</td>
                    <td className="px-4 py-3">
                      {new Date(exp.dateDepense).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate">
                      {exp.description}
                    </td>
                    {user?.role !== 'EMPLOYEE' && (
                      <td className="px-4 py-3">
                        <p>
                          {exp.user?.prenom} {exp.user?.nom}
                        </p>
                        <p className="text-xs text-gray-500">{exp.user?.email}</p>
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <StatutBadge statut={exp.statut} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/expenses/${exp.id}`}
                        className="text-indigo-600 hover:underline text-sm"
                      >
                        Voir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              ← Précédent
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === i + 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-100 hover:bg-indigo-200'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Suivant →
            </button>
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
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${styles}`}
    >
      {statut.toLowerCase()}
    </span>
  );
};
