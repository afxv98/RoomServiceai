'use client';

import Sidebar from '@/components/shared/Sidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const adminNavItems = [
  { href: '/admin',          label: 'Dashboard', icon: 'LayoutDashboard' },
  {
    label: 'CRM', icon: 'Users',
    children: [
      { href: '/admin/crm',   label: 'CRM',      icon: 'Users' },
      { href: '/admin/email', label: 'My Email', icon: 'Mail' },
    ],
  },
  { href: '/admin/calendar', label: 'Calendar', icon: 'CalendarDays' },
  {
    label: 'Campaigns', icon: 'Megaphone',
    children: [
      { href: '/admin/campaigns', label: 'Campaigns',        icon: 'Megaphone' },
      { href: '/admin/inbox',     label: 'Campaigns Inbox',  icon: 'Inbox' },
    ],
  },
  { divider: true },
  { href: '/admin/users',    label: 'Hotel Accounts', icon: 'Building2' },
  { href: '/admin/billing',  label: 'Billing',        icon: 'CreditCard' },
  { href: '/admin/sales',    label: 'Sales',          icon: 'TrendingUp' },
  { href: '/admin/blogs',    label: 'Blogs',          icon: 'BookOpen' },
  { href: '/admin/support',  label: 'Support',        icon: 'HeadphonesIcon' },
  { href: '/admin/settings', label: 'Settings',       icon: 'Settings' },
];

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute requiredUserType="admin">
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar items={adminNavItems} title="Super Admin" />
        <div className="flex-1 ml-64 min-w-0 overflow-x-hidden">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
