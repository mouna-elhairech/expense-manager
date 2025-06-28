'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LoginForm from '@/app/components/LoginForm';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 shadow-md rounded-xl p-8">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo-removebg-preview.png"
            alt="ExpenSync Logo"
            width={64}
            height={64}
          />
        </div>

        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}
