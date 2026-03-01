'use client';

import { useState } from 'react';
import Table from '@/components/shared/Table';
import StatusBadge from '@/components/shared/StatusBadge';
import Button from '@/components/shared/Button';
import { mockInvoices } from '@/lib/mockData';
import { CreditCard, TrendingUp, AlertCircle, X, Download, Mail } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';

export default function BillingPage() {
  const { toast } = useNotification();
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [pricingPlans, setPricingPlans] = useState([
    {
      id: 1,
      name: 'Tier 1 - Boutique Luxury',
      description: 'Up to 50 rooms',
      yearlyPrice: 14500,
      monthlyPrice: 1208,
      setupFee: 2500,
      features: ['Voice Ordering', 'Basic Analytics', 'Email Support']
    },
    {
      id: 2,
      name: 'Tier 2 - Small Full-Service',
      description: '51-100 rooms',
      yearlyPrice: 21500,
      monthlyPrice: 1792,
      setupFee: 2500,
      features: ['Voice Ordering', 'Advanced Analytics', 'Priority Support', 'Upsell Engine']
    },
    {
      id: 3,
      name: 'Tier 3 - Full-Service Hotel',
      description: '101-250 rooms',
      yearlyPrice: 29500,
      monthlyPrice: 2458,
      setupFee: 3500,
      features: ['Voice Ordering', 'Advanced Analytics', 'Priority Support', 'Upsell Engine', 'Custom Integrations']
    },
    {
      id: 4,
      name: 'Tier 4 - Large Hotel / Resort',
      description: '251-500 rooms',
      yearlyPrice: 49500,
      monthlyPrice: 4125,
      setupFee: 5000,
      features: ['All Features', 'Dedicated Account Manager', '24/7 Phone Support', 'Custom Development']
    }
  ]);

  const headers = ['Hotel', 'Amount', 'Status', 'Invoice Date', 'Due Date', 'Actions'];

  const handleViewInvoice = (invoice) => {
    setViewingInvoice(invoice);
  };

  const handleDownloadInvoice = (invoice) => {
    toast.success(`Invoice #${invoice.id} downloaded`);
  };

  const handleEmailInvoice = (invoice) => {
    toast.success(`Invoice #${invoice.id} emailed to ${invoice.hotel}`);
  };

  const handleEditPlan = (plan) => {
    setEditingPlan({ ...plan });
  };

  const handleUpdatePlan = () => {
    const updatedPlans = pricingPlans.map(p =>
      p.id === editingPlan.id ? editingPlan : p
    );
    setPricingPlans(updatedPlans);
    setEditingPlan(null);
    toast.success('Pricing plan updated successfully');
  };

  const renderRow = (invoice, index) => (
    <tr key={invoice.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap font-medium">{invoice.hotel}</td>
      <td className="px-6 py-4 whitespace-nowrap font-bold">£{invoice.amount.toLocaleString()}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={invoice.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">{invoice.date}</td>
      <td className="px-6 py-4 whitespace-nowrap">{invoice.dueDate}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={() => handleViewInvoice(invoice)}
          className="text-copper hover:text-copper-hover text-sm font-medium"
        >
          View Invoice →
        </button>
      </td>
    </tr>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal font-playfair mb-2">Billing Management</h1>
        <p className="text-gray-600">Manage subscriptions, invoices, and payment processing</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total MRR</h3>
            <CreditCard className="w-5 h-5 text-copper" />
          </div>
          <p className="text-3xl font-bold">£17,541</p>
          <p className="text-sm text-green-600 mt-1">+8% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Setup Fees Collected</h3>
            <TrendingUp className="w-5 h-5 text-copper" />
          </div>
          <p className="text-3xl font-bold">£42,000</p>
          <p className="text-sm text-gray-600 mt-1">This quarter</p>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Failed Payments</h3>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-600">1</p>
          <p className="text-sm text-gray-600 mt-1">Requires attention</p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-sm shadow-md border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">Recent Invoices</h2>
        </div>
        <Table headers={headers} data={mockInvoices} renderRow={renderRow} />
      </div>

      {/* Pricing Plans */}
      <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Pricing Plans Manager</h2>
        <p className="text-sm text-gray-600 mb-6">Manage pricing tiers and update rates. Changes will be reflected on the website pricing page.</p>
        <div className="space-y-4">
          {pricingPlans.map((plan) => (
            <div key={plan.id} className="flex justify-between items-center p-4 bg-gray-50 rounded">
              <div>
                <h3 className="font-bold">{plan.name}</h3>
                <p className="text-sm text-gray-600">{plan.description}</p>
                <p className="text-xs text-gray-500 mt-1">Setup Fee: £{plan.setupFee.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">£{plan.yearlyPrice.toLocaleString()} / year</p>
                <p className="text-sm text-gray-600">£{plan.monthlyPrice.toLocaleString()} / month</p>
                <Button
                  variant="secondary"
                  className="text-xs mt-2"
                  onClick={() => handleEditPlan(plan)}
                >
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Invoice Modal */}
      {viewingInvoice && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setViewingInvoice(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Invoice #{viewingInvoice.id}</h3>
                <button onClick={() => setViewingInvoice(null)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Invoice Header */}
              <div className="mb-6 pb-6 border-b">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-gray-600 mb-2">BILLED TO</h4>
                    <p className="font-bold">{viewingInvoice.hotel}</p>
                    <p className="text-sm text-gray-600">Hotel Address</p>
                    <p className="text-sm text-gray-600">City, Country</p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-sm font-bold text-gray-600 mb-2">INVOICE DETAILS</h4>
                    <p className="text-sm"><strong>Invoice Date:</strong> {viewingInvoice.date}</p>
                    <p className="text-sm"><strong>Due Date:</strong> {viewingInvoice.dueDate}</p>
                    <p className="text-sm"><strong>Status:</strong> <StatusBadge status={viewingInvoice.status} /></p>
                  </div>
                </div>
              </div>

              {/* Invoice Items */}
              <div className="mb-6">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-bold">Description</th>
                      <th className="px-4 py-2 text-right text-sm font-bold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-4 py-3">Monthly Subscription - Room Service AI</td>
                      <td className="px-4 py-3 text-right">£{viewingInvoice.amount.toLocaleString()}</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td className="px-4 py-3 text-right font-bold">Total</td>
                      <td className="px-4 py-3 text-right font-bold text-lg">£{viewingInvoice.amount.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button onClick={() => handleDownloadInvoice(viewingInvoice)}>
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </Button>
                <Button variant="secondary" onClick={() => handleEmailInvoice(viewingInvoice)}>
                  <Mail className="w-4 h-4 mr-2" /> Email Invoice
                </Button>
                <Button variant="secondary" onClick={() => setViewingInvoice(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Edit Pricing Plan Modal */}
      {editingPlan && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setEditingPlan(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Edit Pricing Plan</h3>
                <button onClick={() => setEditingPlan(null)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Plan Name *</label>
                  <input
                    type="text"
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description *</label>
                  <input
                    type="text"
                    value={editingPlan.description}
                    onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Yearly Price (£) *</label>
                  <input
                    type="number"
                    value={editingPlan.yearlyPrice}
                    onChange={(e) => {
                      const yearly = parseInt(e.target.value);
                      setEditingPlan({
                        ...editingPlan,
                        yearlyPrice: yearly,
                        monthlyPrice: Math.round(yearly / 12)
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Monthly Price (£) *</label>
                  <input
                    type="number"
                    value={editingPlan.monthlyPrice}
                    onChange={(e) => setEditingPlan({ ...editingPlan, monthlyPrice: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Setup Fee (£) *</label>
                  <input
                    type="number"
                    value={editingPlan.setupFee}
                    onChange={(e) => setEditingPlan({ ...editingPlan, setupFee: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={handleUpdatePlan}>Update Plan</Button>
                <Button variant="secondary" onClick={() => setEditingPlan(null)}>Cancel</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
