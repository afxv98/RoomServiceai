'use client';

import KPICard from '@/components/shared/KPICard';
import { mockHotels } from '@/lib/mockData';
import { Building2, DoorOpen, DollarSign, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const totalHotels = mockHotels.length;
  const liveHotels = mockHotels.filter((h) => h.status === 'live').length;
  const totalRooms = mockHotels.reduce((sum, hotel) => sum + hotel.rooms, 0);
  const totalMRR = mockHotels.reduce((sum, hotel) => sum + hotel.mrr, 0);
  const churnRate = '2.3%';

  // MRR Growth Data (last 12 months)
  const mrrData = [
    { month: 'Feb', mrr: 45000 },
    { month: 'Mar', mrr: 52000 },
    { month: 'Apr', mrr: 58000 },
    { month: 'May', mrr: 61000 },
    { month: 'Jun', mrr: 67000 },
    { month: 'Jul', mrr: 72000 },
    { month: 'Aug', mrr: 78000 },
    { month: 'Sep', mrr: 85000 },
    { month: 'Oct', mrr: 92000 },
    { month: 'Nov', mrr: 98000 },
    { month: 'Dec', mrr: 104000 },
    { month: 'Jan', mrr: totalMRR },
  ];

  const recentActivity = [
    { type: 'success', message: 'New hotel onboarded: Tokyo Luxury Suites', time: '2 hours ago' },
    { type: 'warning', message: 'Payment failed: Tuscany Villa Collection', time: '5 hours ago' },
    { type: 'success', message: 'Setup fee paid: Cornwall Luxury Hotel ($2,500)', time: '1 day ago' },
    { type: 'info', message: 'Support ticket resolved: Grand Bay Resort', time: '1 day ago' },
    { type: 'success', message: 'New lead: Peninsula Beverly Hills', time: '2 days ago' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal font-playfair mb-2">Super Admin Dashboard</h1>
        <p className="text-gray-600">Platform overview and key metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard title="Total Hotels Live" value={liveHotels} icon="Building2" trend="+3" />
        <KPICard title="Total Rooms Live" value={totalRooms.toLocaleString()} icon="DoorOpen" />
        <KPICard
          title="Monthly Recurring Revenue"
          value={`£${totalMRR.toLocaleString()}`}
          icon="DollarSign"
          trend="+8%"
        />
        <KPICard title="Churn %" value={churnRate} icon="TrendingDown" trendDirection="down" />
      </div>

      {/* MRR Growth Chart */}
      <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200 mb-8">
        <h2 className="text-xl font-bold mb-4">MRR Growth</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mrrData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value) => [`£${value.toLocaleString()}`, 'MRR']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px' }}
              />
              <Line
                type="monotone"
                dataKey="mrr"
                stroke="#C87941"
                strokeWidth={3}
                dot={{ fill: '#C87941', r: 4 }}
                activeDot={{ r: 6 }}
                name="Monthly Recurring Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => {
            const typeColors = {
              success: 'bg-green-100 text-green-800 border-green-200',
              warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
              info: 'bg-blue-100 text-blue-800 border-blue-200',
            };

            return (
              <div
                key={index}
                className={`p-4 rounded-sm border ${typeColors[activity.type] || 'bg-gray-100 text-gray-800 border-gray-200'}`}
              >
                <p className="font-medium">{activity.message}</p>
                <p className="text-xs mt-1 opacity-75">{activity.time}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
