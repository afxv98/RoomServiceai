'use client';

import Sidebar from '@/components/shared/Sidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const dashboardNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/dashboard/orders', label: 'Orders', icon: 'ShoppingBag' },
  { href: '/dashboard/menu', label: 'Menu', icon: 'UtensilsCrossed' },
  { href: '/dashboard/upsell', label: 'AI Upsells', icon: 'TrendingUp' },
  { href: '/dashboard/voice', label: 'Voice AI', icon: 'Mic' },
  { href: '/dashboard/rooms', label: 'Rooms & QR', icon: 'QrCode' },
  { href: '/dashboard/staff', label: 'Staff', icon: 'Users' },
  { href: '/dashboard/reports', label: 'Reports', icon: 'BarChart3' },
  { href: '/dashboard/settings', label: 'Settings', icon: 'Settings' },
];

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute requiredUserType="hotel">
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar items={dashboardNavItems} title="Grand Bay Resort" />
        <div className="flex-1 ml-64">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
