'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from '@/app/utils/axiosInstance';
import { motion } from 'framer-motion';

interface FormValues {
  email: string;
}

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      await axios.post('/reset/forgot-password', { email: data.email });
      setEmailSent(true);
    } catch (error) {
      console.error('Erreur lors de la demande :', error);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-white/30 backdrop-blur-xl border border-white/30 shadow-xl rounded-3xl p-8 w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-6">
          🔑 Réinitialisation du mot de passe
        </h2>

        {emailSent ? (
          <p className="text-green-700 font-medium text-center">
             Si cet email existe, un lien de réinitialisation a été envoyé.
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <input
                type="email"
                id="email"
                className={`w-full px-4 py-2 rounded-lg border bg-white/60 focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-300'
                }`}
                placeholder="votre.email@example.com"
                {...register('email', {
                  required: "L'email est requis",
                  pattern: {
                    value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                    message: 'Adresse email invalide',
                  },
                })}
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer le lien'}
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
}
