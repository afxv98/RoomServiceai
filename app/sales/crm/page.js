'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Phone, Mail, MessageSquare, Calendar, X, ChevronRight,
  DollarSign, TrendingUp, Users, Percent, Clock, Send, User,
  MapPin, Globe, Plus, Edit, Trash2, Save, AlertCircle,
  Search, LayoutList, ArrowUpDown, Filter, StickyNote,
  ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon,
} from 'lucide-react';

// ── Constants ─────────────────────────────────────────────────────────────────
const COLUMNS = [
  { id: 'lead',      label: 'Lead' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'demo',      label: 'Demo' },
  { id: 'proposal',  label: 'Proposal' },
  { id: 'won',       label: 'Won' },
  { id: 'lost',      label: 'Lost' },
];

const STATUS_COLORS = {
  lead:      'bg-gray-100 text-gray-700',
  contacted: 'bg-blue-100 text-blue-700',
  demo:      'bg-purple-100 text-purple-700',
  proposal:  'bg-amber-100 text-amber-700',
  won:       'bg-green-100 text-green-700',
  lost:      'bg-red-100 text-red-700',
};

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100, 500];

function getActivityIcon(type) {
  const icons = {
    lead_created:   <User className="w-3.5 h-3.5 text-blue-500" />,
    sms_sent:       <MessageSquare className="w-3.5 h-3.5 text-green-500" />,
    call_made:      <Phone className="w-3.5 h-3.5 text-purple-500" />,
    email_sent:     <Mail className="w-3.5 h-3.5 text-orange-500" />,
    demo_scheduled: <Calendar className="w-3.5 h-3.5 text-blue-500" />,
    demo_completed: <Calendar className="w-3.5 h-3.5 text-green-500" />,
    proposal_sent:  <Send className="w-3.5 h-3.5 text-copper" />,
    stage_changed:  <ChevronRight className="w-3.5 h-3.5 text-gray-500" />,
  };
  return icons[type] || <Clock className="w-3.5 h-3.5 text-gray-400" />;
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SalesCRMPage() {
  const router = useRouter();
  const [leads, setLeads] = useState([]);
  const [rep, setRep] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [smsMessage, setSmsMessage] = useState('');
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoForm, setDemoForm] = useState({ date: '', time: '' });

  // Search / filter / view / pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('kanban');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Data ──────────────────────────────────────────────────────────────────
  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch('/api/sales/my-leads');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLeads(data.leads || []);
      setRep(data.rep);
    } catch {
      showToast('Failed to load leads', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  // ── Computed ──────────────────────────────────────────────────────────────
  const filteredLeads = leads.filter(lead => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      lead.hotelName.toLowerCase().includes(q) ||
      lead.contactName.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      (lead.phone || '').includes(q) ||
      (lead.city || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredLeads.length / pageSize);
  const pagedLeads = filteredLeads.slice((page - 1) * pageSize, page * pageSize);
  const getByStatus = (s) => filteredLeads.filter(l => l.status === s);

  const totalValue = leads.reduce((s, l) => s + l.value, 0);
  const activeLeads = leads.filter(l => !['won', 'lost'].includes(l.status)).length;
  const won = leads.filter(l => l.status === 'won').length;
  const convRate = leads.length ? ((won / leads.length) * 100).toFixed(1) : 0;

  // ── Actions ───────────────────────────────────────────────────────────────
  const logActivity = async (type, note, extra = {}) => {
    await fetch(`/api/crm/leads/${selectedLead.id}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, user: rep?.name || 'Rep', note, ...extra }),
    });
    fetchLeads();
  };

  const handleSMS = () => setShowSMSModal(true);

  const sendSMS = async () => {
    showToast(`SMS sent to ${selectedLead.mobile}`);
    await logActivity('sms_sent', smsMessage, { lastActivity: 'SMS sent · Just now' });
    setSmsMessage('');
    setShowSMSModal(false);
  };

  const handleCall = async () => {
    showToast(`Calling ${selectedLead.phone || selectedLead.mobile}…`, 'info');
    await logActivity('call_made', 'Call made', { lastActivity: 'Call made · Just now' });
  };

  const handleEmail = () => {
    router.push(`/sales/email?compose=1&to=${encodeURIComponent(selectedLead.email)}&subject=${encodeURIComponent(`RoomService AI – ${selectedLead.hotelName}`)}`);
  };

  const handleScheduleDemo = () => {
    setDemoForm({ date: '', time: '' });
    setShowDemoModal(true);
  };

  const handleScheduleDemoSubmit = async () => {
    if (!demoForm.date || !demoForm.time) { showToast('Please enter date and time', 'error'); return; }
    const startTime = new Date(`${demoForm.date}T${demoForm.time}`).toISOString();
    await Promise.all([
      fetch(`/api/crm/leads/${selectedLead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'demo', lastActivity: 'Demo scheduled · Just now' }),
      }),
      fetch(`/api/crm/leads/${selectedLead.id}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'demo_scheduled', user: rep?.name || 'Rep',
          note: `Demo set for ${demoForm.date} at ${demoForm.time}`,
          eventDate: startTime, assignedToId: rep?.id,
        }),
      }),
    ]);
    showToast(`Demo scheduled for ${demoForm.date} at ${demoForm.time}`);
    setShowDemoModal(false);
    fetchLeads();
    setSelectedLead(l => ({ ...l, status: 'demo' }));
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    const res = await fetch(`/api/crm/leads/${selectedLead.id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newNote, user: rep?.name || 'Rep' }),
    });
    if (res.ok) {
      const note = await res.json();
      setSelectedLead(l => ({ ...l, notes: [...(l.notes || []), note] }));
      setNewNote('');
      fetchLeads();
    }
  };

  const handleStageChange = async (newStage) => {
    await Promise.all([
      fetch(`/api/crm/leads/${selectedLead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStage, lastActivity: `Stage changed to ${newStage} · Just now` }),
      }),
      fetch(`/api/crm/leads/${selectedLead.id}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'stage_changed', user: rep?.name || 'Rep', note: `Moved to ${newStage}` }),
      }),
    ]);
    setSelectedLead(l => ({ ...l, status: newStage }));
    fetchLeads();
  };

  const handleSaveEdit = async () => {
    await fetch(`/api/crm/leads/${selectedLead.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    setEditMode(false);
    fetchLeads();
    showToast('Lead updated');
  };

  const timeAgo = (d) => {
    const ms = Date.now() - new Date(d);
    const m = Math.floor(ms / 60000), h = Math.floor(ms / 3600000), day = Math.floor(ms / 86400000);
    if (m < 60) return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    if (day < 7) return `${day}d ago`;
    return new Date(d).toLocaleDateString();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Loading CRM…</div>;
  }

  return (
    <div className="pb-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal font-playfair mb-1">My CRM</h1>
          <p className="text-gray-500 text-sm">Your assigned leads and pipeline</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Pipeline Value', value: `£${totalValue.toLocaleString()}`, Icon: DollarSign, color: 'border-copper' },
          { label: 'Active Leads',  value: activeLeads,   Icon: Users,    color: 'border-blue-500' },
          { label: 'Won',           value: won,           Icon: TrendingUp, color: 'border-green-500' },
          { label: 'Conversion',    value: `${convRate}%`, Icon: Percent,   color: 'border-purple-500' },
        ].map(({ label, value, Icon, color }) => (
          <div key={label} className={`bg-white p-5 rounded-sm shadow-sm border-l-4 ${color}`}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <Icon className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-charcoal">{value}</p>
          </div>
        ))}
      </div>

      {/* Search / Filter / View Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-copper/30 bg-white"
            placeholder="Search leads…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-copper"
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="all">All Stages</option>
            {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
          {[['kanban', 'Kanban', ArrowUpDown], ['table', 'All Leads', LayoutList]].map(([v, label, Icon]) => (
            <button
              key={v}
              onClick={() => { setViewMode(v); setPage(1); }}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${viewMode === v ? 'bg-copper text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>
        {filteredLeads.length !== leads.length && (
          <span className="text-xs text-gray-500">{filteredLeads.length} of {leads.length}</span>
        )}
      </div>

      {/* Kanban */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {COLUMNS.map(col => (
            <div key={col.id} className="bg-gray-100 rounded-sm p-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold uppercase text-xs text-gray-700 truncate">{col.label}</h3>
                <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full ml-1 flex-shrink-0">
                  {getByStatus(col.id).length}
                </span>
              </div>
              <div className="space-y-2.5 min-h-[100px]">
                {getByStatus(col.id).map(lead => (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="bg-white p-2.5 rounded-sm shadow-sm border border-gray-200 hover:shadow-md hover:border-copper hover:scale-105 transition-all cursor-pointer min-h-[140px] flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-xs mb-1 text-charcoal line-clamp-2 leading-tight">{lead.hotelName}</h4>
                      <p className="text-xs text-gray-600 mb-1 truncate">{lead.contactName}</p>
                      <p className="text-sm font-bold text-copper mb-1.5">£{lead.value.toLocaleString()}</p>
                    </div>
                    <div>
                      {lead.nextActionDate && (
                        <p className="text-xs text-gray-500 mb-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          {new Date(lead.nextActionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 italic truncate">{lead.lastActivity}</p>
                    </div>
                  </div>
                ))}
                {getByStatus(col.id).length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-8">No leads</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Hotel', 'Contact', 'Role', 'Phone', 'Email', 'Location', 'Status', 'Value', 'Next Action', 'Last Activity'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pagedLeads.length === 0 && (
                  <tr><td colSpan={10} className="text-center py-12 text-gray-400 text-sm">No leads match your filters.</td></tr>
                )}
                {pagedLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedLead(lead)}>
                    <td className="px-4 py-3 font-semibold text-charcoal">{lead.hotelName}</td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{lead.contactName}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{lead.role}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{lead.phone || lead.mobile}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-[160px] truncate">{lead.email}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{[lead.city, lead.country].filter(Boolean).join(', ')}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[lead.status]}`}>{lead.status}</span>
                    </td>
                    <td className="px-4 py-3 text-copper font-semibold whitespace-nowrap">£{lead.value.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {lead.nextActionDate ? new Date(lead.nextActionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs max-w-[160px] truncate">{lead.lastActivity || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Show</span>
              <select
                className="border border-gray-200 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-copper"
                value={pageSize}
                onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
              >
                {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <span className="text-xs text-gray-500">per page · {filteredLeads.length} total</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-40">
                <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
              </button>
              <span className="text-xs text-gray-600 px-2">Page {page} of {Math.max(1, totalPages)}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-40">
                <ChevronRightIcon className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Lead Drawer ── */}
      {selectedLead && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedLead(null)} />
          <div className="fixed right-0 top-0 h-full w-full md:w-[560px] bg-white z-50 shadow-2xl overflow-y-auto">

            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-5 z-10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  {editMode ? (
                    <input
                      className="w-full text-xl font-bold border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-copper"
                      value={editForm.hotelName}
                      onChange={e => setEditForm(f => ({ ...f, hotelName: e.target.value }))}
                    />
                  ) : (
                    <h2 className="text-xl font-bold text-charcoal font-playfair">{selectedLead.hotelName}</h2>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-3">
                  {!editMode ? (
                    <button onClick={() => { setEditMode(true); setEditForm({ ...selectedLead }); }} className="p-2 rounded-sm hover:bg-gray-100 text-gray-500">
                      <Edit className="w-4 h-4" />
                    </button>
                  ) : (
                    <button onClick={handleSaveEdit} className="p-2 rounded-sm hover:bg-green-50 text-green-600">
                      <Save className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => { setSelectedLead(null); setEditMode(false); }} className="p-2 rounded-sm hover:bg-gray-100 text-gray-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stage selector */}
              <div className="flex flex-wrap gap-1.5">
                {COLUMNS.map(col => (
                  <button
                    key={col.id}
                    onClick={() => handleStageChange(col.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      selectedLead.status === col.id ? 'bg-copper text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact info */}
            <div className="p-5 border-b border-gray-100 space-y-2">
              {[
                { Icon: User, value: `${selectedLead.contactName} · ${selectedLead.role}` },
                { Icon: Phone, value: selectedLead.phone || selectedLead.mobile },
                { Icon: Mail, value: selectedLead.email },
                { Icon: MapPin, value: [selectedLead.city, selectedLead.country].filter(Boolean).join(', ') },
                { Icon: Globe, value: selectedLead.timezone },
              ].filter(r => r.value).map(({ Icon, value }) => (
                <div key={value} className="flex items-center gap-2 text-sm text-gray-600">
                  <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>{value}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 text-sm font-bold text-copper">
                <DollarSign className="w-4 h-4 flex-shrink-0" />
                <span>£{selectedLead.value?.toLocaleString()}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'SMS',           Icon: MessageSquare, color: 'bg-green-500 hover:bg-green-600',   onClick: handleSMS },
                  { label: 'Call',          Icon: Phone,         color: 'bg-blue-500 hover:bg-blue-600',    onClick: handleCall },
                  { label: 'Email',         Icon: Mail,          color: 'bg-orange-500 hover:bg-orange-600', onClick: handleEmail },
                  { label: 'Schedule Demo', Icon: Calendar,      color: 'bg-purple-500 hover:bg-purple-600', onClick: handleScheduleDemo },
                ].map(({ label, Icon, color, onClick }) => (
                  <button key={label} onClick={onClick}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 ${color} text-white rounded-sm text-sm font-medium transition-colors`}
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">Activity Timeline</h3>
              <div className="space-y-3">
                {(selectedLead.activities || []).slice().reverse().map(act => (
                  <div key={act.id} className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">{getActivityIcon(act.type)}</div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-charcoal capitalize">{act.type.replace(/_/g, ' ')}</p>
                      {act.note && <p className="text-xs text-gray-500 mt-0.5">{act.note}</p>}
                      <p className="text-xs text-gray-400 mt-0.5">{timeAgo(act.timestamp)} · {act.user}</p>
                    </div>
                  </div>
                ))}
                {!(selectedLead.activities?.length) && (
                  <p className="text-xs text-gray-400">No activity yet</p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="p-5">
              <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">Notes</h3>
              <div className="space-y-2 mb-3">
                {(selectedLead.notes || []).map(note => (
                  <div key={note.id} className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                    <p className="text-sm text-gray-700">{note.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{note.user} · {new Date(note.timestamp).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-copper/30 focus:border-copper"
                  placeholder="Add a note…"
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddNote()}
                />
                <button
                  onClick={handleAddNote}
                  className="px-3 py-2 bg-copper text-white rounded-lg text-sm font-medium hover:bg-copper/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* SMS Modal */}
      {showSMSModal && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowSMSModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm pointer-events-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-charcoal">Send SMS</h2>
                <button onClick={() => setShowSMSModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <textarea
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-copper/30 mb-3"
                rows={4}
                placeholder="Enter your message…"
                value={smsMessage}
                onChange={e => setSmsMessage(e.target.value)}
              />
              <div className="flex gap-2">
                <button onClick={() => setShowSMSModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                <button onClick={sendSMS} className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600">Send</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Schedule Demo Modal */}
      {showDemoModal && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowDemoModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm pointer-events-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="font-bold text-charcoal flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-500" /> Schedule Demo
                </h2>
                <button onClick={() => setShowDemoModal(false)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-500">Demo for <strong>{selectedLead?.hotelName}</strong></p>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Date *</label>
                  <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-copper/30"
                    value={demoForm.date} onChange={e => setDemoForm(f => ({ ...f, date: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Time *</label>
                  <input type="time" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-copper/30"
                    value={demoForm.time} onChange={e => setDemoForm(f => ({ ...f, time: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-3 px-6 pb-5">
                <button onClick={() => setShowDemoModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={handleScheduleDemoSubmit} className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600">
                  Confirm &amp; Add to Calendar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
