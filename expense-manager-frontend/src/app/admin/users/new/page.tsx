'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import AdminLayout from '@/app/components/AdminLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleIds: string[];
};

type Role = {
  id: string;
  nom: string;
};

export default function CreateUserPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/roles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setRoles(data);
    };

    fetchRoles();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(errorMessage);
      }

      toast.success(' Utilisateur créé avec succès');
      reset();
      setTimeout(() => router.push('/admin/users'), 1000);
    } catch (err: any) {
      toast.error(' Erreur : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Créer un nouvel utilisateur</h1>
          <Button variant="outline" asChild>
            <a href="/admin/users">← Retour</a>
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white/70 backdrop-blur-sm border border-gray-200 p-6 rounded-xl shadow-md">
          <div className="space-y-2">
            <Label>Prénom</Label>
            <Input
              {...register('firstName', { required: 'Prénom requis' })}
              placeholder="Mouna"
            />
            {errors.firstName && <p className="text-sm text-rose-600">{errors.firstName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Nom</Label>
            <Input
              {...register('lastName', { required: 'Nom requis' })}
              placeholder="El Hairech"
            />
            {errors.lastName && <p className="text-sm text-rose-600">{errors.lastName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              {...register('email', {
                required: 'Email requis',
                pattern: { value: /^\S+@\S+$/, message: 'Email invalide' },
              })}
              placeholder="exemple@domaine.com"
            />
            {errors.email && <p className="text-sm text-rose-600">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Mot de passe</Label>
            <Input
              type="password"
              {...register('password', {
                required: 'Mot de passe requis',
                minLength: { value: 8, message: 'Minimum 8 caractères' },
              })}
              placeholder="********"
            />
            {errors.password && <p className="text-sm text-rose-600">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Rôle(s)</Label>
            <select
              multiple
              {...register('roleIds', { required: 'Sélectionnez au moins un rôle' })}
              className="w-full rounded-md border border-gray-300 p-2 bg-white"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.nom}
                </option>
              ))}
            </select>
            {errors.roleIds && <p className="text-sm text-rose-600">{errors.roleIds.message}</p>}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Création...
              </div>
            ) : (
              'Créer l’utilisateur'
            )}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
}
