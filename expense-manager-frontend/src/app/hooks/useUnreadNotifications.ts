'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/app/utils/axiosInstance';

export default function useUnreadNotifications() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axiosInstance.get('/notifications/me');
        const nonLues = res.data.filter((n: any) => !n.estLue);
        setCount(nonLues.length);
      } catch (err) {
        console.error('Erreur chargement notifications', err);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 60_000); // refresh chaque 60s

    return () => clearInterval(interval);
  }, []);

  return count;
}
