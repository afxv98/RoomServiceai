'use client';

import { useState } from 'react';
import Button from '@/components/shared/Button';
import { Calendar, Download } from 'lucide-react';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('last7days');

  const topSellingItems = [
    { name: 'Club Sandwich', orders: 145, revenue: 2320 },
    { name: 'Cheeseburger', orders: 132, revenue: 2442 },
    { name: 'Grilled Salmon', orders: 98, revenue: 3136 },
    { name: 'Caesar Salad', orders: 87, revenue: 1044 },
    { name: 'Red Wine (Glass)', orders: 156, revenue: 1872 },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal font-playfair mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">Track performance and key metrics</p>
        </div>
        <Button onClick={() => console.log('Export report')}>
          <Download className="w-4 h-4 mr-2" /> Export Report
        </Button>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200 mb-6">
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-gray-600" />
          <label className="text-sm font-bold">Date Range:</label>
          <select
            className="px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="thismonth">This Month</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
      </div>

      {/* Revenue Graph */}
      <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200 mb-6">
        <h2 className="text-xl font-bold mb-4">Revenue Over Time</h2>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
          <p className="text-gray-500">[Chart Placeholder - Revenue trend over selected period]</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Top Selling Items */}
        <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Top Selling Items</h2>
          <div className="space-y-3">
            {topSellingItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.orders} orders</p>
                </div>
                <p className="font-bold text-green-600">£{item.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upsell Performance */}
        <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Upsell Performance</h2>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded">
              <p className="text-sm text-gray-600 mb-1">Upsell Success Rate</p>
              <p className="text-3xl font-bold text-green-600">23.4%</p>
              <p className="text-xs text-gray-500 mt-1">+2.1% from previous period</p>
            </div>

            <div className="p-4 bg-blue-50 rounded">
              <p className="text-sm text-gray-600 mb-1">Avg. Upsell Value</p>
              <p className="text-3xl font-bold text-blue-600">£8.50</p>
              <p className="text-xs text-gray-500 mt-1">Per successful upsell</p>
            </div>

            <div className="p-4 bg-purple-50 rounded">
              <p className="text-sm text-gray-600 mb-1">Total Upsell Revenue</p>
              <p className="text-3xl font-bold text-purple-600">£3,247</p>
              <p className="text-xs text-gray-500 mt-1">This period</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Channel Breakdown */}
      <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Orders by Channel</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-purple-50 rounded text-center">
            <p className="text-sm text-gray-600 mb-2">Voice Orders</p>
            <p className="text-3xl font-bold text-purple-600">145</p>
            <p className="text-xs text-gray-500 mt-1">62% of total</p>
          </div>
          <div className="p-4 bg-blue-50 rounded text-center">
            <p className="text-sm text-gray-600 mb-2">Chat Orders (QR)</p>
            <p className="text-3xl font-bold text-blue-600">89</p>
            <p className="text-xs text-gray-500 mt-1">38% of total</p>
          </div>
          <div className="p-4 bg-gray-50 rounded text-center">
            <p className="text-sm text-gray-600 mb-2">Total Orders</p>
            <p className="text-3xl font-bold text-charcoal">234</p>
            <p className="text-xs text-gray-500 mt-1">All channels</p>
          </div>
        </div>
      </div>
    </div>
  );
}
