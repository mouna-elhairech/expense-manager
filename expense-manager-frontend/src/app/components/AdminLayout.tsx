'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import useUnreadNotifications from '@/app/hooks/useUnreadNotifications';

import {
  Home,
  Users,
  Wallet,
  PlusCircle,
  FileBarChart2,
  Settings,
  LogOut,
  ClipboardCheck,
  User as UserIcon,
  Bell,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const role = user?.role || 'EMPLOYEE';
  const unreadCount = useUnreadNotifications();

  const navItems = [
    { href: '/dashboard', label: 'Accueil', icon: <Home size={20} />, roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { href: '/admin/users', label: 'Utilisateurs', icon: <Users size={20} />, roles: ['ADMIN'] },
    { href: '/expenses', label: 'Dépenses', icon: <Wallet size={20} />, roles: ['EMPLOYEE'] },
    { href: '/expenses/new', label: 'Ajouter Dépense', icon: <PlusCircle size={20} />, roles: ['EMPLOYEE'] },
    { href: '/reimbursements', label: 'Toutes les Demandes', icon: <FileBarChart2 size={20} />, roles: ['MANAGER'] },
    { href: '/reimbursements/new', label: 'Nouvelle Demande', icon: <FileBarChart2 size={20} />, roles: ['EMPLOYEE'] },
    { href: '/reimbursements/my', label: 'Mes Demandes', icon: <Wallet size={20} />, roles: ['EMPLOYEE'] },
    { href: '/approvals/reimbursements', label: 'Valider Demandes', icon: <ClipboardCheck size={20} />, roles: ['MANAGER'] },
    { href: '/reports', label: 'Rapports', icon: <FileBarChart2 size={20} />, roles: ['MANAGER', 'ADMIN'] },
    {
      href: '/notifications',
      label: (
        <span className="flex items-center gap-2">
          Notifications
          {unreadCount > 0 && (
            <span className="ml-1 text-xs bg-violet-100 text-violet-700 font-medium rounded-full px-2 py-0.5">
              {unreadCount}
            </span>
          )}
        </span>
      ),
      icon: <Bell size={20} />,
      roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
    },
    { href: '/profile', label: 'Mon compte', icon: <UserIcon size={20} />, roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'w-72' : 'w-20'
        } bg-white border-r border-gray-100 shadow-md text-gray-800 flex flex-col justify-between transition-all duration-300`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <Image
              src="/logo-removebg-preview.png"
              alt="ExpenSync Logo"
              width={isOpen ? 80 : 40}
              height={isOpen ? 80 : 40}
              priority
            />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              ☰
            </button>
          </div>

          <nav className="mt-8 space-y-1">
            {navItems
              .filter((item) => item.roles.includes(role))
              .map((item) => (
                <Link
                  key={typeof item.label === 'string' ? item.label : item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition group ${
                    pathname.startsWith(item.href)
                      ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-500'
                      : 'hover:bg-blue-50 text-gray-700'
                  }`}
                >
                  {item.icon}
                  {isOpen && <span className="truncate">{item.label}</span>}
                </Link>
              ))}
          </nav>
        </div>

        {/* Footer utilisateur */}
        <div className="border-t border-gray-100 p-4">
          {user && (
            <div className="text-sm text-gray-700 mb-3">
              <p className="font-bold leading-tight">{user.prenom || user.email}</p>
              {isOpen && <p className="text-xs text-gray-500">{role}</p>}
            </div>
          )}

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-rose-100 hover:bg-rose-200 text-rose-600 px-4 py-2 rounded-md text-sm font-semibold transition"
          >
            <LogOut size={18} /> {isOpen && 'Déconnexion'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gradient-to-b from-white to-blue-50 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
