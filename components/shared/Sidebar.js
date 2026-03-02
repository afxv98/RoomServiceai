'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as Icons from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Sidebar component for navigation
export default function Sidebar({ items, title }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="w-64 bg-charcoal-dark text-white h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo/Title */}
      <div className="p-6 border-b border-gray-700">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-copper rounded flex items-center justify-center">
            <Icons.Mic className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold font-playfair">
            RoomService<span className="text-copper">AI</span>
          </span>
        </Link>
        {title && <p className="text-sm text-gray-400 mt-2">{title}</p>}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {items.map((item) => {
            const IconComponent = Icons[item.icon] || Icons.Circle;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-colors duration-200 ${
                    isActive
                      ? 'bg-copper text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            <Icons.User className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium">{user?.userType === 'admin' ? 'Super Admin' : 'Hotel Manager'}</p>
            <p className="text-xs text-gray-500">{user?.email || 'user@roomserviceai.com'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm w-full"
        >
          <Icons.LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
