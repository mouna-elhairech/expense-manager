'use client';

import AdminLayout from './AdminLayout';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
