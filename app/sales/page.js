'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, Phone, Mail, MapPin, Calendar, Plus, ChevronDown, StickyNote, Send } from 'lucide-react';

const STATUS_COLORS = {
  lead: 'bg-gray-100 text-gray-700',
  contacted: 'bg-blue-100 text-blue-700',
  demo: 'bg-purple-100 text-purple-700',
  proposal: 'bg-yellow-100 text-yellow-700',
  won: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700',
};
const STATUSES = ['lead', 'contacted', 'demo', 'proposal', 'won', 'lost'];
const IC = 'w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper text-sm';

export default function SalesDashboard() {
  const [rep, setRep] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [filter, setFilter] = useState('all');

  const fetchData = useCallback(async () => {
    const r = await fetch('/api/sales/my-leads');
    if (r.ok) {
      const data = await r.json();
      setRep(data.rep);
      setLeads(data.leads);
      if (selectedLead) {
        const updated = data.leads.find(l => l.id === selectedLead.id);
        if (updated) setSelectedLead(updated);
      }
    }
    setLoading(false);
  }, [selectedLead?.id]);

  useEffect(() => { fetchData(); }, []);

  const handleStatusChange = async (leadId, status) => {
    setUpdatingStatus(true);
    await fetch(`/api/crm/leads/${leadId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, lastActivity: `Status changed to ${status}` }),
    });
    await fetchData();
    setUpdatingStatus(false);
  };

  const handleAddNote = async () => {
    if (!noteText.trim() || !selectedLead) return;
    setAddingNote(true);
    await fetch(`/api/crm/leads/${selectedLead.id}/notes`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: noteText, user: rep?.name || 'Sales Rep' }),
    });
    setNoteText('');
    await fetchData();
    setAddingNote(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-copper" /></div>;
  }

  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter);
  const counts = STATUSES.reduce((acc, s) => { acc[s] = leads.filter(l => l.status === s).length; return acc; }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-charcoal">My Leads</h1>
        <p className="text-gray-500 text-sm mt-0.5">{leads.length} lead{leads.length !== 1 ? 's' : ''} assigned to you</p>
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-charcoal text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
          All ({leads.length})
        </button>
        {STATUSES.map(s => counts[s] > 0 && (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filter === s ? 'bg-charcoal text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
            {s} ({counts[s]})
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Lead list */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400 bg-white rounded-sm border border-gray-200">No leads in this stage</div>
          )}
          {filtered.map(lead => (
            <button key={lead.id} onClick={() => setSelectedLead(lead)}
              className={`w-full text-left bg-white border rounded-sm p-4 hover:border-copper transition-colors ${selectedLead?.id === lead.id ? 'border-copper ring-1 ring-copper/20' : 'border-gray-200'}`}>
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-charcoal text-sm">{lead.hotelName}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS[lead.status]}`}>{lead.status}</span>
              </div>
              <p className="text-xs text-gray-500">{lead.contactName} · {lead.role}</p>
              {lead.city && <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{lead.city}, {lead.country}</p>}
              <p className="text-xs text-gray-400 mt-1">{lead.lastActivity}</p>
            </button>
          ))}
        </div>

        {/* Lead detail */}
        <div className="lg:col-span-3">
          {!selectedLead ? (
            <div className="bg-white border border-gray-200 rounded-sm flex items-center justify-center h-64 text-gray-400">
              Select a lead to view details
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-sm">
              {/* Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-bold text-charcoal text-lg">{selectedLead.hotelName}</h2>
                    <p className="text-sm text-gray-500">{selectedLead.contactName} · {selectedLead.role}</p>
                  </div>
                  <select value={selectedLead.status} onChange={e => handleStatusChange(selectedLead.id, e.target.value)}
                    disabled={updatingStatus}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-copper capitalize ${STATUS_COLORS[selectedLead.status]}`}>
                    {STATUSES.map(s => <option key={s} value={s} className="bg-white text-charcoal capitalize">{s}</option>)}
                  </select>
                </div>

                {/* Contact info */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  {selectedLead.email && (
                    <a href={`mailto:${selectedLead.email}`} className="flex items-center gap-2 text-gray-600 hover:text-copper">
                      <Mail className="w-4 h-4 text-gray-400" />{selectedLead.email}
                    </a>
                  )}
                  {selectedLead.phone && (
                    <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-copper">
                      <Phone className="w-4 h-4 text-gray-400" />{selectedLead.phone}
                    </a>
                  )}
                  {selectedLead.city && (
                    <span className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />{selectedLead.city}, {selectedLead.country}
                    </span>
                  )}
                  {selectedLead.nextActionDate && (
                    <span className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(selectedLead.nextActionDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="p-5">
                <h3 className="text-sm font-semibold text-charcoal mb-3 flex items-center gap-2">
                  <StickyNote className="w-4 h-4 text-gray-400" /> Notes
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
                  {selectedLead.notes?.length === 0 && <p className="text-xs text-gray-400">No notes yet</p>}
                  {selectedLead.notes?.map(note => (
                    <div key={note.id} className="bg-gray-50 rounded-sm px-3 py-2">
                      <p className="text-sm text-charcoal">{note.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{note.user} · {new Date(note.timestamp).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={noteText} onChange={e => setNoteText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleAddNote()}
                    placeholder="Add a note…" className={IC + ' flex-1'} />
                  <button onClick={handleAddNote} disabled={addingNote || !noteText.trim()}
                    className="px-3 py-2 bg-copper text-white rounded-sm hover:bg-copper-hover disabled:bg-gray-300 transition-colors">
                    {addingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Activity */}
              {selectedLead.activities?.length > 0 && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-semibold text-charcoal mb-3">Activity</h3>
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {[...selectedLead.activities].reverse().map(a => (
                      <div key={a.id} className="flex items-start gap-2 text-xs text-gray-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-copper mt-1.5 flex-shrink-0" />
                        <div>
                          <span className="capitalize font-medium text-charcoal">{a.type.replace(/_/g, ' ')}</span>
                          {a.note && ` — ${a.note}`}
                          <span className="text-gray-400 ml-1">· {new Date(a.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
