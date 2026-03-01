'use client';

import { useState } from 'react';
import Table from '@/components/shared/Table';
import StatusBadge from '@/components/shared/StatusBadge';
import Button from '@/components/shared/Button';
import { mockSupportTickets } from '@/lib/mockData';
import { AlertCircle, Clock, CheckCircle2, X } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';

export default function SupportPage() {
  const { toast } = useNotification();
  const [tickets, setTickets] = useState(mockSupportTickets);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [viewingTicket, setViewingTicket] = useState(null);
  const [newTicket, setNewTicket] = useState({
    hotel: '',
    issue: '',
    priority: 'medium',
  });

  const headers = ['Ticket ID', 'Hotel', 'Issue', 'Priority', 'Status', 'Created', 'Actions'];

  const priorityBadges = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800',
  };

  const handleCreateTicket = () => {
    if (!newTicket.hotel || !newTicket.issue) {
      toast.error('Please fill in all fields');
      return;
    }

    const ticket = {
      id: Math.max(...tickets.map(t => t.id)) + 1,
      hotel: newTicket.hotel,
      issue: newTicket.issue,
      priority: newTicket.priority,
      status: 'open',
      created: new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
    };

    setTickets([ticket, ...tickets]);
    setShowNewTicketModal(false);
    setNewTicket({ hotel: '', issue: '', priority: 'medium' });
    toast.success('Support ticket created successfully');
  };

  const renderRow = (ticket, index) => (
    <tr key={ticket.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap font-mono">#{ticket.id}</td>
      <td className="px-6 py-4 whitespace-nowrap font-medium">{ticket.hotel}</td>
      <td className="px-6 py-4">{ticket.issue}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
            priorityBadges[ticket.priority]
          }`}
        >
          {ticket.priority}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={ticket.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{ticket.created}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={() => setViewingTicket(ticket)}
          className="text-copper hover:text-copper-hover text-sm font-medium"
        >
          View →
        </button>
      </td>
    </tr>
  );

  const openTickets = tickets.filter((t) => t.status === 'open').length;
  const inProgressTickets = tickets.filter((t) => t.status === 'in_progress').length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal font-playfair mb-2">Support Dashboard</h1>
        <p className="text-gray-600">Manage customer support tickets and SLAs</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Open Tickets</h3>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-600">{openTickets}</p>
          <p className="text-sm text-gray-600 mt-1">Requires immediate attention</p>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">In Progress</h3>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-yellow-600">{inProgressTickets}</p>
          <p className="text-sm text-gray-600 mt-1">Being worked on</p>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Avg Response Time</h3>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">1.2h</p>
          <p className="text-sm text-gray-600 mt-1">Within SLA target</p>
        </div>
      </div>

      {/* Support Tickets Table */}
      <div className="bg-white rounded-sm shadow-md border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold">Support Tickets</h2>
          <Button onClick={() => setShowNewTicketModal(true)}>New Ticket</Button>
        </div>
        <Table headers={headers} data={tickets} renderRow={renderRow} />
      </div>

      {/* Hotels at Risk Alert */}
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-sm">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-red-900 mb-2">Hotels at Risk</h3>
            <p className="text-sm text-red-800 mb-3">
              The following hotels have open high-priority tickets for more than 24 hours:
            </p>
            <ul className="space-y-1 text-sm text-red-800">
              <li>• Grand Bay Resort - Voice ordering not responding (36h)</li>
            </ul>
            <Button variant="danger" className="mt-4" onClick={() => toast.success('Escalated to Engineering team')}>
              Escalate to Engineering
            </Button>
          </div>
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowNewTicketModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Create New Support Ticket</h3>
                <button onClick={() => setShowNewTicketModal(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Hotel Name *</label>
                  <input
                    type="text"
                    value={newTicket.hotel}
                    onChange={(e) => setNewTicket({ ...newTicket, hotel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                    placeholder="Enter hotel name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Issue Description *</label>
                  <textarea
                    value={newTicket.issue}
                    onChange={(e) => setNewTicket({ ...newTicket, issue: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper h-24"
                    placeholder="Describe the issue..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Priority *</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={handleCreateTicket}>Create Ticket</Button>
                <Button variant="secondary" onClick={() => setShowNewTicketModal(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* View Ticket Modal */}
      {viewingTicket && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setViewingTicket(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Ticket #{viewingTicket.id}</h3>
                <button onClick={() => setViewingTicket(null)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Hotel</p>
                    <p className="font-bold">{viewingTicket.hotel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Created</p>
                    <p className="font-bold">{viewingTicket.created}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Priority</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${priorityBadges[viewingTicket.priority]}`}>
                      {viewingTicket.priority}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <StatusBadge status={viewingTicket.status} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Issue Description</p>
                  <div className="bg-gray-50 p-4 rounded-sm">
                    <p>{viewingTicket.issue}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={() => {
                  toast.success('Ticket marked as resolved');
                  setViewingTicket(null);
                }}>Mark as Resolved</Button>
                <Button variant="secondary" onClick={() => setViewingTicket(null)}>Close</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
