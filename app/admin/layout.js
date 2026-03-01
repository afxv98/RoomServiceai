'use client';

import Sidebar from '@/components/shared/Sidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const adminNavItems = [
  { href: '/admin',          label: 'Dashboard',      icon: 'LayoutDashboard' },
  { href: '/admin/users',    label: 'Hotel Accounts', icon: 'Building2' },
  { href: '/admin/billing',  label: 'Billing',        icon: 'CreditCard' },
  { href: '/admin/sales',    label: 'Sales',          icon: 'TrendingUp' },
  { href: '/admin/campaigns',label: 'Campaigns',      icon: 'Megaphone' },
  { href: '/admin/email',    label: 'Email Hub',      icon: 'Mail' },
  { href: '/admin/inbox',    label: 'Master Inbox',   icon: 'Inbox' },
  { href: '/admin/crm',      label: 'CRM',            icon: 'Users' },
  { href: '/admin/hotels',   label: 'Hotels',         icon: 'Hotel' },
  { href: '/admin/blogs',    label: 'Blogs',          icon: 'BookOpen' },
  { href: '/admin/support',  label: 'Support',        icon: 'HeadphonesIcon' },
  { href: '/admin/settings', label: 'Settings',       icon: 'Settings' },
];

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute requiredUserType="admin">
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar items={adminNavItems} title="Super Admin" />
        <div className="flex-1 ml-64">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
