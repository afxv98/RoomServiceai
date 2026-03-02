'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import StatusBadge from '@/components/shared/StatusBadge';
import Button from '@/components/shared/Button';
import { mockHotels } from '@/lib/mockData';
import { Eye, Calendar, MapPin, Globe, Check, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNotification } from '@/contexts/NotificationContext';

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast, confirm } = useNotification();
  const hotelId = parseInt(params.id);
  const hotel = mockHotels.find((h) => h.id === hotelId);

  const [activeTab, setActiveTab] = useState('overview');
  const [internalNotes, setInternalNotes] = useState('');
  const [features, setFeatures] = useState({
    roomServiceAI: hotel?.features.roomServiceAI || false,
    voiceOrdering: hotel?.features.voiceOrdering || false,
    upsellEngine: hotel?.features.upsellEngine || false,
  });

  // Usage data for chart (last 30 days)
  const usageData = [
    { day: 'Day 1', orders: 35 },
    { day: 'Day 5', orders: 42 },
    { day: 'Day 10', orders: 38 },
    { day: 'Day 15', orders: 51 },
    { day: 'Day 20', orders: 48 },
    { day: 'Day 25', orders: 55 },
    { day: 'Day 30', orders: 52 },
  ];

  if (!hotel) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Hotel not found</h1>
        <Button onClick={() => router.push('/admin/hotels')} className="mt-4">
          Back to Hotels
        </Button>
      </div>
    );
  }

  const handleImpersonate = () => {
    toast.info(`Impersonating ${hotel.name} admin...`);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  const handlePauseSubscription = async () => {
    const confirmed = await confirm({
      title: 'Pause Subscription',
      message: `Pause subscription for ${hotel.name}? They will lose access until reactivated.`,
      confirmText: 'Pause',
      cancelText: 'Cancel',
      variant: 'danger'
    });

    if (confirmed) {
      toast.success(`Subscription paused for ${hotel.name}`);
    }
  };

  const handleApplyCredit = async () => {
    const amount = prompt('Enter credit amount (£):');
    if (amount && !isNaN(amount)) {
      toast.success(`£${amount} credit applied to ${hotel.name}`);
    }
  };

  const handleSaveSettings = () => {
    console.log('Saving settings:', features);
    toast.success('Product settings saved successfully');
  };

  const handleSaveNotes = () => {
    if (!internalNotes.trim()) {
      toast.error('Please enter some notes before saving');
      return;
    }
    console.log('Saving notes:', internalNotes);
    toast.success('Notes saved successfully');
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'billing', label: 'Billing' },
    { id: 'product', label: 'Product Settings' },
    { id: 'analytics', label: 'Usage Analytics' },
    { id: 'support', label: 'Support & Notes' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Button variant="secondary" onClick={() => router.push('/admin/hotels')}>
          ← Back to Hotels
        </Button>
      </div>

      <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-charcoal font-playfair mb-2">{hotel.name}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {hotel.country}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4" /> {hotel.language}
              </span>
            </div>
          </div>
          <StatusBadge status={hotel.status} />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-sm shadow-md border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-copper text-copper'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Hotel Information</h3>
                  <div className="space-y-2">
                    <p><strong>Total Rooms:</strong> {hotel.rooms}</p>
                    <p><strong>Plan:</strong> {hotel.plan}</p>
                    <p><strong>MRR:</strong> £{hotel.mrr.toLocaleString()}</p>
                    <p><strong>Timezone:</strong> {hotel.timezone}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Account Status</h3>
                  <div className="space-y-2">
                    <p><strong>Setup Fee:</strong> ${hotel.setupFee.toLocaleString()}</p>
                    <p className="flex items-center gap-2">
                      <strong>Setup Fee Paid:</strong>
                      {hotel.setupFeePaid ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <Button onClick={handleImpersonate}>
                  <Eye className="w-4 h-4 mr-2" /> Impersonate Hotel Admin
                </Button>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <h3 className="font-bold text-lg">Subscription Details</h3>
              <div className="space-y-2">
                <p><strong>Plan:</strong> {hotel.plan}</p>
                <p><strong>Monthly Recurring Revenue:</strong> £{hotel.mrr.toLocaleString()}</p>
                <p><strong>Price per Room:</strong> £{(hotel.mrr / hotel.rooms).toFixed(2)}</p>
              </div>

              <div className="pt-6 border-t">
                <h3 className="font-bold text-lg mb-4">Actions</h3>
                <div className="flex gap-4">
                  <Button variant="secondary" onClick={handlePauseSubscription}>
                    Pause Subscription
                  </Button>
                  <Button variant="secondary" onClick={handleApplyCredit}>
                    Apply Credit
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Product Settings Tab */}
          {activeTab === 'product' && (
            <div className="space-y-6">
              <h3 className="font-bold text-lg">Feature Toggles</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={features.roomServiceAI}
                    onChange={(e) => setFeatures({ ...features, roomServiceAI: e.target.checked })}
                    className="form-checkbox text-copper w-5 h-5"
                  />
                  <span>Room Service AI</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={features.voiceOrdering}
                    onChange={(e) => setFeatures({ ...features, voiceOrdering: e.target.checked })}
                    className="form-checkbox text-copper w-5 h-5"
                  />
                  <span>Voice Ordering</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={features.upsellEngine}
                    onChange={(e) => setFeatures({ ...features, upsellEngine: e.target.checked })}
                    className="form-checkbox text-copper w-5 h-5"
                  />
                  <span>Upsell Engine</span>
                </label>
              </div>
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </div>
          )}

          {/* Usage Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="font-bold text-lg">Usage Metrics</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Orders This Month</p>
                  <p className="text-2xl font-bold">1,247</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold">£42.50</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Upsell Rate</p>
                  <p className="text-2xl font-bold">23%</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <h4 className="font-bold mb-4">Orders Over Time (Last 30 Days)</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={usageData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="day"
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip
                        formatter={(value) => [`${value} orders`, 'Orders']}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="orders"
                        stroke="#C87941"
                        strokeWidth={3}
                        dot={{ fill: '#C87941', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Support & Notes Tab */}
          {activeTab === 'support' && (
            <div className="space-y-6">
              <h3 className="font-bold text-lg">Internal Notes</h3>
              <textarea
                className="w-full h-32 p-4 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                placeholder="Add internal notes about this hotel..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
              />
              <Button onClick={handleSaveNotes}>Save Notes</Button>

              <div className="pt-6 border-t">
                <h3 className="font-bold text-lg mb-4">Recent Support Tickets</h3>
                <p className="text-gray-500">No recent support tickets</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
