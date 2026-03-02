'use client';

import { useState } from 'react';
import Table from '@/components/shared/Table';
import StatusBadge from '@/components/shared/StatusBadge';
import Button from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';
import { mockStaff } from '@/lib/mockData';
import { Plus, Edit2 } from 'lucide-react';

export default function StaffManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const headers = ['Name', 'Role', 'Access Level', 'Status', 'Actions'];

  const renderRow = (staff, index) => (
    <tr key={staff.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap font-medium">{staff.name}</td>
      <td className="px-6 py-4 whitespace-nowrap">{staff.role}</td>
      <td className="px-6 py-4 whitespace-nowrap">{staff.accessLevel}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={staff.status.toLowerCase()} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex gap-3">
          <button
            onClick={() => console.log('Edit staff:', staff.id)}
            className="text-copper hover:text-copper-hover"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => console.log('Deactivate staff:', staff.id)}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            {staff.status === 'Active' ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal font-playfair mb-2">
            Staff Management
          </h1>
          <p className="text-gray-600">Manage staff access and permissions</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Staff Member
        </Button>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-sm shadow-md border border-gray-200 mb-6">
        <Table headers={headers} data={mockStaff} renderRow={renderRow} />
      </div>

      {/* Access Levels Info */}
      <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Access Level Descriptions</h2>
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-gray-50 rounded">
            <p className="font-bold">Full Access</p>
            <p className="text-gray-600">All system features including billing and settings</p>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <p className="font-bold">Menu & Orders</p>
            <p className="text-gray-600">View and manage orders, edit menu items</p>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <p className="font-bold">Orders Only</p>
            <p className="text-gray-600">View and update order status only</p>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <p className="font-bold">Menu & Reports</p>
            <p className="text-gray-600">Manage menu and view analytics reports</p>
          </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Staff Member">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log('Adding new staff member');
            setIsModalOpen(false);
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                placeholder="e.g., John Smith"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                placeholder="john.smith@hotel.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Role</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                placeholder="e.g., F&B Manager"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Access Level</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper">
                <option>Full Access</option>
                <option>Menu & Orders</option>
                <option>Orders Only</option>
                <option>Menu & Reports</option>
              </select>
            </div>
            <Button type="submit">Add Staff Member</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
