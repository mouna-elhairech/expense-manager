'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from '@/app/utils/axiosInstance';
import { motion } from 'framer-motion';

interface FormValues {
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      await axios.post('/reset/reset-password', {
        token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      setSuccess(true);
      setTimeout(() => push('/login'), 2500);
    } catch (err) {
      console.error('Erreur lors de la réinitialisation :', err);
    }
  };

  if (!token) {
    return (
      <p className="text-center text-red-600 mt-20 font-semibold">
         Lien de réinitialisation invalide ou expiré.
      </p>
    );
  }

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-white/30 backdrop-blur-xl border border-white/30 shadow-xl rounded-3xl p-8 w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-6"> Nouveau mot de passe</h2>

        {success ? (
          <p className="text-green-700 text-center font-medium">
             Mot de passe mis à jour. Redirection vers la connexion...
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Nouveau mot de passe</label>
              <input
                type="password"
                {...register('newPassword', {
                  required: 'Champ requis',
                  minLength: { value: 6, message: '6 caractères minimum' },
                })}
                className={`w-full px-4 py-2 rounded-lg border bg-white/60 focus:outline-none focus:ring-2 ${
                  errors.newPassword ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-300'
                }`}
                placeholder="••••••••"
              />
              {errors.newPassword && (
                <p className="text-sm text-red-600 mt-1">{errors.newPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
              <input
                type="password"
                {...register('confirmPassword', {
                  required: 'Champ requis',
                  validate: (value) =>
                    value === watch('newPassword') || 'Les mots de passe ne correspondent pas',
                })}
                className={`w-full px-4 py-2 rounded-lg border bg-white/60 focus:outline-none focus:ring-2 ${
                  errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-300'
                }`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              {isSubmitting ? 'Mise à jour...' : 'Réinitialiser'}
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
}
