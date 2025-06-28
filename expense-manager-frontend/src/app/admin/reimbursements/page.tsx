'use client';

import AdminLayout from '@/app/components/AdminLayout';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';

type Demande = {
  id: string;
  montantTotal: number;
  statut: string;
  dateCreation: string;
  employe: {
    prenom: string;
    nom: string;
    email: string;
  };
};

export default function AdminReimbursementsPage() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:3000/reimbursements', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setDemandes(data);
    } catch (err) {
      toast.error('Erreur lors du chargement');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatut = async (id: string, statut: 'APPROVED' | 'REJECTED') => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/reimbursements/${id}/statut`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ statut }),
      });

      if (!res.ok) throw new Error('Échec de la mise à jour');
      toast.success(`Demande ${statut === 'APPROVED' ? 'validée' : 'rejetée'} avec succès`);
      fetchData();
    } catch (err) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Demandes de remboursement</h1>

        {demandes.length === 0 ? (
          <p className="text-gray-500">Aucune demande pour le moment.</p>
        ) : (
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Date</th>
                <th className="p-2">Employé</th>
                <th className="p-2">Montant</th>
                <th className="p-2">Statut</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {demandes.map((d) => (
                <tr key={d.id} className="border-t">
                  <td className="p-2">{new Date(d.dateCreation).toLocaleDateString()}</td>
                  <td className="p-2">
                    {d.employe.prenom} {d.employe.nom} <br />
                    <span className="text-xs text-gray-500">{d.employe.email}</span>
                  </td>
                  <td className="p-2">{d.montantTotal.toFixed(2)} MAD</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs ${
                        d.statut === 'PENDING'
                          ? 'bg-yellow-500'
                          : d.statut === 'APPROVED'
                          ? 'bg-green-600'
                          : d.statut === 'REJECTED'
                          ? 'bg-red-600'
                          : 'bg-gray-500'
                      }`}
                    >
                      {d.statut}
                    </span>
                  </td>
                  <td className="p-2 space-x-2">
                    <Link
                      href={`/reimbursements/${d.id}`}
                      className="text-blue-600 underline"
                    >
                      Voir
                    </Link>
                    {d.statut === 'PENDING' && (
                      <>
                        <button
                          onClick={() => updateStatut(d.id, 'APPROVED')}
                          className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                          disabled={loading}
                        >
                          Valider
                        </button>
                        <button
                          onClick={() => updateStatut(d.id, 'REJECTED')}
                          className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                          disabled={loading}
                        >
                          Rejeter
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </AdminLayout>
  );
}
