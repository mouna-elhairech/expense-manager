'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/app/components/AdminLayout';
import axios from '@/app/utils/axiosInstance';
import Link from 'next/link';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaBell,
  FaCommentDots,
  FaPaperPlane,
} from 'react-icons/fa';

interface Notification {
  id: string;
  contenu: string;
  type: string;
  estLue: boolean;
  dateCreation: string;
  targetUrl: string | null;
}

const typeIcons: Record<string, React.ReactNode> = {
  APPROVAL: <FaCheckCircle className="text-lime-600" />,
  REJECTION: <FaTimesCircle className="text-rose-600" />,
  COMMENT: <FaCommentDots className="text-yellow-600" />,
  REIMBURSEMENT: <FaPaperPlane className="text-indigo-600" />,
  REMINDER: <FaBell className="text-purple-600" />,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/notifications/me')
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error('Erreur chargement notifications:', err))
      .finally(() => setLoading(false));
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await axios.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, estLue: true } : n))
      );
    } catch {
      console.warn("Impossible de marquer la notification comme lue.");
    }
  };

  return (
    <AdminLayout>
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <h1 className="text-2xl font-bold text-gray-800">Mes notifications</h1>

        {loading ? (
          <p className="text-gray-500">Chargement...</p>
        ) : notifications.length === 0 ? (
          <p className="text-sm text-gray-500 italic">Aucune notification trouvée.</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((notif) => {
              const icon = typeIcons[notif.type] || <FaBell className="text-gray-400" />;
              const isRead = notif.estLue;

              return (
                <li
                  key={notif.id}
                  className={`flex items-start gap-4 p-4 border rounded-lg shadow-sm transition ${
                    isRead
                      ? 'bg-gray-50 text-gray-600'
                      : 'bg-blue-50 border-blue-300 text-blue-900'
                  }`}
                >
                  <div className="text-xl pt-1 shrink-0">{icon}</div>

                  {notif.targetUrl ? (
                    <Link
                      href={notif.targetUrl}
                      onClick={() => markAsRead(notif.id)}
                      className="flex-1 hover:underline"
                    >
                      <p className="font-medium">{notif.contenu}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notif.dateCreation).toLocaleString('fr-FR')}
                      </p>
                    </Link>
                  ) : (
                    <div className="flex-1">
                      <p className="font-medium">{notif.contenu}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notif.dateCreation).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </AdminLayout>
  );
}
