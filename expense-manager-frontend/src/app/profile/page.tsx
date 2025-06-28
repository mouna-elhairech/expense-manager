'use client';

import { useAuth } from '@/app/components/AuthProvider';
import AdminLayout from '@/app/components/AdminLayout';
import { useState } from 'react';
import { Mail, User2, BadgeCheck, UploadCloud, Lock, Eye, EyeOff } from 'lucide-react';
import axios from '@/app/utils/axiosInstance';

export default function ProfilePage() {
  const { user } = useAuth();
  const [image, setImage] = useState<string | null>(null);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('❌ Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      await axios.patch('/auth/change-password', {
        oldPassword,
        newPassword,
      });
      setMessage(' Mot de passe modifié avec succès');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage(` ${err.response?.data?.message || 'Erreur inconnue'}`);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8 space-y-12">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-800">Mon profil</h1>
          <p className="text-sm text-gray-500">Informations personnelles et sécurité</p>
        </div>

        {/* Photo de profil */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-40 h-40 rounded-full bg-gray-100 overflow-hidden border-2 border-indigo-300 shadow-inner">
            {image ? (
              <img src={image} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                Aucune image
              </div>
            )}
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-indigo-600 hover:underline text-sm font-medium">
            <UploadCloud size={18} />
            Changer la photo
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        {/* Infos utilisateur */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Adresse Email" value={user?.email} icon={<Mail size={18} />} />
          <InputField label="Nom" value={user?.nom || 'Non renseigné'} icon={<User2 size={18} />} />
          <InputField label="Prénom" value={user?.prenom || 'Non renseigné'} icon={<User2 size={18} />} />
          <InputField label="Rôle" value={user?.role} icon={<BadgeCheck size={18} />} />
        </form>

        {/* Changement mot de passe */}
        <div className="pt-6 border-t space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Lock size={20} /> Modifier mon mot de passe
          </h2>

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <PasswordField
              label="Mot de passe actuel"
              value={oldPassword}
              onChange={setOldPassword}
              visible={showOld}
              toggle={() => setShowOld((v) => !v)}
            />
            <PasswordField
              label="Nouveau mot de passe"
              value={newPassword}
              onChange={setNewPassword}
              visible={showNew}
              toggle={() => setShowNew((v) => !v)}
            />
            <PasswordField
              label="Confirmer le nouveau mot de passe"
              value={confirmPassword}
              onChange={setConfirmPassword}
              visible={showConfirm}
              toggle={() => setShowConfirm((v) => !v)}
            />

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded-md transition"
            >
               Modifier mon mot de passe
            </button>

            {message && (
              <p className="mt-2 text-center text-sm font-medium text-blue-600">{message}</p>
            )}
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

function InputField({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-600 flex items-center gap-2">
        {icon} {label}
      </label>
      <input
        type="text"
        value={value || ''}
        readOnly
        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800 shadow-sm focus:outline-none"
      />
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  visible,
  toggle,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  visible: boolean;
  toggle: () => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border rounded-md bg-white pr-10 shadow-sm"
          required
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
