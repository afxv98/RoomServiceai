'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mic, Mail, Lock } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useNotification();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('hotel');

  const handleSubmit = async (e) => {
    e.preventDefault();

    let res, data;
    try {
      if (userType === 'sales') {
        res = await fetch('/api/auth/sales-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
      } else {
        res = await fetch('/api/auth/admin-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, userType }),
        });
      }
      data = await res.json();
    } catch {
      toast.error('Network error. Please try again.');
      return;
    }

    if (!res.ok) {
      toast.error(
        userType === 'admin'
          ? 'Invalid super admin credentials'
          : userType === 'sales'
          ? 'Invalid sales rep credentials'
          : 'Invalid hotel manager credentials',
      );
      return;
    }

    if (userType === 'sales') {
      toast.success('Welcome back!');
      setTimeout(() => router.push('/sales'), 1000);
      return;
    }

    login(email, data.userType);
    toast.success(data.userType === 'admin' ? 'Welcome back, Super Admin!' : 'Welcome back!');
    setTimeout(() => router.push(data.userType === 'admin' ? '/admin' : '/dashboard'), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal to-charcoal-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-copper rounded flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold font-playfair text-white">
              RoomService<span className="text-copper">AI</span>
            </span>
          </Link>
          <p className="text-gray-400 text-sm">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-sm shadow-2xl p-8">
          {/* User Type Selection */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setUserType('hotel')}
              className={`flex-1 py-2 px-4 rounded-sm font-medium text-sm transition-colors ${
                userType === 'hotel'
                  ? 'bg-copper text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Hotel Manager
            </button>
            <button
              type="button"
              onClick={() => setUserType('admin')}
              className={`flex-1 py-2 px-4 rounded-sm font-medium text-sm transition-colors ${
                userType === 'admin'
                  ? 'bg-copper text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Super Admin
            </button>
            <button
              type="button"
              onClick={() => setUserType('sales')}
              className={`flex-1 py-2 px-4 rounded-sm font-medium text-sm transition-colors ${
                userType === 'sales'
                  ? 'bg-copper text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Sales Rep
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox text-copper" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-copper hover:text-copper-hover">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-copper text-white py-3 rounded-sm font-bold uppercase tracking-wide hover:bg-copper-hover transition-all hover:-translate-y-0.5 shadow-md"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="#contact" className="text-copper hover:text-copper-hover font-medium">
                Contact Sales
              </a>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
