'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { TrendingUp, LogOut, Loader2, CalendarDays } from 'lucide-react';

export default function SalesLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [rep, setRep] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (pathname === '/sales/login' || pathname === '/login') { setChecking(false); return; }
    fetch('/api/sales/my-leads')
      .then(r => {
        if (r.status === 401) { router.replace('/sales/login'); return null; }
        return r.json();
      })
      .then(data => { if (data) setRep(data.rep); })
      .catch(() => router.replace('/sales/login'))
      .finally(() => setChecking(false));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/sales-session', { method: 'DELETE' });
    router.replace('/sales/login');
  };

  if (pathname === '/sales/login' || pathname === '/login') return <>{children}</>;

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-offwhite">
        <Loader2 className="w-6 h-6 animate-spin text-copper" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite">
      {/* Top nav */}
      <header className="bg-charcoal text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-copper rounded-sm flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm leading-none">RoomService AI</p>
            <p className="text-xs text-gray-400">Sales Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/sales/calendar"
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              pathname?.startsWith('/sales/calendar') ? 'text-white' : 'text-gray-300 hover:text-white'
            }`}
          >
            <CalendarDays className="w-4 h-4" /> Calendar
          </Link>
          <Link
            href="/sales"
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              pathname === '/sales' ? 'text-white' : 'text-gray-300 hover:text-white'
            }`}
          >
            My Leads
          </Link>
          {rep && <p className="text-sm text-gray-300 border-l border-gray-600 pl-4">Hi, <span className="text-white font-medium">{rep.name}</span></p>}
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
