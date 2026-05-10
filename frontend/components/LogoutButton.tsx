'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
    >
      [DISCONNECT]
    </button>
  );
}
