'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import * as Icons from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

function DropdownGroup({ item, pathname }) {
  const isChildActive = item.children.some(
    (child) => pathname === child.href || pathname?.startsWith(child.href + '/')
  );
  const [open, setOpen] = useState(isChildActive);
  const IconComponent = Icons[item.icon] || Icons.Circle;

  return (
    <li>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors duration-200 text-base font-semibold ${
          isChildActive
            ? 'text-copper'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
      >
        <IconComponent className="w-5 h-5 flex-shrink-0" />
        <span className="flex-1 text-left">{item.label}</span>
        <Icons.ChevronDown
          className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul className="mt-0.5 ml-4 pl-4 border-l border-gray-700 space-y-0.5">
          {item.children.map((child) => {
            const ChildIcon = Icons[child.icon] || Icons.Circle;
            const isActive = pathname === child.href || pathname?.startsWith(child.href + '/');
            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-colors duration-200 text-sm font-semibold ${
                    isActive
                      ? 'bg-copper text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <ChildIcon className="w-4 h-4 flex-shrink-0" />
                  <span>{child.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

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
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-copper rounded flex items-center justify-center">
            <Icons.Mic className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold font-playfair tracking-wide">
            RoomService<span className="text-copper">AI</span>
          </span>
        </Link>
        {title && <p className="text-sm font-semibold text-gray-300 mt-2 tracking-wider uppercase">{title}</p>}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {items.map((item, idx) => {
            // Divider
            if (item.divider) {
              return <li key={`divider-${idx}`}><hr className="border-gray-700 my-2" /></li>;
            }

            // Dropdown group
            if (item.children) {
              return <DropdownGroup key={item.label} item={item} pathname={pathname} />;
            }

            // Regular link
            const IconComponent = Icons[item.icon] || Icons.Circle;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-colors duration-200 text-base font-semibold ${
                    isActive
                      ? 'bg-copper text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
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
            <Icons.User className="w-5 h-5 text-gray-300" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{user?.userType === 'admin' ? 'Super Admin' : 'Hotel Manager'}</p>
            <p className="text-xs text-gray-400">{user?.email || 'user@roomserviceai.com'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm font-semibold w-full"
        >
          <Icons.LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
