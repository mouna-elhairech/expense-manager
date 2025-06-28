'use client';

import { useState } from 'react';
import Tesseract from 'tesseract.js';

export default function OCRPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setText('');
  };

  const handleOCR = async () => {
    if (!file) return;
    setLoading(true);

    const { data } = await Tesseract.recognize(file, 'eng', {
      logger: m => console.log(m),
    });

    setText(data.text);
    setLoading(false);
  };

  return (
    <main className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">📄 OCR - Lire un reçu</h1>

      <input type="file" accept="image/*" onChange={handleChange} />
      
      {file && (
        <>
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="mt-4 border w-full max-h-64 object-contain"
          />
          <button
            onClick={handleOCR}
            disabled={loading}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Lecture en cours...' : 'Lire le texte du reçu'}
          </button>
        </>
      )}

      {text && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">📄 Résultat OCR :</h2>
          <textarea
            className="w-full border p-2 rounded"
            rows={10}
            value={text}
            readOnly
          />
        </div>
      )}
    </main>
  );
}
