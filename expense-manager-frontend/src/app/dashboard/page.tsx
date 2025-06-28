'use client';

import React from 'react';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { useAuth } from '@/app/components/AuthProvider';
import AdminLayout from '@/app/components/AdminLayout';
import AdminDashboard from '@/app/components/AdminDashboard';
import ManagerDashboard from '@/app/components/ManagerDashboard';
import EmployeeDashboard from '@/app/components/EmployeeDashboard';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

const DashboardContent = () => {
  const { user } = useAuth();
  const role = user?.role || 'EMPLOYEE';

  return (
    <AdminLayout>
      <div className="space-y-6 mt-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-gray-800">Tableau de bord</h1>
          <p className="text-gray-600">
            Connecté en tant que <span className="font-medium">{role}</span>
            {user?.prenom && <> — {user.prenom}</>}.
          </p>
        </div>

        <div className="mt-6">
          {role === 'ADMIN' && <AdminDashboard />}
          {role === 'MANAGER' && <ManagerDashboard />}
          {role === 'EMPLOYEE' && <EmployeeDashboard />}
        </div>
      </div>
    </AdminLayout>
  );
};
