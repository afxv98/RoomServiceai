'use client';

import { useState } from 'react';
import Button from '@/components/shared/Button';
import Table from '@/components/shared/Table';
import Modal from '@/components/shared/Modal';
import { mockMenuItems } from '@/lib/mockData';
import { Plus, Edit2, ToggleLeft, ToggleRight } from 'lucide-react';

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState(mockMenuItems);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks'];

  const filteredItems =
    activeCategory === 'All'
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  const toggleAvailability = (id) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
    console.log('Toggled availability for item:', id);
  };

  const headers = ['Item', 'Category', 'Price', 'Available', 'Upsell Enabled', 'Actions'];

  const renderRow = (item, index) => (
    <tr key={item.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap font-medium">{item.name}</td>
      <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
      <td className="px-6 py-4 whitespace-nowrap font-bold">£{item.price.toFixed(2)}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={() => toggleAvailability(item.id)}
          className={`flex items-center gap-2 ${
            item.available ? 'text-green-600' : 'text-gray-400'
          }`}
        >
          {item.available ? (
            <ToggleRight className="w-6 h-6" />
          ) : (
            <ToggleLeft className="w-6 h-6" />
          )}
          <span className="text-sm">{item.available ? 'Yes' : 'No'}</span>
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            item.upsellEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}
        >
          {item.upsellEnabled ? 'Enabled' : 'Disabled'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={() => console.log('Edit item:', item.id)}
          className="text-copper hover:text-copper-hover"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal font-playfair mb-2">Menu Management</h1>
          <p className="text-gray-600">Manage menu items and availability</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Menu Item
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-sm shadow-md border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeCategory === category
                  ? 'border-copper text-copper'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Table */}
      <div className="bg-white rounded-sm shadow-md border border-gray-200">
        <Table headers={headers} data={filteredItems} renderRow={renderRow} />
      </div>

      {/* Add Item Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Menu Item">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log('Adding new menu item');
            setIsModalOpen(false);
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Item Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                placeholder="e.g., Caesar Salad"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Category</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper">
                <option>Starters</option>
                <option>Mains</option>
                <option>Desserts</option>
                <option>Drinks</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Price (£)</label>
              <input
                type="number"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                placeholder="12.00"
                required
              />
            </div>
            <Button type="submit">Add Item</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
