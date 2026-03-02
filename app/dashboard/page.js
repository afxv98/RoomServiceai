import KPICard from '@/components/shared/KPICard';
import StatusBadge from '@/components/shared/StatusBadge';
import { mockOrders } from '@/lib/mockData';
import { ShoppingBag, DollarSign, TrendingUp, Star } from 'lucide-react';

export default function HotelDashboard() {
  const todayOrders = mockOrders.filter((o) => o.date === '2026-01-23');
  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const avgOrderValue = todayRevenue / todayOrders.length;
  const upsellCount = todayOrders.filter((o) => o.upsell).length;
  const upsellRate = ((upsellCount / todayOrders.length) * 100).toFixed(1);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal font-playfair mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's today's overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Orders Today"
          value={todayOrders.length}
          icon="ShoppingBag"
          trend="+12%"
          href="/dashboard/orders"
        />
        <KPICard
          title="Revenue Today"
          value={`£${todayRevenue.toFixed(2)}`}
          icon="DollarSign"
          trend="+8%"
          href="/dashboard/reports"
        />
        <KPICard
          title="Average Order Value"
          value={`£${avgOrderValue.toFixed(2)}`}
          icon="Star"
          href="/dashboard/reports"
        />
        <KPICard
          title="Upsell Conversion %"
          value={`${upsellRate}%`}
          icon="TrendingUp"
          trend="+5%"
          href="/dashboard/upsell"
        />
      </div>

      {/* Live Orders Feed */}
      <div className="bg-white rounded-sm shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">Live Orders</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {mockOrders.slice(0, 10).map((order) => (
            <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-lg">Room {order.room}</span>
                    <StatusBadge status={order.status} />
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        order.channel === 'voice'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {order.channel}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Items:</strong> {order.items.join(', ')}
                  </p>
                  {order.specialRequests && (
                    <p className="text-sm text-gray-500">
                      <strong>Note:</strong> {order.specialRequests}
                    </p>
                  )}
                  {order.upsell && (
                    <p className="text-sm text-green-600 font-medium">
                      ✓ Upsell: {order.upsell}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{order.time}</p>
                  <p className="text-lg font-bold text-charcoal mt-1">£{order.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
