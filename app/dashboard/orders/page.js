'use client';

import { useState } from 'react';
import Link from 'next/link';
import Table from '@/components/shared/Table';
import StatusBadge from '@/components/shared/StatusBadge';
import { mockOrders } from '@/lib/mockData';
import { Search, Filter } from 'lucide-react';

export default function OrdersListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch = order.room.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const headers = ['Order ID', 'Time', 'Room', 'Items', 'Channel', 'Status', 'Total', 'Actions'];

  const renderRow = (order, index) => (
    <tr key={order.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap font-mono">#{order.id}</td>
      <td className="px-6 py-4 whitespace-nowrap">{order.time}</td>
      <td className="px-6 py-4 whitespace-nowrap font-bold">Room {order.room}</td>
      <td className="px-6 py-4">{order.items.slice(0, 2).join(', ')}{order.items.length > 2 ? '...' : ''}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`text-xs px-2 py-1 rounded ${
            order.channel === 'voice'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {order.channel}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={order.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap font-bold">£{order.total.toFixed(2)}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Link
          href={`/dashboard/orders/${order.id}`}
          className="text-copper hover:text-copper-hover text-sm font-medium"
        >
          View →
        </Link>
      </td>
    </tr>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal font-playfair mb-2">Orders</h1>
        <p className="text-gray-600">Manage and track all room service orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by room number..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-sm shadow-md border border-gray-200">
        <Table headers={headers} data={filteredOrders} renderRow={renderRow} />
      </div>
    </div>
  );
}
