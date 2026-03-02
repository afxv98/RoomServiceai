'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, TrendingUp } from 'lucide-react';

export default function SalesLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/sales-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Invalid credentials'); return; }
      router.push('/sales');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-charcoal to-copper/20 flex items-center justify-center p-4">
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-copper rounded-sm flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-charcoal text-lg leading-none">RoomService AI</p>
            <p className="text-xs text-gray-400">Sales Portal</p>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-charcoal mb-1 text-center">Welcome back</h1>
        <p className="text-gray-500 text-sm text-center mb-6">Sign in to access your leads</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:border-copper text-sm"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:border-copper text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-sm px-3 py-2">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-copper text-white rounded-sm hover:bg-copper-hover transition-colors font-medium disabled:bg-gray-300 flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
