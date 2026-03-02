'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, DollarSign, Award, Plus, Edit, Trash2, X, Users, UserCheck, Loader2, Key, ChevronDown } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';

const IC = 'w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper text-sm';
const TABS = ['Team', 'Lead Assignment', 'KPIs'];

const STATUS_COLORS = {
  lead: 'bg-gray-100 text-gray-700',
  contacted: 'bg-blue-100 text-blue-700',
  demo: 'bg-purple-100 text-purple-700',
  proposal: 'bg-yellow-100 text-yellow-700',
  won: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700',
};

export default function SalesPage() {
  const { toast, confirm } = useNotification();
  const [tab, setTab] = useState('Team');
  const [reps, setReps] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRep, setEditingRep] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', region: '' });
  const [resetPasswordId, setResetPasswordId] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const fetchReps = useCallback(async () => {
    const r = await fetch('/api/sales/reps');
    if (r.ok) setReps(await r.json());
  }, []);

  const fetchLeads = useCallback(async () => {
    const r = await fetch('/api/crm/leads');
    if (r.ok) setLeads(await r.json());
  }, []);

  useEffect(() => {
    Promise.all([fetchReps(), fetchLeads()]).finally(() => setLoading(false));
  }, [fetchReps, fetchLeads]);

  const openAdd = () => { setEditingRep(null); setForm({ name: '', email: '', password: '', region: '' }); setShowModal(true); };
  const openEdit = (rep) => { setEditingRep(rep); setForm({ name: rep.name, email: rep.email, password: '', region: rep.region }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) { toast.error('Name and email are required'); return; }
    if (!editingRep && !form.password.trim()) { toast.error('Password is required for new reps'); return; }
    setSaving(true);
    try {
      const url = editingRep ? `/api/sales/reps/${editingRep.id}` : '/api/sales/reps';
      const method = editingRep ? 'PUT' : 'POST';
      const body = { name: form.name, email: form.email, region: form.region };
      if (form.password.trim()) body.password = form.password;
      const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Failed');
      toast.success(editingRep ? `${data.name} updated` : `${data.name} added to sales team`);
      setShowModal(false);
      fetchReps();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (rep) => {
    const ok = await confirm({ title: 'Remove Sales Rep', message: `Remove ${rep.name}? Their leads will be unassigned.`, variant: 'danger' });
    if (!ok) return;
    const r = await fetch(`/api/sales/reps/${rep.id}`, { method: 'DELETE' });
    if (r.ok) { toast.success(`${rep.name} removed`); fetchReps(); fetchLeads(); }
    else toast.error('Failed to remove rep');
  };

  const handleToggleActive = async (rep) => {
    const r = await fetch(`/api/sales/reps/${rep.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !rep.isActive }),
    });
    if (r.ok) { toast.success(`${rep.name} ${rep.isActive ? 'deactivated' : 'activated'}`); fetchReps(); }
  };

  const handleResetPassword = async (repId) => {
    if (!newPassword.trim()) { toast.error('Enter a new password'); return; }
    const r = await fetch(`/api/sales/reps/${repId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: newPassword }),
    });
    if (r.ok) { toast.success('Password updated'); setResetPasswordId(null); setNewPassword(''); }
    else toast.error('Failed to update password');
  };

  const handleAssign = async (leadId, repId) => {
    const r = await fetch(`/api/crm/leads/${leadId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignedToId: repId || null }),
    });
    if (r.ok) {
      const rep = reps.find(r => r.id === parseInt(repId));
      toast.success(rep ? `Assigned to ${rep.name}` : 'Unassigned');
      fetchLeads();
    } else toast.error('Failed to assign lead');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-copper" /></div>;
  }

  const activeReps = reps.filter(r => r.isActive);
  const totalLeads = leads.length;
  const assignedLeads = leads.filter(l => l.assignedToId).length;
  const wonLeads = leads.filter(l => l.status === 'won').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal font-playfair">Sales & Commissions</h1>
          <p className="text-gray-600 mt-1">Manage sales team and assign leads</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-copper text-white px-5 py-2.5 rounded-sm hover:bg-copper-hover transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Sales Rep
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Sales Reps', value: activeReps.length, icon: Users, color: 'text-copper' },
          { label: 'Total Leads', value: totalLeads, icon: TrendingUp, color: 'text-blue-500' },
          { label: 'Assigned', value: assignedLeads, icon: UserCheck, color: 'text-purple-500' },
          { label: 'Deals Won', value: wonLeads, icon: Award, color: 'text-green-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white p-5 rounded-sm shadow-sm border border-gray-200 flex items-center justify-between">
            <div><p className="text-sm text-gray-500">{label}</p><p className="text-2xl font-bold text-charcoal mt-1">{value}</p></div>
            <Icon className={`w-10 h-10 opacity-20 ${color}`} />
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 ${tab === t ? 'border-copper text-copper' : 'border-transparent text-gray-500 hover:text-charcoal'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── TEAM TAB ── */}
      {tab === 'Team' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reps.length === 0 && (
            <div className="col-span-3 text-center py-16 text-gray-400">No sales reps yet. Add one above.</div>
          )}
          {reps.map((rep) => (
            <div key={rep.id} className={`bg-white border rounded-sm p-5 ${rep.isActive ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-charcoal">{rep.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rep.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {rep.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{rep.email}</p>
                  {rep.region && <p className="text-xs text-gray-400 mt-0.5">{rep.region}</p>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(rep)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(rep)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-sm">
                <span className="text-gray-500"><strong className="text-charcoal">{rep._count?.leads ?? 0}</strong> leads assigned</span>
                <div className="flex gap-2">
                  <button onClick={() => handleToggleActive(rep)} className="text-xs text-gray-500 hover:text-charcoal underline">
                    {rep.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => { setResetPasswordId(rep.id); setNewPassword(''); }} className="text-xs text-copper hover:text-copper-hover flex items-center gap-1">
                    <Key className="w-3 h-3" /> Reset PW
                  </button>
                </div>
              </div>

              {resetPasswordId === rep.id && (
                <div className="mt-3 flex gap-2">
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    placeholder="New password" className={IC + ' flex-1'} />
                  <button onClick={() => handleResetPassword(rep.id)}
                    className="px-3 py-2 bg-copper text-white text-xs rounded-sm hover:bg-copper-hover">Save</button>
                  <button onClick={() => setResetPasswordId(null)}
                    className="px-3 py-2 bg-gray-100 text-gray-600 text-xs rounded-sm hover:bg-gray-200">Cancel</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── LEAD ASSIGNMENT TAB ── */}
      {tab === 'Lead Assignment' && (
        <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Hotel', 'Contact', 'Status', 'Value', 'Assigned To'].map((h, i) => (
                    <th key={h} className={`py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-12 text-gray-400">No leads in the CRM yet</td></tr>
                )}
                {leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-charcoal">{lead.hotelName}</td>
                    <td className="py-3 px-4 text-gray-600">{lead.contactName}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[lead.status] || 'bg-gray-100 text-gray-600'}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">£{lead.value?.toLocaleString() || 0}</td>
                    <td className="py-3 px-4">
                      <select
                        value={lead.assignedToId || ''}
                        onChange={e => handleAssign(lead.id, e.target.value)}
                        className="w-48 px-2 py-1.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-copper"
                      >
                        <option value="">— Unassigned —</option>
                        {activeReps.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── KPIs TAB ── */}
      {tab === 'KPIs' && (
        <div className="space-y-4">
          {activeReps.length === 0 && <p className="text-center text-gray-400 py-12">No active sales reps</p>}
          {activeReps.map(rep => {
            const repLeads = leads.filter(l => l.assignedToId === rep.id);
            const won = repLeads.filter(l => l.status === 'won').length;
            const inProgress = repLeads.filter(l => !['won', 'lost'].includes(l.status)).length;
            const pipeline = repLeads.reduce((s, l) => s + (l.value || 0), 0);
            return (
              <div key={rep.id} className="bg-white border border-gray-200 rounded-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-charcoal">{rep.name}</h3>
                    <p className="text-sm text-gray-500">{rep.email} {rep.region && `· ${rep.region}`}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-copper/10 text-copper rounded-full font-medium">{repLeads.length} leads</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Deals Won', value: won, color: 'text-green-600' },
                    { label: 'In Progress', value: inProgress, color: 'text-blue-600' },
                    { label: 'Pipeline Value', value: `£${pipeline.toLocaleString()}`, color: 'text-copper' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="bg-gray-50 rounded-sm p-3 text-center">
                      <p className="text-xs text-gray-400 mb-1">{label}</p>
                      <p className={`text-xl font-bold ${color}`}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Commission structure */}
          <div className="bg-white border border-gray-200 rounded-sm p-5">
            <h3 className="font-bold text-charcoal mb-3">Commission Structure</h3>
            <div className="space-y-2 text-sm">
              {[['Setup Fee Commission', '15%'], ['First Year MRR', '10%'], ['Recurring MRR (year 2+)', '5%']].map(([l, v]) => (
                <div key={l} className="flex justify-between p-3 bg-gray-50 rounded-sm">
                  <span className="text-gray-600">{l}</span>
                  <span className="font-bold text-charcoal">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-sm shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-charcoal">{editingRep ? 'Edit Sales Rep' : 'Add Sales Rep'}</h3>
                <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={IC} placeholder="e.g. Sarah Mitchell" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={IC} placeholder="sarah@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {editingRep ? 'New Password (leave blank to keep current)' : 'Password *'}
                  </label>
                  <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className={IC} placeholder={editingRep ? 'Leave blank to keep current' : 'Min. 8 characters'} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                  <input type="text" value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} className={IC} placeholder="e.g. UK & Ireland" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 py-2.5 bg-copper text-white rounded-sm hover:bg-copper-hover transition-colors disabled:bg-gray-300 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingRep ? 'Update' : 'Add Rep'}
                </button>
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
