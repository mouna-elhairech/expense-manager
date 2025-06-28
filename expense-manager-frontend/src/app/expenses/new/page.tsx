'use client';

import AdminLayout from '@/app/components/AdminLayout';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Tesseract from 'tesseract.js';
import axiosInstance from '@/app/utils/axiosInstance';
import { useAuth } from '@/app/components/AuthProvider';

type FormData = {
  montant: number;
  devise: string;
  dateDepense: string;
  description: string;
  categorieId?: string;
};

export default function NewExpensePage() {
  const router = useRouter();
  const { user } = useAuth();
  const retourLink = '/expenses';

  const [file, setFile] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [ocrLoading, setOcrLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categorieNom, setCategorieNom] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  function classerCategorieParScore(text: string): string {
    const cleanText = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    const categories: Record<string, string[]> = {
      transport: ['uber', 'taxi', 'train', 'tram', 'oncf', 'bus', 'péage', 'carburant', 'essence'],
      hebergement: ['hotel', 'chambre', 'booking', 'airbnb', 'riad', 'motel', 'nuit'],
      restauration: ['restaurant', 'repas', 'déjeuner', 'dîner', 'pizza', 'café', 'menu'],
    };

    let best = 'autre';
    let score = 0;

    for (const [cat, mots] of Object.entries(categories)) {
      let count = 0;
      for (const mot of mots) {
        if (cleanText.includes(mot)) count++;
      }
      if (count > score) {
        best = cat;
        score = count;
      }
    }

    return best;
  }

  const analyserTexteOCR = (text: string) => {
    const result: Partial<FormData> = {};
    const montantMatch = text.match(/(\d+[.,]\d{2})\s?(MAD|EUR|USD|DHS)?/i);
    if (montantMatch) {
      result.montant = parseFloat(montantMatch[1].replace(',', '.'));
      result.devise = montantMatch[2]?.toUpperCase() || 'MAD';
    }

    const dateMatch = text.match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
    if (dateMatch) {
      result.dateDepense = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;
    }

    return result;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setOcrLoading(true);
    setOcrText('');

    const { data } = await Tesseract.recognize(selected, 'eng', {
      logger: (m) => console.log(m),
    });

    const text = data.text;
    setOcrText(text);

    const analyse = analyserTexteOCR(text);
    if (analyse.montant) setValue('montant', analyse.montant);
    if (analyse.devise) setValue('devise', analyse.devise);
    if (analyse.dateDepense) setValue('dateDepense', analyse.dateDepense);
    setValue('description', text.slice(0, 300));

    const nom = classerCategorieParScore(text);
    try {
      const res = await axiosInstance.get(`/categories/nom/${nom}`);
      if (res.data?.id) {
        setValue('categorieId', res.data.id);
        setCategorieNom(res.data.nom);
      }
    } catch {
      toast.warn('Catégorie non trouvée');
    }

    toast.success(' OCR terminé');
    setOcrLoading(false);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const payload = { ...data, montant: parseFloat(data.montant.toString()) };
      await axiosInstance.post('/expenses', payload);
      toast.success(' Dépense enregistrée');
      reset();
      setFile(null);
      router.push(retourLink);
    } catch (err: any) {
      toast.error('Erreur : ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <main className="p-6 max-w-3xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Ajouter une dépense depuis un reçu</h1>
          <Link
            href={retourLink}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Retour à la liste
          </Link>
        </div>

        {/* Upload OCR */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow space-y-4">
          <label className="font-medium text-gray-700 block">Importer un reçu</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block text-sm"
          />
          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="Aperçu reçu"
              className="max-h-64 mt-2 rounded border"
            />
          )}
          {ocrLoading && <p className="text-sm text-indigo-600">Lecture OCR en cours...</p>}
        </div>

        {ocrText && (
          <div className="bg-gray-50 border border-gray-200 rounded p-4">
            <h3 className="font-medium mb-2 text-gray-700">Texte OCR brut :</h3>
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">{ocrText}</pre>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-6 rounded-xl shadow space-y-5 border border-gray-200"
        >
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Montant</label>
            <input
              type="number"
              step="0.01"
              {...register('montant', { required: 'Montant requis' })}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
            {errors.montant && <p className="text-red-500 text-sm mt-1">{errors.montant.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Devise</label>
            <select {...register('devise', { required: 'Devise requise' })} className="w-full px-3 py-2 border rounded-md text-sm">
              <option value="">-- Sélectionnez --</option>
              <option value="MAD">MAD</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
            {errors.devise && <p className="text-red-500 text-sm mt-1">{errors.devise.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Date</label>
            <input
              type="date"
              {...register('dateDepense', { required: 'Date requise' })}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
            {errors.dateDepense && <p className="text-red-500 text-sm mt-1">{errors.dateDepense.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
            <textarea
              {...register('description', { required: 'Description requise' })}
              rows={3}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <input type="hidden" {...register('categorieId')} />

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Catégorie détectée</label>
            {categorieNom ? (
              <div className="inline-block px-3 py-1 bg-lime-100 text-lime-800 rounded-full text-sm font-medium">
                {categorieNom}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Aucune catégorie détectée</p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : 'Ajouter la dépense'}
            </button>
          </div>
        </form>
      </main>
    </AdminLayout>
  );
}
