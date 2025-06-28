'use client';

import { useState } from 'react';
import AdminLayout from '@/app/components/AdminLayout';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

interface ReportItem {
  montant: number | string;
  devise: string;
  dateDepense: string;
  description: string;
  statut: string;
  categorie?: { nom: string };
  user?: { nom: string; prenom: string };
}

export default function ReportsPage() {
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [statut, setStatut] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [reportData, setReportData] = useState<ReportItem[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setReportData([]);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token manquant');

      const res = await fetch('http://localhost:3000/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dateDebut, dateFin, statut }),
      });

      if (!res.ok) throw new Error('Erreur lors de la génération du rapport');

      const data = await res.json();
      setReportData(data);
      setMessage(` ${data.length} dépenses trouvées`);
    } catch (err: any) {
      setMessage(` Erreur : ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Rapport de dépenses', 14, 14);
    autoTable(doc, {
      startY: 20,
      head: [['Montant', 'Devise', 'Date', 'Description', 'Utilisateur', 'Statut']],
      body: reportData.map(dep => [
        Number(dep.montant).toFixed(2),
        dep.devise,
        new Date(dep.dateDepense).toLocaleDateString('fr-FR'),
        dep.description,
        dep.user ? `${dep.user.prenom} ${dep.user.nom}` : '',
        dep.statut,
      ]),
    });
    doc.save('rapport_depenses.pdf');
  };

  const categoryData = Object.entries(
    reportData.reduce((acc, dep) => {
      const cat = dep.categorie?.nom || 'Inconnue';
      acc[cat] = (acc[cat] || 0) + Number(dep.montant || 0);
      return acc;
    }, {} as Record<string, number>)
  ).map(([categorie, total]) => ({ categorie, total }));

  const totalMontant = Number(
    reportData.reduce((sum, dep) => sum + Number(dep.montant || 0), 0)
  );

  return (
    <AdminLayout>
      <div className="p-6 space-y-10 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800">Rapports de dépenses</h1>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 border border-gray-200 rounded-xl shadow-sm"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
            <input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
            <input
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              value={statut}
              onChange={(e) => setStatut(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
              required
            >
              <option value="">-- Choisir un statut --</option>
              <option value="SUBMITTED">Soumise</option>
              <option value="APPROVED">Approuvée</option>
              <option value="REJECTED">Rejetée</option>
              <option value="REIMBURSED">Remboursée</option>
            </select>
          </div>

          <div className="md:col-span-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Génération...' : 'Générer le rapport'}
            </button>
          </div>
        </form>

        {/* Message */}
        {message && (
          <p className="text-center font-medium text-sm text-green-600">{message}</p>
        )}

        {/* Résumé */}
        {reportData.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow text-center space-y-2">
            <p className="text-lg font-semibold text-gray-800">
              Total : <span className="text-indigo-600">{totalMontant.toFixed(2)} €</span>
            </p>
            <p className="text-sm text-gray-500">
              Nombre de dépenses : {reportData.length}
            </p>
            <button
              onClick={handleDownloadPDF}
              className="mt-2 bg-lime-600 hover:bg-lime-700 text-white py-2 px-4 rounded transition"
            >
              Télécharger en PDF
            </button>
          </div>
        )}

        {/* Graphique */}
        {categoryData.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Dépenses par catégorie
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categorie" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Tableau HTML */}
        {reportData.length > 0 && (
          <div className="mt-10 overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-300 bg-white rounded">
              <thead className="bg-gray-100 text-gray-700 font-medium">
                <tr>
                  <th className="px-4 py-2 text-left">Montant</th>
                  <th className="px-4 py-2 text-left">Devise</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Utilisateur</th>
                  <th className="px-4 py-2 text-left">Statut</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((dep, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2">{Number(dep.montant).toFixed(2)}</td>
                    <td className="px-4 py-2">{dep.devise}</td>
                    <td className="px-4 py-2">{new Date(dep.dateDepense).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{dep.description}</td>
                    <td className="px-4 py-2">
                      {dep.user ? `${dep.user.prenom} ${dep.user.nom}` : ''}
                    </td>
                    <td className="px-4 py-2">{dep.statut}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
