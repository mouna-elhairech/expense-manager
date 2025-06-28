'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/app/utils/axiosInstance';
import AdminLayout from '@/app/components/AdminLayout';
import { useAuth } from '@/app/components/AuthProvider';
import {
  Button
} from '@/components/ui/button';
import {
  Input
} from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

interface UserRole {
  role: {
    nom: string;
  };
}

interface User {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  userRoles?: UserRole[];
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'email' | 'role' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const usersPerPage = 10;
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const timer = setTimeout(() => fetchUsers(), 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading]);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get('/users');
      setUsers(res.data);
    } catch {
      setError('❌ Impossible de charger les utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('❗ Confirmez-vous la suppression de cet utilisateur ?')) return;
    try {
      await axiosInstance.delete(`/users/${userId}`);
      await fetchUsers();
    } catch {
      alert('Erreur lors de la suppression.');
    }
  };

  const handleSort = (field: 'email' | 'role') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredUsers = users.filter((user) =>
    `${user.prenom} ${user.nom} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortField) return 0;
    const fieldA =
      sortField === 'email'
        ? a.email.toLowerCase()
        : a.userRoles?.map((ur) => ur.role?.nom).join(', ').toLowerCase() || '';
    const fieldB =
      sortField === 'email'
        ? b.email.toLowerCase()
        : b.userRoles?.map((ur) => ur.role?.nom).join(', ').toLowerCase() || '';
    return sortOrder === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
  });

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const currentUsers = sortedUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Gestion des utilisateurs</h1>
          <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white">
            <a href="/admin/users/new">+ Ajouter un utilisateur</a>
          </Button>
        </div>

        <Input
          placeholder="🔍 Rechercher un utilisateur..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        {loading ? (
          <p className="text-center text-gray-500">Chargement...</p>
        ) : error ? (
          <p className="text-center text-rose-600">{error}</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead
                    onClick={() => handleSort('email')}
                    className="cursor-pointer"
                  >
                    Email {sortField === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort('role')}
                    className="cursor-pointer"
                  >
                    Rôles {sortField === 'role' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.nom}</TableCell>
                    <TableCell>{user.prenom}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.userRoles?.length
                        ? user.userRoles.map((ur) => ur.role?.nom).join(', ')
                        : 'Aucun rôle'}
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button asChild size="sm" variant="outline" className="text-blue-600 border-blue-400">
                        <a href={`/admin/users/${user.id}/edit`}>Modifier</a>
                      </Button>
                      {user.email !== 'mouna@admin.com' && (
                        <Button
                          size="sm"
                          className="bg-rose-100 text-rose-600 hover:bg-rose-200"
                          onClick={() => handleDelete(user.id)}
                        >
                          Supprimer
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  ← Précédent
                </Button>

                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    size="sm"
                    variant={currentPage === i + 1 ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Suivant →
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
