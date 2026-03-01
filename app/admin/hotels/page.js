'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Table from '@/components/shared/Table';
import StatusBadge from '@/components/shared/StatusBadge';
import Button from '@/components/shared/Button';
import { mockHotels } from '@/lib/mockData';
import { Search, Filter, Plus, Edit, Trash2, UserCog, Pause, DollarSign } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';

export default function HotelsListPage() {
  const router = useRouter();
  const { toast, confirm } = useNotification();
  const [hotels, setHotels] = useState(mockHotels);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [newHotel, setNewHotel] = useState({
    name: '',
    rooms: '',
    plan: 'Tier 2',
    status: 'trial',
    mrr: '',
    country: '',
  });

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || hotel.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddHotel = () => {
    if (!newHotel.name || !newHotel.rooms || !newHotel.mrr || !newHotel.country) {
      toast.error('Please fill in all required fields');
      return;
    }

    const hotel = {
      id: Math.max(...hotels.map(h => h.id)) + 1,
      name: newHotel.name,
      rooms: parseInt(newHotel.rooms),
      plan: newHotel.plan,
      status: newHotel.status,
      mrr: parseInt(newHotel.mrr),
      country: newHotel.country,
    };

    setHotels([...hotels, hotel]);
    setShowAddModal(false);
    setNewHotel({ name: '', rooms: '', plan: 'Tier 2', status: 'trial', mrr: '', country: '' });
    toast.success(`${hotel.name} has been added successfully`);
  };

  const handleEditHotel = (hotel) => {
    setEditingHotel(hotel);
    setNewHotel({
      name: hotel.name,
      rooms: hotel.rooms.toString(),
      plan: hotel.plan,
      status: hotel.status,
      mrr: hotel.mrr.toString(),
      country: hotel.country,
    });
    setShowAddModal(true);
  };

  const handleUpdateHotel = () => {
    if (!newHotel.name || !newHotel.rooms || !newHotel.mrr || !newHotel.country) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updatedHotels = hotels.map(h =>
      h.id === editingHotel.id
        ? {
            ...h,
            name: newHotel.name,
            rooms: parseInt(newHotel.rooms),
            plan: newHotel.plan,
            status: newHotel.status,
            mrr: parseInt(newHotel.mrr),
            country: newHotel.country,
          }
        : h
    );

    setHotels(updatedHotels);
    setShowAddModal(false);
    setEditingHotel(null);
    setNewHotel({ name: '', rooms: '', plan: 'Tier 2', status: 'trial', mrr: '', country: '' });
    toast.success(`${newHotel.name} has been updated successfully`);
  };

  const handleDeleteHotel = async (hotel) => {
    const confirmed = await confirm({
      title: 'Delete Hotel',
      message: `Are you sure you want to delete ${hotel.name}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger'
    });

    if (confirmed) {
      setHotels(hotels.filter(h => h.id !== hotel.id));
      toast.success(`${hotel.name} has been deleted`);
    }
  };

  const handleImpersonate = (hotel) => {
    toast.info(`Impersonating ${hotel.name} admin...`);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  const handlePauseSubscription = async (hotel) => {
    const confirmed = await confirm({
      title: 'Pause Subscription',
      message: `Pause subscription for ${hotel.name}? They will lose access until reactivated.`,
      confirmText: 'Pause',
      cancelText: 'Cancel',
      variant: 'danger'
    });

    if (confirmed) {
      const updatedHotels = hotels.map(h =>
        h.id === hotel.id ? { ...h, status: 'paused' } : h
      );
      setHotels(updatedHotels);
      toast.success(`Subscription paused for ${hotel.name}`);
    }
  };

  const handleApplyCredit = async (hotel) => {
    const amount = prompt('Enter credit amount (£):');
    if (amount && !isNaN(amount)) {
      toast.success(`£${amount} credit applied to ${hotel.name}`);
    }
  };

  const headers = ['Hotel Name', 'Rooms', 'Plan', 'Status', 'MRR', 'Country', 'Actions'];

  const renderRow = (hotel, index) => (
    <tr key={hotel.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <Link href={`/admin/hotels/${hotel.id}`} className="font-medium text-copper hover:text-copper-hover">
          {hotel.name}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">{hotel.rooms}</td>
      <td className="px-6 py-4 whitespace-nowrap">{hotel.plan}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={hotel.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap font-bold">£{hotel.mrr.toLocaleString()}</td>
      <td className="px-6 py-4 whitespace-nowrap">{hotel.country}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEditHotel(hotel)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteHotel(hotel)}
            className="text-red-600 hover:text-red-800 p-1"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleImpersonate(hotel)}
            className="text-purple-600 hover:text-purple-800 p-1"
            title="Impersonate Hotel Admin"
          >
            <UserCog className="w-4 h-4" />
          </button>
          <button
            onClick={() => handlePauseSubscription(hotel)}
            className="text-orange-600 hover:text-orange-800 p-1"
            title="Pause Subscription"
          >
            <Pause className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleApplyCredit(hotel)}
            className="text-green-600 hover:text-green-800 p-1"
            title="Apply Credit"
          >
            <DollarSign className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal font-playfair mb-2">Hotels</h1>
          <p className="text-gray-600">Manage all hotel accounts</p>
        </div>
        <Button onClick={() => {
          setEditingHotel(null);
          setNewHotel({ name: '', rooms: '', plan: 'Tier 2', status: 'trial', mrr: '', country: '' });
          setShowAddModal(true);
        }}>
          <Plus className="w-4 h-4 mr-2" /> Add New Hotel
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search hotels..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="live">Live</option>
              <option value="trial">Trial</option>
              <option value="past_due">Past Due</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hotels Table */}
      <div className="bg-white rounded-sm shadow-md border border-gray-200 overflow-x-auto">
        <Table headers={headers} data={filteredHotels} renderRow={renderRow} />
      </div>

      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Total Hotels</p>
          <p className="text-2xl font-bold">{hotels.length}</p>
        </div>
        <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Total Rooms</p>
          <p className="text-2xl font-bold">
            {hotels.reduce((sum, h) => sum + h.rooms, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Total MRR</p>
          <p className="text-2xl font-bold">
            £{hotels.reduce((sum, h) => sum + h.mrr, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Add/Edit Hotel Modal */}
      {showAddModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => {
            setShowAddModal(false);
            setEditingHotel(null);
          }} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold mb-4">
                {editingHotel ? 'Edit Hotel' : 'Add New Hotel'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Hotel Name *</label>
                  <input
                    type="text"
                    value={newHotel.name}
                    onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Number of Rooms *</label>
                  <input
                    type="number"
                    value={newHotel.rooms}
                    onChange={(e) => setNewHotel({ ...newHotel, rooms: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Plan *</label>
                  <select
                    value={newHotel.plan}
                    onChange={(e) => setNewHotel({ ...newHotel, plan: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                  >
                    <option>Tier 1</option>
                    <option>Tier 2</option>
                    <option>Tier 3</option>
                    <option>Tier 4</option>
                    <option>Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status *</label>
                  <select
                    value={newHotel.status}
                    onChange={(e) => setNewHotel({ ...newHotel, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                  >
                    <option value="trial">Trial</option>
                    <option value="live">Live</option>
                    <option value="past_due">Past Due</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">MRR (£) *</label>
                  <input
                    type="number"
                    value={newHotel.mrr}
                    onChange={(e) => setNewHotel({ ...newHotel, mrr: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country *</label>
                  <input
                    type="text"
                    value={newHotel.country}
                    onChange={(e) => setNewHotel({ ...newHotel, country: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={editingHotel ? handleUpdateHotel : handleAddHotel}>
                  {editingHotel ? 'Update Hotel' : 'Add Hotel'}
                </Button>
                <Button variant="secondary" onClick={() => {
                  setShowAddModal(false);
                  setEditingHotel(null);
                }}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
