'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function NewReimbursementPage() {
  const [expenses, setExpenses] = useState<Depense[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const router = useRouter();

  useEffect(() => {
    axios
      .get('/expenses/me?statut=SUBMITTED')
      .then((res) => setExpenses(res.data))
      .catch((err) => {
        console.error('Erreur chargement dépenses:', err);
        toast.error('Impossible de charger vos dépenses soumises.');
      });
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selectedIds.length === 0) {
      toast.warn('Veuillez sélectionner au moins une dépense.');
      return;
    }

    try {
      await axios.post('/reimbursements', {
        depenses: selectedIds,
        notes,
      });
      toast.success(' Demande soumise avec succès.');
      router.push('/reimbursements/my');
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || 'Erreur inattendue lors de la création';
      toast.error(' ' + msg);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-800">Nouvelle demande de remboursement</h1>
          <p className="text-gray-500 text-sm">
            Sélectionnez les dépenses que vous souhaitez soumettre à validation.
          </p>
        </div>

        {/* Zone Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Note (optionnelle)</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex : Ces dépenses concernent mon déplacement à Casablanca."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        {/* Dépenses disponibles */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Dépenses soumises disponibles</h2>

          {expenses.length === 0 ? (
            <p className="text-gray-500 text-sm italic">Aucune dépense soumise trouvée.</p>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <label
                  key={expense.id}
                  className={`flex items-start gap-4 border p-4 rounded-md cursor-pointer shadow-sm hover:bg-gray-50 transition ${
                    selectedIds.includes(expense.id) ? 'ring-2 ring-indigo-300' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(expense.id)}
                    onChange={() => toggleSelect(expense.id)}
                    className="mt-1 accent-indigo-600"
                  />
                  <div className="text-sm space-y-1 text-gray-700">
                    <p className="font-medium">
                      {Number(expense.montant).toFixed(2)} {expense.devise}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {new Date(expense.dateDepense).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-gray-600">{expense.description}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Soumettre */}
        <div className="pt-4">
          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium transition disabled:opacity-50"
          >
            ➕ Soumettre la demande
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
