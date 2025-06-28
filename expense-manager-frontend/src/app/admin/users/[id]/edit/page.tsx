'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import AdminLayout from '@/app/components/AdminLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

type Role = {
  id: string;
  nom: string;
};

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleIds: string[];
};

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const resUser = await fetch(`http://localhost:3000/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await resUser.json();

      const roleIds = userData.userRoles?.map((ur: any) => ur.role?.id) || [];

      reset({
        id: userData.id,
        firstName: userData.prenom,
        lastName: userData.nom,
        email: userData.email,
        roleIds,
      });

      const resRoles = await fetch('http://localhost:3000/roles', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const roleData = await resRoles.json();
      setRoles(roleData);
      setLoading(false);
    };

    fetchData();
  }, [id, reset]);

  const onSubmit = async (data: User) => {
    setIsSubmitting(true);
    const token = localStorage.getItem('token');

    const res = await fetch(`http://localhost:3000/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    setIsSubmitting(false);

    if (res.ok) {
      toast.success(' Utilisateur mis à jour avec succès');
      router.push('/admin/users');
    } else {
      const errText = await res.text();
      toast.error(' Erreur : ' + errText);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 text-center text-gray-600">Chargement...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Modifier l’utilisateur</h1>
          <Button variant="outline" onClick={() => router.push('/admin/users')}>
            ← Retour
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white/70 backdrop-blur-sm border border-gray-200 p-6 rounded-xl shadow-md">
          <div className="space-y-2">
            <Label>Prénom</Label>
            <Input {...register('firstName', { required: 'Prénom requis' })} />
            {errors.firstName && <p className="text-sm text-rose-600">{errors.firstName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Nom</Label>
            <Input {...register('lastName', { required: 'Nom requis' })} />
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
            />
            {errors.email && <p className="text-sm text-rose-600">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Rôles</Label>
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

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
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
                Enregistrement...
              </div>
            ) : (
              'Enregistrer les modifications'
            )}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
}
