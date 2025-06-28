'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Tesseract from 'tesseract.js';
import { toast } from 'react-toastify';

type FormData = {
  montant: number;
  devise: string;
  dateDepense: string;
  description: string;
};

export default function OCRTestPage() {
  const [file, setFile] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [ocrLoading, setOcrLoading] = useState(false);
  const { register, setValue, handleSubmit } = useForm<FormData>();

  function analyserTexteOCR(text: string) {
    const result: { montant?: number; devise?: string; date?: string } = {};

    // 💵 MONTANT
    let montantMatch =
      text.match(/\((\d{1,5}[.,]\d{2})\)[^\d]*[€$DHS]?/) ||
      text.match(/(?:total|montant|somme)[^\d]{0,15}(\d{1,5}[.,]\d{2})/i) ||
      text.match(/(\d{1,5}[.,]\d{2})\s?(€|\$|dhs)?/i);
    if (montantMatch) {
      result.montant = parseFloat(montantMatch[1].replace(',', '.'));
    }

    // 💱 DEVISE (version améliorée)
    const deviseMatch = text.match(/\b(MAD|EUR|USD|CAD|DHS|DH|DIRHAMS?|\$|€|dollars?)\b/i);
    if (deviseMatch) {
      const d = deviseMatch[1].toUpperCase();
      result.devise =
        ['$', 'DOLLARS', 'USD'].includes(d) ? 'USD' :
        ['€', 'EUR'].includes(d) ? 'EUR' :
        ['MAD', 'DHS', 'DH', 'DIRHAMS'].includes(d) ? 'MAD' :
        d;
    }

    // 📅 DATE
    const mois: Record<string, string> = {
      janvier: '01', février: '02', mars: '03', avril: '04', mai: '05',
      juin: '06', juillet: '07', août: '08', septembre: '09',
      octobre: '10', novembre: '11', décembre: '12',
    };

    const dateFrMatch = text.match(/(?:date[:\s]*)?(1er|\d{1,2})[\s\-\/]?(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)[^\d]{0,5}(\d{4})/i);
    const dateStdMatch = text.match(/(?:date[:\s]*)?(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);

    if (dateFrMatch) {
      const jour = dateFrMatch[1] === '1er' ? '01' : dateFrMatch[1].padStart(2, '0');
      const moisNum = mois[dateFrMatch[2].toLowerCase()];
      const annee = dateFrMatch[3];
      if (moisNum) result.date = `${annee}-${moisNum}-${jour}`;
    } else if (dateStdMatch) {
      const d = dateStdMatch;
      const jour = d[1].padStart(2, '0');
      const mois = d[2].padStart(2, '0');
      const annee = d[3].length === 2 ? `20${d[3]}` : d[3];
      result.date = `${annee}-${mois}-${jour}`;
    }

    return result;
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setOcrLoading(true);
    setOcrText('');

    const { data } = await Tesseract.recognize(selected, 'eng', {
      logger: m => console.log(m),
    });

    const text = data.text;
    setOcrText(text);

    const analyse = analyserTexteOCR(text);
    if (analyse.montant) setValue('montant', analyse.montant);
    if (analyse.devise) setValue('devise', analyse.devise);
    if (analyse.date) setValue('dateDepense', analyse.date);
    setValue('description', text.slice(0, 300));

    toast.success('✅ OCR terminé');
    setOcrLoading(false);
  };

  const onSubmit = (data: FormData) => {
    console.log('📦 Données prêtes à enregistrer :', data);
    toast.success('✅ Dépense prête à être enregistrée');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">📄 OCR – Détection complète</h1>

      <div className="bg-gray-50 border rounded p-4">
        <label className="font-medium">📤 Importer un reçu</label>
        <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2" />
        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="reçu"
            className="mt-4 max-h-64 rounded border"
          />
        )}
        {ocrLoading && <p className="text-blue-600 mt-2">🔍 Lecture OCR en cours...</p>}
      </div>

      {ocrText && (
        <div className="bg-white border p-4 rounded">
          <h2 className="font-medium mb-2">🧾 Texte OCR brut :</h2>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">{ocrText}</pre>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold">📑 Données extraites</h2>

        <div>
          <label className="block mb-1 font-medium">Montant</label>
          <input
            type="number"
            step="0.01"
            {...register('montant')}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Devise</label>
          <select {...register('devise')} className="w-full border border-gray-300 p-2 rounded">
            <option value="">-- Sélectionnez --</option>
            <option value="MAD">MAD</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Date</label>
          <input
            type="date"
            {...register('dateDepense')}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            {...register('description')}
            className="w-full border border-gray-300 p-2 rounded"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ✅ Enregistrer la dépense
        </button>
      </form>
    </div>
  );
}
