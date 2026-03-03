'use client';

import { useState, useEffect, useCallback } from 'react';
import SmartProspectTab from './SmartProspectTab';
import {
  Megaphone,
  Plus,
  RefreshCw,
  Loader2,
  Play,
  Pause,
  Square,
  Trash2,
  ChevronRight,
  Mail,
  Users,
  BarChart2,
  Inbox,
  Send,
  MousePointerClick,
  AlertCircle,
  CheckCircle,
  X,
  Eye,
  MessageSquare,
  ArrowLeft,
  Globe,
  Clock,
  TrendingUp,
  Server,
  Search,
  Copy,
  Activity,
  Reply,
  UserCheck,
  UserX,
  Zap,
  Building2,
  MapPin,
  Download,
  Filter,
  Calendar,
  List,
  Settings2,
  Tag,
  Wifi,
  Shield,
  Folder,
  FolderPlus,
  Ban,
  UserMinus,
  FileSearch,
  Hash,
  ChevronDown,
  MailOpen,
  Star,
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const sl = (path, opts = {}) =>
  fetch(`/api/smartlead/${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  }).then((r) => r.json());

function pct(num, denom) {
  if (!denom) return '0%';
  return `${Math.round((num / denom) * 100)}%`;
}

function fmt(n) {
  return (n ?? 0).toLocaleString();
}

function fmtDate(raw) {
  if (!raw) return '—';
  try {
    return new Date(raw).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return raw;
  }
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  ACTIVE:   'bg-green-100 text-green-700 border-green-200',
  PAUSED:   'bg-yellow-100 text-yellow-700 border-yellow-200',
  STOPPED:  'bg-red-100 text-red-700 border-red-200',
  COMPLETE: 'bg-blue-100 text-blue-700 border-blue-200',
  DRAFT:    'bg-gray-100 text-gray-600 border-gray-200',
};

function StatusBadge({ status }) {
  const s = (status || 'DRAFT').toUpperCase();
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLES[s] || STATUS_STYLES.DRAFT}`}>
      {s}
    </span>
  );
}

// ─── KPI card ─────────────────────────────────────────────────────────────────

function KPI({ icon: Icon, label, value, sub, color = 'text-copper' }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center">
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <span className="text-sm font-medium text-gray-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-charcoal">{value ?? '—'}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function Empty({ icon: Icon, title, sub }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Icon className="w-10 h-10 text-gray-200 mb-3" />
      <p className="font-semibold text-gray-400">{title}</p>
      {sub && <p className="text-sm text-gray-300 mt-1">{sub}</p>}
    </div>
  );
}

// ─── Error banner ─────────────────────────────────────────────────────────────

function ErrBanner({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      {msg}
    </div>
  );
}

// ─── Create Campaign Modal ────────────────────────────────────────────────────

function CreateCampaignModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    name: '',
    start_date: '',
    end_date: '',
    timezone: 'Europe/London',
    schedule_start_time: '08:00',
    schedule_end_time: '18:00',
    min_time_btwn_emails: 5,
    max_leads_per_day: 100,
    days_of_the_week: [1, 2, 3, 4, 5],
    track_settings: 'DONT_TRACK_EMAIL_OPEN_DONT_TRACK_LINK_CLICK',
    stop_lead_settings: 'REPLIED_TO_AN_EMAIL',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleDay = (d) =>
    setForm((f) => ({
      ...f,
      days_of_the_week: f.days_of_the_week.includes(d)
        ? f.days_of_the_week.filter((x) => x !== d)
        : [...f.days_of_the_week, d].sort(),
    }));

  const handleSubmit = async () => {
    if (!form.name.trim()) { setErr('Campaign name is required.'); return; }
    setSaving(true);
    setErr('');
    try {
      const res = await sl('campaigns/create', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          name: form.name.trim(),
          start_date: form.start_date || null,
          end_date: form.end_date || null,
        }),
      });
      if (res.error || res.message?.toLowerCase().includes('error')) {
        throw new Error(res.error || res.message || 'Failed to create campaign');
      }
      onCreated();
      onClose();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-charcoal focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/30 transition-colors';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="font-bold text-charcoal text-lg">New Campaign</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-6 space-y-4">
          <ErrBanner msg={err} />

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Campaign Name *</label>
            <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Hotel Outreach Q1 2026" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Start Date</label>
              <input type="date" className={inputCls} value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">End Date</label>
              <input type="date" className={inputCls} value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Timezone</label>
            <select className={inputCls} value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })}>
              {['Europe/London','Europe/Paris','America/New_York','America/Los_Angeles','America/Chicago','Asia/Dubai','Asia/Singapore','Australia/Sydney'].map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Schedule Start</label>
              <input type="time" className={inputCls} value={form.schedule_start_time} onChange={(e) => setForm({ ...form, schedule_start_time: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Schedule End</label>
              <input type="time" className={inputCls} value={form.schedule_end_time} onChange={(e) => setForm({ ...form, schedule_end_time: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Min Gap Between Emails (min)</label>
              <input type="number" min={1} className={inputCls} value={form.min_time_btwn_emails} onChange={(e) => setForm({ ...form, min_time_btwn_emails: +e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Max Leads / Day</label>
              <input type="number" min={1} className={inputCls} value={form.max_leads_per_day} onChange={(e) => setForm({ ...form, max_leads_per_day: +e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">Send Days</label>
            <div className="flex gap-2">
              {days.map((d, i) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDay(i)}
                  className={`w-9 h-9 rounded-lg text-xs font-semibold border transition-colors ${
                    form.days_of_the_week.includes(i)
                      ? 'bg-copper text-white border-copper'
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-copper'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Stop Lead When</label>
            <select className={inputCls} value={form.stop_lead_settings} onChange={(e) => setForm({ ...form, stop_lead_settings: e.target.value })}>
              <option value="REPLIED_TO_AN_EMAIL">Lead replies to email</option>
              <option value="EMAIL_OPENED">Lead opens email</option>
              <option value="LINK_CLICKED">Lead clicks a link</option>
              <option value="MEETING_BOOKED">Meeting booked</option>
              <option value="NEVER">Never (send all steps)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Tracking</label>
            <select className={inputCls} value={form.track_settings} onChange={(e) => setForm({ ...form, track_settings: e.target.value })}>
              <option value="DONT_TRACK_EMAIL_OPEN_DONT_TRACK_LINK_CLICK">No tracking</option>
              <option value="TRACK_EMAIL_OPEN_DONT_TRACK_LINK_CLICK">Track opens only</option>
              <option value="DONT_TRACK_EMAIL_OPEN_TRACK_LINK_CLICK">Track clicks only</option>
              <option value="TRACK_EMAIL_OPEN_TRACK_LINK_CLICK">Track opens & clicks</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-200 sticky bottom-0 bg-white">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-copper text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-copper-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {saving ? 'Creating…' : 'Create Campaign'}
          </button>
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-charcoal transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Leads Modal ──────────────────────────────────────────────────────────

function AddLeadsModal({ campaignId, onClose, onAdded }) {
  const [raw, setRaw] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  const handleSubmit = async () => {
    setErr(''); setOk('');
    const lines = raw.trim().split('\n').map((l) => l.trim()).filter(Boolean);
    if (!lines.length) { setErr('Enter at least one email address.'); return; }

    const lead_list = lines.map((line) => {
      const [email, first_name = '', last_name = ''] = line.split(',').map((s) => s.trim());
      return { email, first_name, last_name };
    });

    setSaving(true);
    try {
      const res = await sl(`campaigns/${campaignId}/leads`, {
        method: 'POST',
        body: JSON.stringify({ lead_list }),
      });
      if (res.error) throw new Error(res.error);
      setOk(`${lead_list.length} lead(s) added successfully.`);
      setRaw('');
      onAdded();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="font-bold text-charcoal">Add Leads</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 space-y-4">
          <ErrBanner msg={err} />
          {ok && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-3 py-2 text-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              {ok}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Email addresses <span className="font-normal text-gray-400">(one per line, optionally: email, first, last)</span>
            </label>
            <textarea
              rows={8}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/30 resize-none font-mono"
              placeholder="john@hotel.com&#10;jane@resort.com, Jane, Doe"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-copper text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-copper-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {saving ? 'Adding…' : 'Add Leads'}
          </button>
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-charcoal transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── Campaigns Tab ────────────────────────────────────────────────────────────

function CampaignsTab({ campaigns, loading, err, onRefresh, onSelectCampaign }) {
  const [showCreate, setShowCreate] = useState(false);
  const [actioning, setActioning] = useState(null);
  const [actionErr, setActionErr] = useState('');

  const setStatus = async (id, status) => {
    setActioning(id);
    setActionErr('');
    try {
      await sl(`campaigns/${id}/status`, {
        method: 'POST',
        body: JSON.stringify({ status }),
      });
      onRefresh();
    } catch {
      setActionErr('Action failed. Please try again.');
    } finally {
      setActioning(null);
    }
  };

  const cloneCampaign = async (id, name) => {
    setActioning(id);
    setActionErr('');
    try {
      await sl(`campaigns/${id}/clone`, { method: 'POST', body: JSON.stringify({}) });
      onRefresh();
    } catch {
      setActionErr('Clone failed. Please try again.');
    } finally {
      setActioning(null);
    }
  };

  const deleteCampaign = async (id, name) => {
    if (!confirm(`Delete campaign "${name}"? This cannot be undone.`)) return;
    setActioning(id);
    try {
      await sl(`campaigns/${id}`, { method: 'DELETE' });
      onRefresh();
    } catch {
      setActionErr('Delete failed.');
    } finally {
      setActioning(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''}</p>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 bg-copper text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-copper-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      <ErrBanner msg={actionErr} />

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-copper" /></div>
      ) : err ? (
        <ErrBanner msg={err} />
      ) : campaigns.length === 0 ? (
        <Empty icon={Megaphone} title="No campaigns yet" sub="Create your first SmartLead campaign above" />
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => {
            const busy = actioning === c.id;
            const status = (c.status || 'DRAFT').toUpperCase();
            return (
              <div key={c.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:border-copper/40 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="font-bold text-charcoal truncate">{c.name}</h3>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="text-xs text-gray-400">
                      Created {fmtDate(c.created_at)}
                      {c.start_date && ` · Starts ${fmtDate(c.start_date)}`}
                      {c.end_date && ` · Ends ${fmtDate(c.end_date)}`}
                    </p>

                    {/* Inline stats if available */}
                    {(c.sent_count != null || c.open_count != null) && (
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Send className="w-3 h-3" /> {fmt(c.sent_count)} sent</span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {pct(c.open_count, c.sent_count)} open</span>
                        <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {pct(c.reply_count, c.sent_count)} reply</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {busy ? (
                      <Loader2 className="w-4 h-4 animate-spin text-copper" />
                    ) : (
                      <>
                        {status === 'ACTIVE' && (
                          <button onClick={() => setStatus(c.id, 'PAUSED')} title="Pause" className="p-2 rounded-lg hover:bg-yellow-50 text-yellow-600 transition-colors">
                            <Pause className="w-4 h-4" />
                          </button>
                        )}
                        {(status === 'PAUSED' || status === 'DRAFT') && (
                          <button onClick={() => setStatus(c.id, 'ACTIVE')} title="Resume" className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors">
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        {status !== 'STOPPED' && status !== 'COMPLETE' && (
                          <button onClick={() => setStatus(c.id, 'STOPPED')} title="Stop" className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                            <Square className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => cloneCampaign(c.id, c.name)} title="Clone" className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button onClick={() => onSelectCampaign(c)} title="View details" className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteCampaign(c.id, c.name)} title="Delete" className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreate && <CreateCampaignModal onClose={() => setShowCreate(false)} onCreated={onRefresh} />}
    </div>
  );
}

// ─── Campaign Detail (analytics + leads + inbox) ──────────────────────────────

function CampaignDetail({ campaign, onBack }) {
  const [tab, setTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsMeta, setLeadsMeta] = useState({ total: 0, offset: 0 });
  const [showAddLeads, setShowAddLeads] = useState(false);

  const [selectedLead, setSelectedLead] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const [emailAccounts, setEmailAccounts] = useState([]);
  const [emailAccountsLoading, setEmailAccountsLoading] = useState(false);
  const [leadActioning, setLeadActioning] = useState(null);

  const [replyBody, setReplyBody] = useState('');
  const [replySending, setReplySending] = useState(false);
  const [replyErr, setReplyErr] = useState('');

  // Fetch analytics
  useEffect(() => {
    setAnalyticsLoading(true);
    sl(`campaigns/${campaign.id}/analytics`)
      .then((d) => setAnalytics(d))
      .catch(() => {})
      .finally(() => setAnalyticsLoading(false));
  }, [campaign.id]);

  // Fetch leads
  const fetchLeads = useCallback(async (offset = 0) => {
    setLeadsLoading(true);
    try {
      const d = await sl(`campaigns/${campaign.id}/leads?offset=${offset}&limit=20`);
      setLeads(d.data || d.leads || []);
      setLeadsMeta({ total: d.total || 0, offset });
    } catch {}
    finally { setLeadsLoading(false); }
  }, [campaign.id]);

  // Fetch email accounts
  const fetchEmailAccounts = useCallback(async () => {
    setEmailAccountsLoading(true);
    try {
      const d = await sl(`campaigns/${campaign.id}/email-accounts`);
      setEmailAccounts(d.data || d.email_accounts || d || []);
    } catch {}
    finally { setEmailAccountsLoading(false); }
  }, [campaign.id]);

  useEffect(() => {
    if (tab === 'leads') fetchLeads();
    if (tab === 'accounts') fetchEmailAccounts();
  }, [tab, fetchLeads, fetchEmailAccounts]);

  // Pause / Resume a lead
  const toggleLeadPause = async (lead) => {
    const isPaused = lead.is_paused;
    setLeadActioning(lead.id);
    try {
      await sl(`campaigns/${campaign.id}/leads/${lead.id}/${isPaused ? 'resume' : 'pause'}`, { method: 'POST', body: JSON.stringify({}) });
      fetchLeads(leadsMeta.offset);
    } catch {}
    finally { setLeadActioning(null); }
  };

  // Delete lead from campaign
  const deleteLead = async (lead) => {
    if (!confirm(`Remove ${lead.lead_email || lead.email} from this campaign?`)) return;
    setLeadActioning(lead.id);
    try {
      await sl(`campaigns/${campaign.id}/leads/${lead.id}`, { method: 'DELETE' });
      fetchLeads(leadsMeta.offset);
    } catch {}
    finally { setLeadActioning(null); }
  };

  // Unsubscribe lead from campaign
  const unsubscribeLead = async (lead) => {
    if (!confirm(`Unsubscribe ${lead.lead_email || lead.email} from this campaign?`)) return;
    setLeadActioning(lead.id);
    try {
      await sl('leads/unsubscribe', {
        method: 'POST',
        body: JSON.stringify({ campaign_id: campaign.id, lead_id: lead.id }),
      });
      fetchLeads(leadsMeta.offset);
    } catch {}
    finally { setLeadActioning(null); }
  };

  // Unsubscribe lead from all campaigns
  const unsubscribeLeadAll = async (lead) => {
    if (!confirm(`Unsubscribe ${lead.lead_email || lead.email} from ALL campaigns?`)) return;
    setLeadActioning(lead.id);
    try {
      await sl('leads/unsubscribe-from-all', {
        method: 'POST',
        body: JSON.stringify({ lead_id: lead.id }),
      });
      fetchLeads(leadsMeta.offset);
    } catch {}
    finally { setLeadActioning(null); }
  };

  // Move lead to inactive
  const moveToInactive = async (lead) => {
    setLeadActioning(lead.id);
    try {
      await sl('leads/move-to-inactive', {
        method: 'POST',
        body: JSON.stringify({ campaign_id: campaign.id, lead_id: lead.id }),
      });
      fetchLeads(leadsMeta.offset);
    } catch {}
    finally { setLeadActioning(null); }
  };

  // Get lead sequence details
  const [leadSeqDetails, setLeadSeqDetails] = useState(null);
  const [showLeadSeq, setShowLeadSeq] = useState(null);

  const fetchLeadSeqDetails = async (lead) => {
    setShowLeadSeq(lead.id);
    setLeadSeqDetails(null);
    try {
      const d = await sl(`campaigns/${campaign.id}/leads/${lead.id}/sequence-details`);
      setLeadSeqDetails(d.data || d);
    } catch {}
  };

  // Send reply from inbox
  const sendReply = async () => {
    if (!replyBody.trim() || !selectedLead) return;
    const lastMsg = messages[messages.length - 1];
    setReplySending(true);
    setReplyErr('');
    try {
      await sl(`campaigns/${campaign.id}/reply-email-thread`, {
        method: 'POST',
        body: JSON.stringify({
          lead_id: selectedLead.id,
          reply_message_id: lastMsg?.message_id || lastMsg?.id,
          reply_email_body: replyBody.trim(),
        }),
      });
      setReplyBody('');
      openLead(selectedLead);
    } catch {
      setReplyErr('Failed to send reply. Please try again.');
    } finally {
      setReplySending(false);
    }
  };

  // Fetch message history for a lead
  const openLead = async (lead) => {
    setSelectedLead(lead);
    setMessages([]);
    setMessagesLoading(true);
    try {
      const d = await sl(`campaigns/${campaign.id}/leads/${lead.id}/message-history`);
      setMessages(d.list || d.messages || d || []);
    } catch {}
    finally { setMessagesLoading(false); }
  };

  const CATEGORY_COLORS = {
    Interested: 'bg-green-100 text-green-700',
    'Not Interested': 'bg-red-100 text-red-700',
    'Meeting Booked': 'bg-blue-100 text-blue-700',
    Unsubscribed: 'bg-gray-100 text-gray-600',
    'Out of Office': 'bg-yellow-100 text-yellow-700',
    'Wrong Person': 'bg-orange-100 text-orange-700',
  };

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'accounts', label: 'Email Accounts', icon: Server },
    { id: 'sequence', label: 'Sequence', icon: List },
    { id: 'settings', label: 'Settings', icon: Settings2 },
    { id: 'stats', label: 'Stats', icon: BarChart2 },
    { id: 'export', label: 'Export', icon: Download },
  ];

  return (
    <div>
      {/* Back header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-charcoal transition-colors">
          <ArrowLeft className="w-4 h-4" />
          All Campaigns
        </button>
        <span className="text-gray-300">/</span>
        <h2 className="font-bold text-charcoal">{campaign.name}</h2>
        <StatusBadge status={campaign.status} />
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === id ? 'bg-white text-copper shadow-sm' : 'text-gray-500 hover:text-charcoal'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Analytics tab ── */}
      {tab === 'analytics' && (
        <div>
          {analyticsLoading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-copper" /></div>
          ) : analytics ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KPI icon={Send} label="Emails Sent" value={fmt(analytics.sent_count)} />
                <KPI icon={Eye} label="Open Rate" value={pct(analytics.unique_open_count, analytics.sent_count)} sub={`${fmt(analytics.unique_open_count)} unique opens`} color="text-blue-500" />
                <KPI icon={MessageSquare} label="Reply Rate" value={pct(analytics.reply_count, analytics.sent_count)} sub={`${fmt(analytics.reply_count)} replies`} color="text-green-500" />
                <KPI icon={AlertCircle} label="Bounce Rate" value={pct(analytics.bounce_count, analytics.sent_count)} sub={`${fmt(analytics.bounce_count)} bounces`} color="text-red-500" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KPI icon={MousePointerClick} label="Click Rate" value={pct(analytics.unique_click_count, analytics.sent_count)} sub={`${fmt(analytics.unique_click_count)} unique clicks`} color="text-purple-500" />
                <KPI icon={Users} label="Unsubscribed" value={fmt(analytics.unsubscribed_count)} color="text-orange-500" />
                <KPI icon={TrendingUp} label="Total Opens" value={fmt(analytics.open_count)} color="text-blue-400" />
                <KPI icon={CheckCircle} label="Unique Sent" value={fmt(analytics.unique_sent_count)} color="text-green-400" />
              </div>

              {/* Campaign settings */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-bold text-charcoal mb-4 text-sm">Campaign Settings</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {[
                    ['Timezone', campaign.timezone],
                    ['Schedule', `${campaign.schedule_start_time || '—'} – ${campaign.schedule_end_time || '—'}`],
                    ['Max Leads / Day', campaign.max_leads_per_day],
                    ['Min Gap', `${campaign.min_time_btwn_emails ?? '—'} min`],
                    ['Tracking', campaign.track_settings?.replace(/_/g, ' ').toLowerCase()],
                    ['Stop When', campaign.stop_lead_settings?.replace(/_/g, ' ').toLowerCase()],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                      <p className="font-medium text-charcoal capitalize">{val ?? '—'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Empty icon={BarChart2} title="No analytics data" sub="Analytics will appear once the campaign starts sending" />
          )}
        </div>
      )}

      {/* ── Leads tab ── */}
      {tab === 'leads' && (
        <div>
          {selectedLead ? (
            /* Message history view */
            <div>
              <div className="flex items-center gap-3 mb-4">
                <button onClick={() => setSelectedLead(null)} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-charcoal transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Leads
                </button>
                <span className="text-gray-300">/</span>
                <span className="text-sm font-medium text-charcoal">{selectedLead.lead_email || selectedLead.email}</span>
              </div>
              {messagesLoading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-copper" /></div>
              ) : messages.length === 0 ? (
                <Empty icon={MessageSquare} title="No messages yet" sub="Messages will appear when emails are sent to this lead" />
              ) : (
                <div className="space-y-3">
                  {messages.map((m, i) => (
                    <div key={i} className={`rounded-lg p-4 border text-sm ${m.type === 'sent' ? 'bg-copper/5 border-copper/20 ml-8' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-charcoal text-xs">{m.from_email || m.from || (m.type === 'sent' ? 'You' : selectedLead.lead_email)}</span>
                        <span className="text-xs text-gray-400">{fmtDate(m.time || m.date || m.created_at)}</span>
                      </div>
                      {m.subject && <p className="font-medium text-charcoal mb-1">{m.subject}</p>}
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{m.email_body || m.body || m.content || '(no content)'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Leads list */
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">{leadsMeta.total || leads.length} lead{leads.length !== 1 ? 's' : ''}</p>
                <button
                  onClick={() => setShowAddLeads(true)}
                  className="inline-flex items-center gap-2 bg-copper text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-copper-dark transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Leads
                </button>
              </div>

              {leadsLoading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-copper" /></div>
              ) : leads.length === 0 ? (
                <Empty icon={Users} title="No leads yet" sub="Add leads to start sending emails" />
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {['Email', 'Name', 'Category', 'Added', 'Actions'].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead, i) => (
                        <tr key={lead.id ?? i} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-charcoal">{lead.lead_email || lead.email}</td>
                          <td className="px-4 py-3 text-gray-600">{[lead.first_name, lead.last_name].filter(Boolean).join(' ') || '—'}</td>
                          <td className="px-4 py-3">
                            {lead.category ? (
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[lead.category] || 'bg-gray-100 text-gray-600'}`}>
                                {lead.category}
                              </span>
                            ) : '—'}
                          </td>
                          <td className="px-4 py-3 text-gray-400">{fmtDate(lead.created_at)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 flex-wrap">
                              {leadActioning === lead.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-copper" />
                              ) : (
                                <>
                                  <button
                                    onClick={() => toggleLeadPause(lead)}
                                    title={lead.is_paused ? 'Resume lead' : 'Pause lead'}
                                    className={`p-1 rounded transition-colors ${lead.is_paused ? 'text-green-600 hover:bg-green-50' : 'text-yellow-600 hover:bg-yellow-50'}`}
                                  >
                                    {lead.is_paused ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                                  </button>
                                  <button
                                    onClick={() => openLead(lead)}
                                    title="Message history"
                                    className="p-1 rounded text-copper hover:bg-copper/10 transition-colors"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => fetchLeadSeqDetails(lead)}
                                    title="Sequence details"
                                    className="p-1 rounded text-blue-500 hover:bg-blue-50 transition-colors"
                                  >
                                    <List className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => moveToInactive(lead)}
                                    title="Move to inactive"
                                    className="p-1 rounded text-gray-400 hover:bg-gray-100 transition-colors"
                                  >
                                    <UserMinus className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => unsubscribeLead(lead)}
                                    title="Unsubscribe from campaign"
                                    className="p-1 rounded text-orange-500 hover:bg-orange-50 transition-colors"
                                  >
                                    <Ban className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => deleteLead(lead)}
                                    title="Delete lead from campaign"
                                    className="p-1 rounded text-red-500 hover:bg-red-50 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                            {/* Lead sequence details panel */}
                            {showLeadSeq === lead.id && (
                              <div className="mt-2 text-xs bg-blue-50 border border-blue-200 rounded p-2">
                                {leadSeqDetails ? (
                                  <div>
                                    <p className="font-semibold text-blue-700 mb-1">Sequence Details</p>
                                    <pre className="whitespace-pre-wrap text-blue-600 text-[10px]">{JSON.stringify(leadSeqDetails, null, 2)}</pre>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 text-blue-500"><Loader2 className="w-3 h-3 animate-spin" /> Loading…</div>
                                )}
                                <button onClick={() => setShowLeadSeq(null)} className="mt-1 text-blue-400 hover:text-blue-600">Close</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {showAddLeads && (
            <AddLeadsModal campaignId={campaign.id} onClose={() => setShowAddLeads(false)} onAdded={() => fetchLeads()} />
          )}
        </div>
      )}

      {/* ── Inbox tab ── */}
      {tab === 'inbox' && (
        <div>
          {leads.length === 0 && !leadsLoading ? (
            <Empty icon={Inbox} title="No leads loaded" sub="Switch to Leads tab first to load leads, then come back here to view their inbox" />
          ) : (
            <div className="grid md:grid-cols-3 border border-gray-200 rounded-lg overflow-hidden bg-white" style={{ minHeight: 500 }}>
              {/* Thread list */}
              <div className="border-r border-gray-200 overflow-y-auto">
                <div className="p-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Conversations</p>
                </div>
                {leadsLoading ? (
                  <div className="flex items-center justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-copper" /></div>
                ) : leads.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-10">No leads</p>
                ) : leads.map((lead, i) => (
                  <button
                    key={lead.id ?? i}
                    onClick={() => openLead(lead)}
                    className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedLead?.id === lead.id ? 'bg-blue-50 border-l-4 border-l-copper' : ''}`}
                  >
                    <p className="text-sm font-medium text-charcoal truncate">{lead.lead_email || lead.email}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{[lead.first_name, lead.last_name].filter(Boolean).join(' ') || '—'}</p>
                    {lead.category && (
                      <span className={`mt-1.5 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[lead.category] || 'bg-gray-100 text-gray-600'}`}>
                        {lead.category}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Message pane */}
              <div className="col-span-2 flex flex-col">
                {!selectedLead ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-8">
                    <Inbox className="w-8 h-8 text-gray-200 mb-3" />
                    <p className="text-gray-400 text-sm">Select a lead to view their message history</p>
                  </div>
                ) : messagesLoading ? (
                  <div className="flex items-center justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-copper" /></div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto p-5 space-y-3">
                      <div className="pb-3 mb-3 border-b border-gray-100">
                        <p className="font-semibold text-charcoal">{selectedLead.lead_email || selectedLead.email}</p>
                        <p className="text-xs text-gray-400">{[selectedLead.first_name, selectedLead.last_name].filter(Boolean).join(' ')}</p>
                      </div>
                      {messages.length === 0 ? (
                        <Empty icon={MessageSquare} title="No messages" sub="No emails have been sent to this lead yet" />
                      ) : messages.map((m, i) => (
                        <div key={i} className={`rounded-lg p-4 border text-sm ${m.type === 'sent' ? 'bg-copper/5 border-copper/20 ml-8' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-semibold text-charcoal text-xs">{m.from_email || m.from || (m.type === 'sent' ? 'You' : selectedLead.lead_email)}</span>
                            <span className="text-xs text-gray-400">{fmtDate(m.time || m.date || m.created_at)}</span>
                          </div>
                          {m.subject && <p className="font-medium text-charcoal text-xs mb-1">{m.subject}</p>}
                          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{m.email_body || m.body || m.content || '(no content)'}</p>
                        </div>
                      ))}
                    </div>
                    {/* Reply composer */}
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      {replyErr && <ErrBanner msg={replyErr} />}
                      <textarea
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/30 bg-white"
                        placeholder="Write a reply…"
                        value={replyBody}
                        onChange={(e) => setReplyBody(e.target.value)}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={sendReply}
                          disabled={replySending || !replyBody.trim()}
                          className="inline-flex items-center gap-2 bg-copper text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-copper-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {replySending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Reply className="w-3.5 h-3.5" />}
                          {replySending ? 'Sending…' : 'Send Reply'}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Email Accounts tab ── */}
      {tab === 'accounts' && (
        <div>
          {emailAccountsLoading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-copper" /></div>
          ) : emailAccounts.length === 0 ? (
            <Empty icon={Mail} title="No email accounts" sub="Add email accounts to this campaign in SmartLead to see them here" />
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Email', 'Name', 'Warmup Status', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {emailAccounts.map((acc, i) => {
                    const warmupRep = acc.warmup_details?.warmup_reputation ?? acc.warmup_reputation ?? null;
                    // warmup_enabled arrives as the string "true"/"false" or boolean — handle both
                    const _we = acc.warmup_details?.warmup_enabled ?? acc.warmup_enabled;
                    const warmupEnabled = _we === true || _we === 'true'
                      || (warmupRep != null && warmupRep > 0);
                    const isConnected = (acc.is_smtp_success !== false && acc.is_imap_success !== false) ?? acc.is_active ?? true;
                    return (
                    <tr key={acc.id ?? i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-charcoal">{acc.from_email || acc.email}</td>
                      <td className="px-4 py-3 text-gray-600">{acc.from_name || acc.name || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium w-fit ${warmupEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {warmupEnabled ? 'On' : 'Off'}
                          </span>
                          {warmupRep != null && <span className="text-xs text-gray-400">{warmupRep}% rep</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                          {isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            title="Remove from campaign"
                            onClick={async () => {
                              if (!confirm(`Remove ${acc.from_email || acc.email} from this campaign?`)) return;
                              await sl(`campaigns/${campaign.id}/email-accounts/${acc.id}`, { method: 'DELETE' });
                              fetchEmailAccounts();
                            }}
                            className="p-1 rounded text-red-400 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Reconnect account"
                            onClick={async () => {
                              await sl('email-accounts/reconnect', {
                                method: 'POST',
                                body: JSON.stringify({ email_account_id: acc.id }),
                              });
                            }}
                            className="p-1 rounded text-blue-400 hover:bg-blue-50 transition-colors"
                          >
                            <Wifi className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4">
            <button
              onClick={async () => {
                const emailId = prompt('Enter Email Account ID to add to this campaign:');
                if (!emailId) return;
                await sl(`campaigns/${campaign.id}/email-accounts`, {
                  method: 'POST',
                  body: JSON.stringify({ email_account_id: parseInt(emailId, 10) }),
                });
                fetchEmailAccounts();
              }}
              className="inline-flex items-center gap-2 bg-copper text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-copper-dark transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Email Account
            </button>
          </div>
        </div>
      )}

      {/* ── Sequence tab ── */}
      {tab === 'sequence' && (
        <CampaignSequenceTab campaignId={campaign.id} />
      )}

      {/* ── Settings tab ── */}
      {tab === 'settings' && (
        <CampaignSettingsTab campaign={campaign} />
      )}

      {/* ── Stats tab ── */}
      {tab === 'stats' && (
        <CampaignStatsTab campaignId={campaign.id} />
      )}

      {/* ── Export tab ── */}
      {tab === 'export' && (
        <CampaignExportTab campaignId={campaign.id} campaignName={campaign.name} />
      )}
    </div>
  );
}

// ─── Campaign Sequence Tab ────────────────────────────────────────────────────

function CampaignSequenceTab({ campaignId }) {
  const [sequence, setSequence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [seqAnalytics, setSeqAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [showSubseqForm, setShowSubseqForm] = useState(false);
  const [subseqName, setSubseqName] = useState('');
  const [creatingSubseq, setCreatingSubseq] = useState(false);

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/30 transition-colors';

  useEffect(() => {
    // Fetch Campaign Sequence By Campaign ID
    sl(`campaigns/${campaignId}/sequence`)
      .then((d) => setSequence(d.data || d))
      .catch(() => setErr('Failed to load sequence.'))
      .finally(() => setLoading(false));

    // Get Campaign Sequence Analytics
    setAnalyticsLoading(true);
    sl(`campaigns/${campaignId}/sequence-analytics`)
      .then((d) => setSeqAnalytics(d.data || d))
      .catch(() => {})
      .finally(() => setAnalyticsLoading(false));
  }, [campaignId]);

  const createSubsequence = async () => {
    if (!subseqName.trim()) return;
    setCreatingSubseq(true);
    try {
      const res = await sl('campaigns/subsequences', {
        method: 'POST',
        body: JSON.stringify({ campaign_id: campaignId, name: subseqName.trim() }),
      });
      if (res.error) throw new Error(res.error);
      setSubseqName('');
      setShowSubseqForm(false);
    } catch (e) {
      setErr(e.message || 'Failed to create subsequence.');
    } finally {
      setCreatingSubseq(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-copper" /></div>;

  return (
    <div className="space-y-5">
      {err && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{err}
        </div>
      )}

      {/* Sequence steps */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-bold text-charcoal text-sm flex items-center gap-2">
            <List className="w-4 h-4 text-copper" /> Email Sequence
          </h3>
        </div>
        {!sequence || (Array.isArray(sequence) && sequence.length === 0) ? (
          <div className="px-5 py-8 text-center text-gray-400 text-sm">No sequence steps configured yet</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {(Array.isArray(sequence) ? sequence : sequence.steps || sequence.sequences || []).map((step, i) => (
              <div key={step.id ?? i} className="px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-copper text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {step.seq_number || i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-charcoal text-sm">{step.subject || step.seq_variant_details?.[0]?.subject || `Step ${i + 1}`}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {step.seq_delay_details?.delay_in_days != null ? `+${step.seq_delay_details.delay_in_days} day(s)` : ''}
                      {step.type && ` · ${step.type}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sequence Analytics */}
      {seqAnalytics && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="font-bold text-charcoal text-sm flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-copper" /> Sequence Analytics
            </h3>
          </div>
          <div className="p-5">
            {Array.isArray(seqAnalytics) ? (
              <div className="space-y-2">
                {seqAnalytics.map((step, i) => (
                  <div key={i} className="flex items-center gap-4 text-sm">
                    <span className="w-16 text-xs font-semibold text-gray-500">Step {step.step || i + 1}</span>
                    <span className="text-gray-600">{fmt(step.sent_count || 0)} sent</span>
                    <span className="text-blue-500">{pct(step.open_count, step.sent_count)} open</span>
                    <span className="text-green-500">{pct(step.reply_count, step.sent_count)} reply</span>
                  </div>
                ))}
              </div>
            ) : (
              <pre className="text-xs text-gray-500 whitespace-pre-wrap">{JSON.stringify(seqAnalytics, null, 2)}</pre>
            )}
          </div>
        </div>
      )}

      {/* Create Subsequence */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-charcoal text-sm flex items-center gap-2">
            <Hash className="w-4 h-4 text-copper" /> Subsequences
          </h3>
          <button
            onClick={() => setShowSubseqForm(!showSubseqForm)}
            className="inline-flex items-center gap-2 bg-copper text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-copper-dark transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Create Subsequence
          </button>
        </div>
        {showSubseqForm && (
          <div className="flex gap-2 mt-3">
            <input
              className={`${inputCls} flex-1`}
              placeholder="Subsequence name"
              value={subseqName}
              onChange={(e) => setSubseqName(e.target.value)}
            />
            <button
              onClick={createSubsequence}
              disabled={creatingSubseq || !subseqName.trim()}
              className="inline-flex items-center gap-2 bg-copper text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-copper-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creatingSubseq ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Create'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Campaign Settings Tab ─────────────────────────────────────────────────────

function CampaignSettingsTab({ campaign }) {
  const [scheduleForm, setScheduleForm] = useState({
    timezone: campaign.timezone || 'Europe/London',
    days_of_the_week: campaign.days_of_the_week || [1, 2, 3, 4, 5],
    start_hour: campaign.start_hour || campaign.schedule_start_time?.split(':')[0] || '8',
    end_hour: campaign.end_hour || campaign.schedule_end_time?.split(':')[0] || '18',
    min_time_btwn_emails: campaign.min_time_btwn_emails || 5,
    max_leads_per_day: campaign.max_leads_per_day || 100,
  });
  const [generalForm, setGeneralForm] = useState({
    name: campaign.name || '',
    track_settings: campaign.track_settings || 'DONT_TRACK_EMAIL_OPEN_DONT_TRACK_LINK_CLICK',
    stop_lead_settings: campaign.stop_lead_settings || 'REPLIED_TO_AN_EMAIL',
  });
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [savingGeneral, setSavingGeneral] = useState(false);
  const [scheduleOk, setScheduleOk] = useState(false);
  const [generalOk, setGeneralOk] = useState(false);
  const [err, setErr] = useState('');

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/30 transition-colors';
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleDay = (d) =>
    setScheduleForm((f) => ({
      ...f,
      days_of_the_week: f.days_of_the_week.includes(d)
        ? f.days_of_the_week.filter((x) => x !== d)
        : [...f.days_of_the_week, d].sort(),
    }));

  const saveSchedule = async () => {
    setSavingSchedule(true);
    setErr('');
    try {
      // Update Campaign Schedule
      const res = await sl(`campaigns/${campaign.id}/schedule`, {
        method: 'POST',
        body: JSON.stringify(scheduleForm),
      });
      if (res.error) throw new Error(res.error);
      setScheduleOk(true);
      setTimeout(() => setScheduleOk(false), 3000);
    } catch (e) {
      setErr(e.message || 'Failed to update schedule.');
    } finally {
      setSavingSchedule(false);
    }
  };

  const saveGeneral = async () => {
    setSavingGeneral(true);
    setErr('');
    try {
      // Update Campaign General Settings
      const res = await sl(`campaigns/${campaign.id}/settings`, {
        method: 'POST',
        body: JSON.stringify(generalForm),
      });
      if (res.error) throw new Error(res.error);
      setGeneralOk(true);
      setTimeout(() => setGeneralOk(false), 3000);
    } catch (e) {
      setErr(e.message || 'Failed to update settings.');
    } finally {
      setSavingGeneral(false);
    }
  };

  return (
    <div className="space-y-5">
      {err && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{err}
        </div>
      )}

      {/* General Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h3 className="font-bold text-charcoal text-sm mb-4 flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-copper" /> General Settings
        </h3>
        {generalOk && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-3 py-2 text-sm mb-3">
            <CheckCircle className="w-4 h-4 flex-shrink-0" /> Settings updated.
          </div>
        )}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Campaign Name</label>
            <input className={inputCls} value={generalForm.name} onChange={(e) => setGeneralForm({ ...generalForm, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Stop Lead When</label>
            <select className={inputCls} value={generalForm.stop_lead_settings} onChange={(e) => setGeneralForm({ ...generalForm, stop_lead_settings: e.target.value })}>
              <option value="REPLIED_TO_AN_EMAIL">Lead replies to email</option>
              <option value="EMAIL_OPENED">Lead opens email</option>
              <option value="LINK_CLICKED">Lead clicks a link</option>
              <option value="MEETING_BOOKED">Meeting booked</option>
              <option value="NEVER">Never (send all steps)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Tracking</label>
            <select className={inputCls} value={generalForm.track_settings} onChange={(e) => setGeneralForm({ ...generalForm, track_settings: e.target.value })}>
              <option value="DONT_TRACK_EMAIL_OPEN_DONT_TRACK_LINK_CLICK">No tracking</option>
              <option value="TRACK_EMAIL_OPEN_DONT_TRACK_LINK_CLICK">Track opens only</option>
              <option value="DONT_TRACK_EMAIL_OPEN_TRACK_LINK_CLICK">Track clicks only</option>
              <option value="TRACK_EMAIL_OPEN_TRACK_LINK_CLICK">Track opens & clicks</option>
            </select>
          </div>
          <button
            onClick={saveGeneral}
            disabled={savingGeneral}
            className="inline-flex items-center gap-2 bg-copper text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-copper-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {savingGeneral ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Settings2 className="w-3.5 h-3.5" />}
            {savingGeneral ? 'Saving…' : 'Save General Settings'}
          </button>
        </div>
      </div>

      {/* Schedule Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h3 className="font-bold text-charcoal text-sm mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-copper" /> Schedule Settings
        </h3>
        {scheduleOk && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-3 py-2 text-sm mb-3">
            <CheckCircle className="w-4 h-4 flex-shrink-0" /> Schedule updated.
          </div>
        )}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Timezone</label>
            <select className={inputCls} value={scheduleForm.timezone} onChange={(e) => setScheduleForm({ ...scheduleForm, timezone: e.target.value })}>
              {['Europe/London','Europe/Paris','America/New_York','America/Los_Angeles','America/Chicago','Asia/Dubai','Asia/Singapore','Australia/Sydney'].map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Min Gap (min)</label>
              <input type="number" min={1} className={inputCls} value={scheduleForm.min_time_btwn_emails} onChange={(e) => setScheduleForm({ ...scheduleForm, min_time_btwn_emails: +e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Max Leads / Day</label>
              <input type="number" min={1} className={inputCls} value={scheduleForm.max_leads_per_day} onChange={(e) => setScheduleForm({ ...scheduleForm, max_leads_per_day: +e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">Send Days</label>
            <div className="flex gap-2">
              {days.map((d, i) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDay(i)}
                  className={`w-9 h-9 rounded-lg text-xs font-semibold border transition-colors ${
                    scheduleForm.days_of_the_week.includes(i)
                      ? 'bg-copper text-white border-copper'
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-copper'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={saveSchedule}
            disabled={savingSchedule}
            className="inline-flex items-center gap-2 bg-copper text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-copper-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {savingSchedule ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Calendar className="w-3.5 h-3.5" />}
            {savingSchedule ? 'Saving…' : 'Update Schedule'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Campaign Stats Tab ────────────────────────────────────────────────────────

function CampaignStatsTab({ campaignId }) {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [stats, setStats] = useState(null);
  const [leadStats, setLeadStats] = useState(null);
  const [mailboxStats, setMailboxStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const inputCls = 'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/30 transition-colors';

  const fetchStats = async () => {
    setLoading(true);
    setErr('');
    try {
      const params = dateRange.start && dateRange.end
        ? `?start_date=${dateRange.start}&end_date=${dateRange.end}`
        : '';

      const [statsData, leadsData, mailboxData] = await Promise.allSettled([
        // Fetch Campaign Statistics By Campaign ID (with optional date range)
        sl(`campaigns/${campaignId}/statistics${params}`),
        // Fetch Campaign Lead Statistics
        sl(`campaigns/${campaignId}/lead-statistics`),
        // Fetch Campaign Mailbox Statistics
        sl(`campaigns/${campaignId}/mailbox-statistics`),
      ]);

      if (statsData.status === 'fulfilled') setStats(statsData.value.data || statsData.value);
      if (leadsData.status === 'fulfilled') setLeadStats(leadsData.value.data || leadsData.value);
      if (mailboxData.status === 'fulfilled') setMailboxStats(mailboxData.value.data || mailboxData.value);
    } catch (e) {
      setErr(e.message || 'Failed to load statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, [campaignId]);

  return (
    <div className="space-y-5">
      {/* Date range filter */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-end gap-3 flex-wrap">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Start Date</label>
          <input type="date" className={inputCls} value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">End Date</label>
          <input type="date" className={inputCls} value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} />
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-copper text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-copper-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Filter className="w-3.5 h-3.5" />}
          {loading ? 'Loading…' : 'Fetch Stats'}
        </button>
      </div>

      {err && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{err}
        </div>
      )}

      {/* Campaign Statistics */}
      {stats && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="font-bold text-charcoal text-sm">Campaign Statistics</h3>
          </div>
          <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ['Sent', stats.sent_count ?? stats.sent ?? 0, 'text-blue-500'],
              ['Opens', stats.open_count ?? stats.opens ?? 0, 'text-green-500'],
              ['Replies', stats.reply_count ?? stats.replies ?? 0, 'text-copper'],
              ['Bounces', stats.bounce_count ?? stats.bounces ?? 0, 'text-red-500'],
              ['Clicks', stats.click_count ?? stats.clicks ?? 0, 'text-purple-500'],
              ['Unsubscribed', stats.unsubscribed_count ?? stats.unsubscribed ?? 0, 'text-orange-500'],
            ].map(([label, value, color]) => (
              <div key={label} className="text-center">
                <p className={`text-2xl font-bold ${color}`}>{fmt(value)}</p>
                <p className="text-xs text-gray-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lead Statistics */}
      {leadStats && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="font-bold text-charcoal text-sm">Lead Statistics</h3>
          </div>
          <div className="p-5">
            {Array.isArray(leadStats) ? (
              <div className="space-y-2 text-sm">
                {leadStats.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-600">{item.category || item.status || item.label || `Item ${i + 1}`}</span>
                    <span className="font-semibold text-charcoal">{fmt(item.count || item.value || 0)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(leadStats).map(([key, val]) => (
                  <div key={key} className="text-center">
                    <p className="text-xl font-bold text-charcoal">{typeof val === 'number' ? fmt(val) : val}</p>
                    <p className="text-xs text-gray-400 mt-1 capitalize">{key.replace(/_/g, ' ')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mailbox Statistics */}
      {mailboxStats && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="font-bold text-charcoal text-sm">Mailbox Statistics</h3>
          </div>
          <div className="p-5">
            {Array.isArray(mailboxStats) ? (
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Mailbox', 'Sent', 'Opens', 'Replies'].map((h) => (
                      <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mailboxStats.map((mb, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="px-3 py-2 text-gray-700">{mb.email || mb.from_email || `Mailbox ${i + 1}`}</td>
                      <td className="px-3 py-2 text-gray-600">{fmt(mb.sent_count || 0)}</td>
                      <td className="px-3 py-2 text-gray-600">{fmt(mb.open_count || 0)}</td>
                      <td className="px-3 py-2 text-gray-600">{fmt(mb.reply_count || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <pre className="text-xs text-gray-500 whitespace-pre-wrap">{JSON.stringify(mailboxStats, null, 2)}</pre>
            )}
          </div>
        </div>
      )}

      {!stats && !leadStats && !mailboxStats && !loading && (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-gray-200 rounded-lg text-center">
          <BarChart2 className="w-10 h-10 text-gray-200 mb-3" />
          <p className="font-semibold text-gray-400">No statistics available</p>
          <p className="text-sm text-gray-300 mt-1">Try adjusting the date range or click Fetch Stats</p>
        </div>
      )}
    </div>
  );
}

// ─── Campaign Export Tab ───────────────────────────────────────────────────────

function CampaignExportTab({ campaignId, campaignName }) {
  const [exportType, setExportType] = useState('all');
  const [exporting, setExporting] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  const handleExport = async () => {
    setExporting(true);
    setErr('');
    setOk('');
    try {
      // Export data from a campaign
      const data = await sl(`campaigns/${campaignId}/export?type=${exportType}`);
      if (data.error) throw new Error(data.error);

      // Download as JSON
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${campaignName.replace(/\s+/g, '_')}_export_${exportType}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setOk('Export downloaded successfully.');
    } catch (e) {
      setErr(e.message || 'Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h3 className="font-bold text-charcoal text-sm mb-4 flex items-center gap-2">
          <Download className="w-4 h-4 text-copper" /> Export Campaign Data
        </h3>
        {err && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm mb-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{err}
          </div>
        )}
        {ok && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-3 py-2 text-sm mb-3">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />{ok}
          </div>
        )}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">Export Type</label>
            <div className="flex gap-3 flex-wrap">
              {[
                { value: 'all', label: 'All Data' },
                { value: 'leads', label: 'Leads' },
                { value: 'analytics', label: 'Analytics' },
                { value: 'messages', label: 'Messages' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setExportType(value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    exportType === value
                      ? 'bg-copper text-white border-copper'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-copper'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="inline-flex items-center gap-2 bg-copper text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-copper-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {exporting ? 'Exporting…' : `Export ${exportType.charAt(0).toUpperCase() + exportType.slice(1)}`}
          </button>
        </div>
      </div>

      {/* Fetch Campaigns by Lead ID */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h3 className="font-bold text-charcoal text-sm mb-3 flex items-center gap-2">
          <FileSearch className="w-4 h-4 text-copper" /> Find All Campaigns for a Lead
        </h3>
        <LeadCampaignLookup />
      </div>
    </div>
  );
}

function LeadCampaignLookup() {
  const [leadId, setLeadId] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const search = async () => {
    if (!leadId.trim()) return;
    setLoading(true);
    setErr('');
    setResults(null);
    try {
      // Fetch all Campaigns Using Lead ID
      const d = await sl(`leads/${leadId.trim()}/campaigns`);
      if (d.error) throw new Error(d.error);
      setResults(d.data || d.campaigns || (Array.isArray(d) ? d : []));
    } catch (e) {
      setErr(e.message || 'Not found.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/30 transition-colors"
          placeholder="Lead ID"
          value={leadId}
          onChange={(e) => setLeadId(e.target.value)}
        />
        <button
          onClick={search}
          disabled={loading || !leadId.trim()}
          className="inline-flex items-center gap-2 bg-copper text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-copper-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
          Search
        </button>
      </div>
      {err && <p className="text-xs text-red-500">{err}</p>}
      {results && (
        results.length === 0 ? (
          <p className="text-sm text-gray-400">No campaigns found for this lead.</p>
        ) : (
          <div className="space-y-1">
            {results.map((c, i) => (
              <div key={c.id ?? i} className="flex items-center gap-3 py-2 border-b border-gray-100 text-sm">
                <span className="font-medium text-charcoal">{c.name || `Campaign #${c.id}`}</span>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

// ─── Email Accounts Tab (global) ──────────────────────────────────────────────

function EmailAccountsTab() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [selectedAcc, setSelectedAcc] = useState(null);
  const [accDetail, setAccDetail] = useState(null);
  const [warmupStats, setWarmupStats] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showTagForm, setShowTagForm] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [tagEmails, setTagEmails] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/30 transition-colors';

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const d = await sl('email-accounts');
      const accs = d.data || d || [];
      // The list endpoint doesn't include warmup status.
      // GET /email-accounts/{id} (the detail endpoint) does — fetch all in parallel.
      const detailResults = await Promise.allSettled(
        accs.map(a => sl(`email-accounts/${a.id}`))
      );
      const accsWithWarmup = accs.map((a, i) => {
        const r = detailResults[i];
        if (r.status === 'fulfilled' && r.value) {
          const detail = r.value.data || r.value;
          // Merge any warmup fields the detail endpoint provides
          return { ...a, ...detail };
        }
        return a;
      });
      setAccounts(accsWithWarmup);
    } catch {
      setErr('Failed to load email accounts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

  // Fetch Email Account By ID + Warmup Stats
  const openAccountDetail = async (acc) => {
    setSelectedAcc(acc);
    setDetailLoading(true);
    setAccDetail(null);
    setWarmupStats(null);
    try {
      const [detail, warmup] = await Promise.allSettled([
        sl(`email-accounts/${acc.id}`),
        sl(`email-accounts/${acc.id}/warmup-stats`),
      ]);
      if (detail.status === 'fulfilled') setAccDetail(detail.value.data || detail.value);
      if (warmup.status === 'fulfilled') setWarmupStats(warmup.value.data || warmup.value);
    } catch {}
    finally { setDetailLoading(false); }
  };

  // Reconnect failed email accounts
  const reconnectAccount = async (acc) => {
    try {
      await sl('email-accounts/reconnect', {
        method: 'POST',
        body: JSON.stringify({ email_account_id: acc.id }),
      });
      setActionMsg(`Reconnect initiated for ${acc.from_email || acc.email}`);
      setTimeout(() => setActionMsg(''), 4000);
    } catch {}
  };

  // Add/Update Warmup — SmartLead requires warmup_enabled and reply_rate_percentage as strings
  const toggleWarmup = async (acc) => {
    const wd = acc.warmup_details || {};
    // warmup_enabled comes back as the string "true"/"false" or boolean — normalise both
    const currentlyEnabled = wd.warmup_enabled === true || wd.warmup_enabled === 'true';
    const newEnabled = !currentlyEnabled;
    const body = {
      warmup_enabled: String(newEnabled),
      total_warmup_per_day: wd.total_warmup_per_day ?? 35,
      daily_rampup: wd.daily_rampup ?? 5,
      reply_rate_percentage: String(wd.reply_rate_percentage ?? 30),
    };
    if (wd.warmup_key_id) body.warmup_key_id = wd.warmup_key_id;
    try {
      await sl(`email-accounts/${acc.id}/warmup`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      // Optimistic update — the list endpoint (sl('email-accounts')) does not return
      // warmup_details, so a fetchAccounts() re-fetch would silently erase the change.
      setAccounts(prev => prev.map(a =>
        a.id === acc.id
          ? { ...a, warmup_details: { ...wd, warmup_enabled: String(newEnabled) } }
          : a
      ));
    } catch {}
  };

  // Update Email Account Tag
  const updateTag = async (accId, tag) => {
    try {
      await sl(`email-accounts/${accId}/tag`, {
        method: 'POST',
        body: JSON.stringify({ tag }),
      });
      setShowTagForm(null);
      setTagInput('');
      fetchAccounts();
    } catch {}
  };

  // Add Tags to Email Accounts
  const addTags = async () => {
    if (!tagEmails.trim() || !tagInput.trim()) return;
    const emails = tagEmails.split(',').map((e) => e.trim()).filter(Boolean);
    try {
      await sl('email-accounts/tags', {
        method: 'POST',
        body: JSON.stringify({ email_accounts: emails, tags: [tagInput.trim()] }),
      });
      setTagEmails('');
      setTagInput('');
      setActionMsg('Tags added successfully.');
      setTimeout(() => setActionMsg(''), 4000);
    } catch {}
  };

  // Remove Tags from Email Accounts
  const removeTags = async () => {
    if (!tagEmails.trim() || !tagInput.trim()) return;
    const emails = tagEmails.split(',').map((e) => e.trim()).filter(Boolean);
    try {
      await sl('email-accounts/tags', {
        method: 'DELETE',
        body: JSON.stringify({ email_accounts: emails, tags: [tagInput.trim()] }),
      });
      setActionMsg('Tags removed successfully.');
      setTimeout(() => setActionMsg(''), 4000);
    } catch {}
  };

  // Get Tag List by Email Addresses
  const getTagList = async () => {
    if (!tagEmails.trim()) return;
    const emails = tagEmails.split(',').map((e) => e.trim()).filter(Boolean);
    try {
      const res = await sl('email-accounts/tags/list', {
        method: 'POST',
        body: JSON.stringify({ email_accounts: emails }),
      });
      alert(JSON.stringify(res, null, 2));
    } catch {}
  };

  // Fetch Messages for Email Account
  const fetchMessages = async (acc) => {
    try {
      const res = await sl(`email-accounts/${acc.id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ page: 1, per_page: 10 }),
      });
      alert(JSON.stringify(res, null, 2));
    } catch {}
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-copper" /></div>;
  if (err) return <ErrBanner msg={err} />;

  return (
    <div className="space-y-5">
      {actionMsg && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2.5 text-sm">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />{actionMsg}
        </div>
      )}

      {/* Header actions */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{accounts.length} email account{accounts.length !== 1 ? 's' : ''}</p>
        <div className="flex items-center gap-2">
          <button onClick={fetchAccounts} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center gap-2 bg-copper text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-copper-dark transition-colors"
          >
            <Plus className="w-4 h-4" /> Create Account
          </button>
        </div>
      </div>

      {/* Create Email Account form */}
      {showCreateForm && <CreateEmailAccountForm onCreated={fetchAccounts} onClose={() => setShowCreateForm(false)} />}

      {/* Bulk Tag Manager */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
          <Tag className="w-3.5 h-3.5" /> Bulk Tag Manager
        </h4>
        <div className="flex gap-2 flex-wrap">
          <input
            className="flex-1 min-w-[180px] border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-copper transition-colors"
            placeholder="Emails (comma-separated)"
            value={tagEmails}
            onChange={(e) => setTagEmails(e.target.value)}
          />
          <input
            className="w-32 border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-copper transition-colors"
            placeholder="Tag name"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
          />
          <button onClick={addTags} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-green-700 transition-colors">Add Tags</button>
          <button onClick={removeTags} className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-red-600 transition-colors">Remove Tags</button>
          <button onClick={getTagList} className="text-xs bg-gray-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-gray-700 transition-colors">Get Tags</button>
        </div>
      </div>

      {/* Accounts table */}
      {!accounts.length ? (
        <Empty icon={Mail} title="No email accounts" sub="Add email accounts in SmartLead to see them here" />
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Email', 'Name', 'Type', 'Warmup', 'Daily Limit', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc, i) => {
                // SmartLead nests warmup under warmup_details
                const warmupReputation = acc.warmup_details?.warmup_reputation ?? acc.warmup_reputation ?? null;
                // warmup_enabled arrives as string "true"/"false" or boolean — handle both
                const _we2 = acc.warmup_details?.warmup_enabled ?? acc.warmup_enabled;
                const warmupEnabled = _we2 === true || _we2 === 'true'
                  || (warmupReputation != null && warmupReputation > 0);
                // Account is "active" when SMTP and IMAP connections succeed
                const isActive = (acc.is_smtp_success !== false && acc.is_imap_success !== false) ?? acc.is_active ?? true;
                const sentCount = acc.sent_count ?? acc.sent_today ?? 0;
                const dailyLimit = acc.daily_limit ?? '—';
                return (
                <tr key={acc.id ?? i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-charcoal">{acc.from_email || acc.email}</td>
                  <td className="px-4 py-3 text-gray-600">{acc.from_name || acc.name || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 capitalize">{acc.type?.toLowerCase() || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => toggleWarmup(acc)}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors w-fit ${warmupEnabled ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        title="Click to toggle warmup"
                      >
                        {warmupEnabled ? 'On' : 'Off'}
                      </button>
                      {warmupReputation != null && (
                        <span className="text-xs text-gray-400">{warmupReputation}% rep</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {dailyLimit !== '—' ? `${sentCount} / ${dailyLimit}` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium w-fit ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {isActive ? 'Connected' : 'Disconnected'}
                      </span>
                      {(acc.is_smtp_success === false || acc.is_imap_success === false) && (
                        <span className="text-xs text-red-400">
                          {acc.is_smtp_success === false ? 'SMTP fail' : 'IMAP fail'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openAccountDetail(acc)} title="View details" className="p-1 rounded text-copper hover:bg-copper/10 transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => reconnectAccount(acc)} title="Reconnect" className="p-1 rounded text-blue-500 hover:bg-blue-50 transition-colors">
                        <Wifi className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => fetchMessages(acc)} title="Fetch messages" className="p-1 rounded text-gray-500 hover:bg-gray-100 transition-colors">
                        <MailOpen className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setShowTagForm(showTagForm === acc.id ? null : acc.id)}
                        title="Update tag"
                        className="p-1 rounded text-orange-500 hover:bg-orange-50 transition-colors"
                      >
                        <Tag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {showTagForm === acc.id && (
                      <div className="mt-2 flex gap-1">
                        <input
                          className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-copper"
                          placeholder="Tag name"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                        />
                        <button onClick={() => updateTag(acc.id, tagInput)} className="text-xs bg-copper text-white px-2 py-1 rounded font-medium">Save</button>
                      </div>
                    )}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Account detail panel */}
      {selectedAcc && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-copper/10 flex items-center justify-center">
                <span className="text-copper font-bold text-sm">
                  {(selectedAcc.from_name || selectedAcc.from_email || '?')[0].toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-charcoal text-sm">{selectedAcc.from_name || '—'}</p>
                <p className="text-xs text-gray-400">{selectedAcc.from_email || selectedAcc.email}</p>
              </div>
            </div>
            <button onClick={() => setSelectedAcc(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {detailLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-5 h-5 animate-spin text-copper" />
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Account Info */}
              {accDetail && (() => {
                const SKIP = new Set(['password', 'secret', 'token', 'key', 'hash']);
                const LABEL_MAP = {
                  from_name: 'From Name', from_email: 'Email Address', user_name: 'Username',
                  smtp_host: 'SMTP Host', smtp_port: 'SMTP Port',
                  imap_host: 'IMAP Host', imap_port: 'IMAP Port',
                  daily_limit: 'Daily Limit', send_interval: 'Send Interval (s)',
                  warmup_enabled: 'Warmup', status: 'Status',
                  created_at: 'Created', updated_at: 'Last Updated',
                };
                const STATUS_KEYS = new Set(['status', 'warmup_status', 'smtp_status', 'imap_status']);
                const BOOL_KEYS   = new Set(['warmup_enabled', 'is_active', 'is_verified']);
                const DATE_KEYS   = new Set(['created_at', 'updated_at', 'last_email_time']);

                // Flatten one level: top-level scalars + known nested objects
                const NESTED_SECTIONS = ['smtp_details', 'imap_details', 'warmup_details', 'settings'];
                const flat = {};
                Object.entries(accDetail).forEach(([k, v]) => {
                  if (typeof v !== 'object' || v === null) {
                    flat[k] = v;
                  } else if (NESTED_SECTIONS.includes(k) && v && typeof v === 'object') {
                    Object.entries(v).forEach(([nk, nv]) => {
                      if (typeof nv !== 'object' || nv === null) flat[`${k}.${nk}`] = nv;
                    });
                  }
                });

                const rows = Object.entries(flat).filter(([k]) =>
                  !SKIP.has(k.toLowerCase()) &&
                  !k.toLowerCase().includes('password') &&
                  !k.toLowerCase().includes('secret')
                );
                if (!rows.length) return null;

                const fmt = (k, v) => {
                  const base = k.split('.').pop();
                  if (BOOL_KEYS.has(base) || base === 'warmup_enabled') {
                    const on = v === true || v === 'true' || v === 1 || v === '1';
                    return on
                      ? <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Enabled</span>
                      : <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">Disabled</span>;
                  }
                  if (STATUS_KEYS.has(base)) {
                    const good = ['active', 'connected', 'verified', 'valid'].includes(String(v).toLowerCase());
                    const color = good ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600';
                    return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{v}</span>;
                  }
                  if (DATE_KEYS.has(base) && v) return new Date(v).toLocaleString();
                  return String(v ?? '—');
                };

                const label = (k) => {
                  if (LABEL_MAP[k]) return LABEL_MAP[k];
                  const base = k.replace(/^.*\./, '');
                  return base.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                };

                return (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Account Info</p>
                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                      {rows.map(([k, v]) => (
                        <div key={k} className="flex items-start gap-2">
                          <span className="text-xs text-gray-400 w-36 flex-shrink-0 pt-0.5">{label(k)}</span>
                          <span className="text-sm text-charcoal font-medium break-all">{fmt(k, v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Warmup Stats */}
              {warmupStats && (() => {
                const PCT_KEYS  = new Set(['open_rate', 'spam_rate', 'reply_rate', 'bounce_rate', 'inbox_rate']);
                const GOOD_KEYS = new Set(['open_rate', 'reply_rate', 'reputation_score', 'inbox_rate']);
                const BAD_KEYS  = new Set(['spam_rate', 'bounce_rate']);
                const LABEL_MAP_W = {
                  emails_sent_today: 'Sent Today', emails_received_today: 'Received Today',
                  total_sent: 'Total Sent', total_received: 'Total Received',
                  open_rate: 'Open Rate', spam_rate: 'Spam Rate',
                  reply_rate: 'Reply Rate', inbox_rate: 'Inbox Rate',
                  bounce_rate: 'Bounce Rate', reputation_score: 'Reputation',
                  warmup_status: 'Warmup Status', days_active: 'Days Active',
                  health_score: 'Health Score',
                };

                const cards = Object.entries(warmupStats).filter(([k, v]) =>
                  typeof v !== 'object' || v === null
                );
                if (!cards.length) return null;

                return (
                  <div className="border-t border-gray-100 pt-5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Warmup Stats</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {cards.map(([k, v]) => {
                        const isPct  = PCT_KEYS.has(k);
                        const isGood = GOOD_KEYS.has(k);
                        const isBad  = BAD_KEYS.has(k);
                        const display = isPct
                          ? `${(+v * (v <= 1 ? 100 : 1)).toFixed(1)}%`
                          : String(v ?? '—');
                        const lbl = LABEL_MAP_W[k] || k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                        return (
                          <div key={k} className="bg-gray-50 rounded-lg px-4 py-3 flex flex-col gap-1">
                            <span className="text-xs text-gray-400">{lbl}</span>
                            <span className={`text-lg font-semibold ${isGood ? 'text-green-600' : isBad ? 'text-red-500' : 'text-charcoal'}`}>
                              {display}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Create Email Account Form ─────────────────────────────────────────────────

function CreateEmailAccountForm({ onCreated, onClose }) {
  const [form, setForm] = useState({
    from_name: '',
    from_email: '',
    user_name: '',
    password: '',
    smtp_host: '',
    smtp_port: 587,
    imap_host: '',
    imap_port: 993,
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/30 transition-colors';

  const handleSubmit = async () => {
    if (!form.from_email.trim() || !form.from_name.trim()) {
      setErr('Name and email are required.');
      return;
    }
    setSaving(true);
    setErr('');
    try {
      // Create an Email Account
      const res = await sl('email-accounts', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      if (res.error) throw new Error(res.error);
      onCreated();
      onClose();
    } catch (e) {
      setErr(e.message || 'Failed to create email account.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-copper/20 rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-charcoal text-sm">Create Email Account</h3>
        <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
      </div>
      {err && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm mb-3">
          <AlertCircle className="w-4 h-4" />{err}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">From Name *</label>
          <input className={inputCls} value={form.from_name} onChange={(e) => setForm({ ...form, from_name: e.target.value })} placeholder="John Doe" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">From Email *</label>
          <input className={inputCls} type="email" value={form.from_email} onChange={(e) => setForm({ ...form, from_email: e.target.value })} placeholder="john@company.com" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Username</label>
          <input className={inputCls} value={form.user_name} onChange={(e) => setForm({ ...form, user_name: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Password</label>
          <input className={inputCls} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">SMTP Host</label>
          <input className={inputCls} value={form.smtp_host} onChange={(e) => setForm({ ...form, smtp_host: e.target.value })} placeholder="smtp.gmail.com" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">SMTP Port</label>
          <input className={inputCls} type="number" value={form.smtp_port} onChange={(e) => setForm({ ...form, smtp_port: +e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">IMAP Host</label>
          <input className={inputCls} value={form.imap_host} onChange={(e) => setForm({ ...form, imap_host: e.target.value })} placeholder="imap.gmail.com" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">IMAP Port</label>
          <input className={inputCls} type="number" value={form.imap_port} onChange={(e) => setForm({ ...form, imap_port: +e.target.value })} />
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-copper text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-copper-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
          {saving ? 'Creating…' : 'Create Account'}
        </button>
        <button onClick={onClose} className="text-sm text-gray-500 hover:text-charcoal transition-colors">Cancel</button>
      </div>
    </div>
  );
}

// ─── Global Analytics Tab ─────────────────────────────────────────────────────

function GlobalAnalyticsTab({ campaigns }) {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [topLevelStats, setTopLevelStats] = useState(null);
  const [topLevelLoading, setTopLevelLoading] = useState(false);

  const fetchTopLevelAnalytics = async () => {
    setTopLevelLoading(true);
    try {
      const params = dateRange.start && dateRange.end
        ? `?start_date=${dateRange.start}&end_date=${dateRange.end}`
        : '';
      // Fetch Campaign Top Level Analytics (with optional date range)
      const d = await sl(`campaigns/analytics${params}`);
      setTopLevelStats(d.data || d);
    } catch {}
    finally { setTopLevelLoading(false); }
  };

  // Aggregate stats from all campaigns that have analytics fields
  const totals = campaigns.reduce(
    (acc, c) => ({
      sent: acc.sent + (c.sent_count || 0),
      open: acc.open + (c.open_count || 0),
      reply: acc.reply + (c.reply_count || 0),
      bounce: acc.bounce + (c.bounce_count || 0),
      click: acc.click + (c.click_count || 0),
      unsub: acc.unsub + (c.unsubscribed_count || 0),
    }),
    { sent: 0, open: 0, reply: 0, bounce: 0, click: 0, unsub: 0 }
  );

  const active = campaigns.filter((c) => (c.status || '').toUpperCase() === 'ACTIVE').length;
  const paused = campaigns.filter((c) => (c.status || '').toUpperCase() === 'PAUSED').length;

  return (
    <div className="space-y-6">
      {/* Date Range Filter for Top-Level Analytics */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-end gap-3 flex-wrap">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Start Date</label>
          <input
            type="date"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/30 transition-colors"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">End Date</label>
          <input
            type="date"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/30 transition-colors"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          />
        </div>
        <button
          onClick={fetchTopLevelAnalytics}
          disabled={topLevelLoading}
          className="inline-flex items-center gap-2 bg-copper text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-copper-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {topLevelLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Filter className="w-3.5 h-3.5" />}
          {topLevelLoading ? 'Loading…' : 'Fetch Top-Level Analytics'}
        </button>
      </div>

      {/* Top-level analytics from API */}
      {topLevelStats && (
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="font-bold text-charcoal text-sm mb-3">
            Top-Level Analytics{dateRange.start && dateRange.end ? ` (${dateRange.start} – ${dateRange.end})` : ''}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(topLevelStats).slice(0, 8).map(([k, v]) => (
              <div key={k} className="text-center">
                <p className="text-2xl font-bold text-charcoal">{typeof v === 'number' ? fmt(v) : v}</p>
                <p className="text-xs text-gray-400 mt-1 capitalize">{k.replace(/_/g, ' ')}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI icon={Megaphone} label="Total Campaigns" value={campaigns.length} sub={`${active} active · ${paused} paused`} />
        <KPI icon={Send} label="Total Sent" value={fmt(totals.sent)} color="text-blue-500" />
        <KPI icon={Eye} label="Overall Open Rate" value={pct(totals.open, totals.sent)} sub={`${fmt(totals.open)} opens`} color="text-green-500" />
        <KPI icon={MessageSquare} label="Overall Reply Rate" value={pct(totals.reply, totals.sent)} sub={`${fmt(totals.reply)} replies`} color="text-copper" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <KPI icon={MousePointerClick} label="Overall Click Rate" value={pct(totals.click, totals.sent)} sub={`${fmt(totals.click)} clicks`} color="text-purple-500" />
        <KPI icon={AlertCircle} label="Bounce Rate" value={pct(totals.bounce, totals.sent)} sub={`${fmt(totals.bounce)} bounces`} color="text-red-500" />
        <KPI icon={Globe} label="Unsubscribed" value={fmt(totals.unsub)} color="text-orange-500" />
      </div>

      {/* Per-campaign breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="font-bold text-charcoal text-sm">Per-Campaign Breakdown</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Campaign', 'Status', 'Sent', 'Open Rate', 'Reply Rate', 'Bounce'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c, i) => (
              <tr key={c.id ?? i} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-charcoal max-w-[200px] truncate">{c.name}</td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3 text-gray-600">{fmt(c.sent_count)}</td>
                <td className="px-4 py-3 text-gray-600">{pct(c.open_count, c.sent_count)}</td>
                <td className="px-4 py-3 text-gray-600">{pct(c.reply_count, c.sent_count)}</td>
                <td className="px-4 py-3 text-gray-600">{pct(c.bounce_count, c.sent_count)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Global Leads Tab ─────────────────────────────────────────────────────────

function GlobalLeadsTab() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [blockList, setBlockList] = useState([]);
  const [blockListLoading, setBlockListLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subTab, setSubTab] = useState('all');
  const [emailSearch, setEmailSearch] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [blockInput, setBlockInput] = useState('');
  const [blocking, setBlocking] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/30 transition-colors';

  useEffect(() => {
    if (subTab === 'all') {
      setLoading(true);
      // Fetch All Leads From Entire Account
      sl('leads/global-leads?limit=100&offset=0')
        .then((d) => setLeads(d.data || d.leads || (Array.isArray(d) ? d : [])))
        .catch(() => setErr('Failed to load leads.'))
        .finally(() => setLoading(false));

      // Fetch Lead Categories
      sl('leads/fetch-categories')
        .then((d) => setCategories(d.data || d.categories || (Array.isArray(d) ? d : [])))
        .catch(() => {});
    }
    if (subTab === 'blocklist') {
      setBlockListLoading(true);
      // Fetch Leads From Global Block List
      sl('leads/get-domain-block-list?limit=100&offset=0')
        .then((d) => setBlockList(d.data || d.block_list || (Array.isArray(d) ? d : [])))
        .catch(() => {})
        .finally(() => setBlockListLoading(false));
    }
  }, [subTab]);

  const searchByEmail = async () => {
    if (!emailSearch.trim()) return;
    setSearching(true);
    setSearchResult(null);
    try {
      // Fetch Lead by email address
      const d = await sl(`leads?email=${encodeURIComponent(emailSearch.trim())}`);
      setSearchResult(d.data || d);
    } catch (e) {
      setErr(e.message || 'Lead not found.');
    } finally {
      setSearching(false);
    }
  };

  const addToBlockList = async () => {
    if (!blockInput.trim()) return;
    setBlocking(true);
    try {
      // Add Lead/Domain to Global Block List
      await sl('leads/add-domain-block-list', {
        method: 'POST',
        body: JSON.stringify({ name: [blockInput.trim()] }),
      });
      setBlockInput('');
      setActionMsg(`${blockInput} added to block list.`);
      setTimeout(() => setActionMsg(''), 4000);
      if (subTab === 'blocklist') {
        setBlockListLoading(true);
        sl('leads/get-domain-block-list?limit=100&offset=0')
          .then((d) => setBlockList(d.data || d.block_list || (Array.isArray(d) ? d : [])))
          .finally(() => setBlockListLoading(false));
      }
    } catch {}
    finally { setBlocking(false); }
  };

  const removeFromBlockList = async (entry) => {
    if (!confirm(`Remove ${entry.email || entry.domain || entry} from block list?`)) return;
    try {
      // Delete Lead/Domain from Global Block List — requires the entry's numeric id
      await sl(`leads/delete-domain-block-list?id=${entry.id}`, { method: 'DELETE' });
      setBlockList((prev) => prev.filter((b) => b.id !== entry.id));
    } catch {}
  };

  const moveToInactive = async (lead) => {
    try {
      // Move Leads to Inactive from All Leads Page
      await sl('leads/move-to-inactive', {
        method: 'POST',
        body: JSON.stringify({ lead_id: lead.id }),
      });
      setLeads((prev) => prev.filter((l) => l.id !== lead.id));
      setActionMsg(`${lead.email || lead.lead_email} moved to inactive.`);
      setTimeout(() => setActionMsg(''), 4000);
    } catch {}
  };

  const SUBTABS = [
    { id: 'all', label: 'All Leads', icon: Users },
    { id: 'search', label: 'Search by Email', icon: Search },
    { id: 'blocklist', label: 'Block List', icon: Ban },
    { id: 'categories', label: 'Categories', icon: Tag },
  ];

  return (
    <div className="space-y-4">
      {/* Sub-tab nav */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {SUBTABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSubTab(id)}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              subTab === id ? 'bg-white text-copper shadow-sm' : 'text-gray-500 hover:text-charcoal'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {actionMsg && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2.5 text-sm">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />{actionMsg}
        </div>
      )}
      {err && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2.5 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{err}
        </div>
      )}

      {/* All Leads */}
      {subTab === 'all' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-copper" /></div>
          ) : leads.length === 0 ? (
            <Empty icon={Users} title="No leads found" sub="Your SmartLead account has no leads yet" />
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Email', 'Name', 'Company', 'Category', 'Created', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 50).map((lead, i) => (
                  <tr key={lead.id ?? i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-charcoal">{lead.email || lead.lead_email}</td>
                    <td className="px-4 py-3 text-gray-600">{[lead.first_name, lead.last_name].filter(Boolean).join(' ') || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{lead.company_name || '—'}</td>
                    <td className="px-4 py-3">
                      {lead.category ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{lead.category}</span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-400">{fmtDate(lead.created_at)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => moveToInactive(lead)}
                        title="Move to inactive"
                        className="p-1 rounded text-gray-400 hover:bg-gray-100 transition-colors"
                      >
                        <UserMinus className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Search by Email */}
      {subTab === 'search' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex gap-2">
            <input
              className={`${inputCls} flex-1`}
              type="email"
              placeholder="lead@example.com"
              value={emailSearch}
              onChange={(e) => setEmailSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchByEmail()}
            />
            <button
              onClick={searchByEmail}
              disabled={searching || !emailSearch.trim()}
              className="inline-flex items-center gap-2 bg-copper text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-copper-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {searching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              {searching ? 'Searching…' : 'Find Lead'}
            </button>
          </div>
          {searchResult && (
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-bold text-charcoal text-sm mb-3">Lead Found</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(searchResult).slice(0, 14).map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <span className="text-gray-400 capitalize w-32 flex-shrink-0">{k.replace(/_/g, ' ')}</span>
                    <span className="text-charcoal font-medium">{typeof v === 'object' ? JSON.stringify(v) : String(v ?? '—')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Block List */}
      {subTab === 'blocklist' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex gap-2">
            <input
              className={`${inputCls} flex-1`}
              placeholder="email@domain.com or domain.com"
              value={blockInput}
              onChange={(e) => setBlockInput(e.target.value)}
            />
            <button
              onClick={addToBlockList}
              disabled={blocking || !blockInput.trim()}
              className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {blocking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ban className="w-3.5 h-3.5" />}
              Block
            </button>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {blockListLoading ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-copper" /></div>
            ) : blockList.length === 0 ? (
              <Empty icon={Ban} title="Block list is empty" sub="Add emails or domains to prevent them from receiving emails" />
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Email / Domain', 'Added', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {blockList.map((entry, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-charcoal">{entry.email || entry.domain || String(entry)}</td>
                      <td className="px-4 py-3 text-gray-400">{fmtDate(entry.created_at)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => removeFromBlockList(entry)}
                          className="p-1 rounded text-red-400 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Categories */}
      {subTab === 'categories' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {categories.length === 0 ? (
            <Empty icon={Tag} title="No categories found" sub="Lead categories will appear here" />
          ) : (
            <div className="p-5 flex flex-wrap gap-2">
              {categories.map((cat, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full text-sm font-medium bg-copper/10 text-copper border border-copper/20">
                  {cat.name || cat.category || String(cat)}
                  {cat.count != null && <span className="ml-2 text-xs font-bold">({cat.count})</span>}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Smart Delivery Tab ───────────────────────────────────────────────────────

function SmartDeliveryTab() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [testType, setTestType] = useState('manual');
  const [creating, setCreating] = useState(false);
  const [createErr, setCreateErr] = useState('');
  const [newTest, setNewTest] = useState({ subject: '', body: '', from_email: '' });
  const [selectedTests, setSelectedTests] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [sdSubTab, setSdSubTab] = useState('tests');
  const [reportData, setReportData] = useState({});
  const [reportLoading, setReportLoading] = useState({});
  const [folders, setFolders] = useState([]);
  const [showFolderForm, setShowFolderForm] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/30 transition-colors';

  const fetchTests = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      // List all Tests
      const d = await sl('smartdelivery/placement-test/list', { method: 'POST', body: JSON.stringify({}) });
      if (d.error) throw new Error(d.error);
      setTests(d.data || d.tests || (Array.isArray(d) ? d : []));
    } catch (e) {
      setErr(e.message || 'Failed to load placement tests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTests(); }, [fetchTests]);

  // Fetch report data for sub-tabs
  const fetchReport = async (type) => {
    if (reportData[type]) return;
    setReportLoading((prev) => ({ ...prev, [type]: true }));
    try {
      let data;
      switch (type) {
        case 'provider':
          // Provider wise report
          data = await sl('smartdelivery/report/provider', { method: 'POST', body: JSON.stringify({}) });
          break;
        case 'geo':
          // Geo wise report
          data = await sl('smartdelivery/report/geo', { method: 'POST', body: JSON.stringify({}) });
          break;
        case 'sender':
          // Sender Account wise report
          data = await sl('smartdelivery/report/sender-account');
          break;
        case 'spam-filter':
          // Spam filter report
          data = await sl('smartdelivery/report/spam-filter');
          break;
        case 'dkim':
          // DKIM Details
          data = await sl('smartdelivery/dkim-details');
          break;
        case 'spf':
          // SPF Details
          data = await sl('smartdelivery/spf-details');
          break;
        case 'rdns':
          // rDNS report
          data = await sl('smartdelivery/rdns-report');
          break;
        case 'blacklists':
          // Blacklists
          data = await sl('smartdelivery/blacklists');
          break;
        case 'domain-blacklist':
          // Domain Blacklist
          data = await sl('smartdelivery/domain-blacklist');
          break;
        case 'sender-list':
          // Sender Account List
          data = await sl('smartdelivery/sender-account-list');
          break;
        case 'mailbox-summary':
          // Mailbox Summary
          data = await sl('smartdelivery/mailbox-summary');
          break;
        case 'mailbox-count':
          // Mailbox Count API
          data = await sl('smartdelivery/mailbox-count');
          break;
        case 'ip-details':
          // IP details
          data = await sl('smartdelivery/ip-details');
          break;
        case 'region-providers':
          // Region wise Provider IDs
          data = await sl('smartdelivery/region-providers');
          break;
        default:
          data = {};
      }
      setReportData((prev) => ({ ...prev, [type]: data?.data || data }));
    } catch {}
    finally { setReportLoading((prev) => ({ ...prev, [type]: false })); }
  };

  useEffect(() => {
    if (sdSubTab === 'folders') {
      // Get All Folders
      sl('smartdelivery/folders')
        .then((d) => setFolders(d.data || d.folders || (Array.isArray(d) ? d : [])))
        .catch(() => {});
    }
    if (['provider', 'geo', 'sender', 'spam-filter', 'dkim', 'spf', 'rdns', 'blacklists', 'domain-blacklist', 'sender-list', 'mailbox-summary', 'mailbox-count', 'ip-details', 'region-providers'].includes(sdSubTab)) {
      fetchReport(sdSubTab);
    }
  }, [sdSubTab]);

  const createTest = async () => {
    if (!newTest.subject.trim() || !newTest.body.trim()) {
      setCreateErr('Subject and body are required.');
      return;
    }
    setCreating(true);
    setCreateErr('');
    try {
      const endpoint = testType === 'automated'
        ? 'smartdelivery/placement-test/automated/create'
        : 'smartdelivery/placement-test/create';
      const res = await sl(endpoint, {
        method: 'POST',
        body: JSON.stringify(newTest),
      });
      if (res.error) throw new Error(res.error);
      setShowCreate(false);
      setNewTest({ subject: '', body: '', from_email: '' });
      fetchTests();
    } catch (e) {
      setCreateErr(e.message || 'Failed to create test.');
    } finally {
      setCreating(false);
    }
  };

  // Delete Smart Delivery Tests in Bulk
  const deleteSelected = async () => {
    if (!selectedTests.length) return;
    if (!confirm(`Delete ${selectedTests.length} test(s)?`)) return;
    setDeleting(true);
    try {
      await sl('smartdelivery/placement-test/bulk-delete', {
        method: 'POST',
        body: JSON.stringify({ test_ids: selectedTests }),
      });
      setSelectedTests([]);
      fetchTests();
      setActionMsg('Tests deleted.');
      setTimeout(() => setActionMsg(''), 3000);
    } catch {}
    finally { setDeleting(false); }
  };

  // Stop an Automated Smart Delivery Test
  const stopTest = async (testId) => {
    try {
      await sl(`smartdelivery/placement-test/${testId}/stop`, { method: 'PUT' });
      fetchTests();
      setActionMsg('Test stopped.');
      setTimeout(() => setActionMsg(''), 3000);
    } catch {}
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const createFolder = async () => {
    if (!folderName.trim()) return;
    try {
      // Create Folders
      await sl('smartdelivery/folders', {
        method: 'POST',
        body: JSON.stringify({ name: folderName.trim() }),
      });
      setFolderName('');
      setShowFolderForm(false);
      sl('smartdelivery/folders').then((d) => setFolders(d.data || d.folders || (Array.isArray(d) ? d : [])));
    } catch {}
  };

  const deleteFolder = async (folder) => {
    if (!confirm(`Delete folder "${folder.name || folder.id}"?`)) return;
    try {
      // Delete folder
      await sl(`smartdelivery/folders/${folder.id}`, { method: 'DELETE' });
      setFolders((prev) => prev.filter((f) => f.id !== folder.id));
    } catch {}
  };

  const SD_SUBTABS = [
    { id: 'tests', label: 'Tests' },
    { id: 'provider', label: 'Provider Report' },
    { id: 'geo', label: 'Geo Report' },
    { id: 'sender', label: 'Sender Report' },
    { id: 'sender-list', label: 'Sender List' },
    { id: 'spam-filter', label: 'Spam Filter' },
    { id: 'dkim', label: 'DKIM' },
    { id: 'spf', label: 'SPF' },
    { id: 'rdns', label: 'rDNS' },
    { id: 'blacklists', label: 'Blacklists' },
    { id: 'domain-blacklist', label: 'Domain Blacklist' },
    { id: 'mailbox-summary', label: 'Mailbox Summary' },
    { id: 'mailbox-count', label: 'Mailbox Count' },
    { id: 'ip-details', label: 'IP Details' },
    { id: 'region-providers', label: 'Providers' },
    { id: 'folders', label: 'Folders' },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Test your email deliverability across major inbox providers</p>

      {actionMsg && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2.5 text-sm">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />{actionMsg}
        </div>
      )}

      {/* Sub-tab nav */}
      <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg">
        {SD_SUBTABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setSdSubTab(id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              sdSubTab === id ? 'bg-white text-copper shadow-sm' : 'text-gray-500 hover:text-charcoal'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tests tab */}
      {sdSubTab === 'tests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedTests.length > 0 && (
                <button
                  onClick={deleteSelected}
                  disabled={deleting}
                  className="inline-flex items-center gap-1.5 bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                  Delete {selectedTests.length} selected
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={fetchTests} disabled={loading} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="Refresh">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-2 bg-copper text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-copper-dark transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Test
              </button>
            </div>
          </div>

          <ErrBanner msg={err} />

          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-copper" /></div>
          ) : tests.length === 0 ? (
            <Empty icon={Zap} title="No placement tests yet" sub="Run a placement test to check your email deliverability" />
          ) : (
            <div className="space-y-3">
              {tests.map((test, i) => (
                <div key={test.id ?? i} className="bg-white border border-gray-200 rounded-lg p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedTests.includes(test.id)}
                        onChange={(e) => setSelectedTests((prev) =>
                          e.target.checked ? [...prev, test.id] : prev.filter((id) => id !== test.id)
                        )}
                        className="flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-charcoal text-sm truncate">{test.subject || test.name || `Test #${i + 1}`}</h3>
                          {test.status && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                              test.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border-green-200' :
                              test.status === 'RUNNING' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                              'bg-gray-100 text-gray-600 border-gray-200'
                            }`}>
                              {test.status}
                            </span>
                          )}
                          {test.type === 'automated' && test.status === 'RUNNING' && (
                            <button
                              onClick={() => stopTest(test.id)}
                              className="text-xs text-red-500 hover:text-red-700 font-medium"
                            >
                              Stop
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">Created {fmtDate(test.created_at)}</p>
                      </div>
                    </div>
                    {test.score != null && (
                      <div className="text-right flex-shrink-0">
                        <p className={`text-2xl font-bold ${getScoreColor(test.score)}`}>{test.score}<span className="text-sm font-normal text-gray-400">/100</span></p>
                        <p className="text-xs text-gray-400">Score</p>
                      </div>
                    )}
                  </div>

                  {test.results && test.results.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                      {test.results.map((r, j) => (
                        <div key={j} className="bg-gray-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-500 mb-1">{r.provider || r.email_provider}</p>
                          <p className={`text-sm font-bold ${r.inbox ? 'text-green-600' : 'text-red-500'}`}>
                            {r.inbox ? '✓ Inbox' : r.spam ? '✗ Spam' : r.category || 'Unknown'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Create modal */}
          {showCreate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
              <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <h2 className="font-bold text-charcoal">New Placement Test</h2>
                  <button onClick={() => setShowCreate(false)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
                </div>
                <div className="p-6 space-y-4">
                  <ErrBanner msg={createErr} />
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2">Test Type</label>
                    <div className="flex gap-2">
                      {['manual', 'automated'].map((t) => (
                        <button
                          key={t}
                          onClick={() => setTestType(t)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                            testType === t ? 'bg-copper text-white border-copper' : 'bg-gray-50 text-gray-600 border-gray-200'
                          }`}
                        >
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">From Email</label>
                    <input className={inputCls} type="email" placeholder="sender@yourdomain.com" value={newTest.from_email} onChange={(e) => setNewTest({ ...newTest, from_email: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Subject *</label>
                    <input className={inputCls} placeholder="Test email subject" value={newTest.subject} onChange={(e) => setNewTest({ ...newTest, subject: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Email Body *</label>
                    <textarea className={inputCls} rows={5} placeholder="Write your test email body here…" value={newTest.body} onChange={(e) => setNewTest({ ...newTest, body: e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-3 px-6 py-4 border-t border-gray-200">
                  <button
                    onClick={createTest}
                    disabled={creating}
                    className="inline-flex items-center gap-2 bg-copper text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-copper-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    {creating ? 'Running…' : 'Run Test'}
                  </button>
                  <button onClick={() => setShowCreate(false)} className="text-sm text-gray-500 hover:text-charcoal transition-colors">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Folders tab */}
      {sdSubTab === 'folders' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-charcoal text-sm">Smart Delivery Folders</h3>
            <button
              onClick={() => setShowFolderForm(!showFolderForm)}
              className="inline-flex items-center gap-2 bg-copper text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-copper-dark transition-colors"
            >
              <FolderPlus className="w-3.5 h-3.5" /> New Folder
            </button>
          </div>
          {showFolderForm && (
            <div className="flex gap-2">
              <input
                className={`${inputCls} flex-1`}
                placeholder="Folder name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
              />
              <button
                onClick={createFolder}
                disabled={!folderName.trim()}
                className="inline-flex items-center gap-2 bg-copper text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-copper-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          )}
          {folders.length === 0 ? (
            <Empty icon={Folder} title="No folders" sub="Create folders to organize your Smart Delivery tests" />
          ) : (
            <div className="space-y-2">
              {folders.map((folder, i) => (
                <div key={folder.id ?? i} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Folder className="w-4 h-4 text-copper" />
                    <span className="font-medium text-charcoal text-sm">{folder.name || `Folder ${i + 1}`}</span>
                    {folder.test_count != null && <span className="text-xs text-gray-400">{folder.test_count} tests</span>}
                  </div>
                  <button onClick={() => deleteFolder(folder)} className="p-1 rounded text-red-400 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Generic report sub-tabs */}
      {!['tests', 'folders'].includes(sdSubTab) && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-bold text-charcoal text-sm capitalize">
              {SD_SUBTABS.find((t) => t.id === sdSubTab)?.label}
            </h3>
            <button
              onClick={() => fetchReport(sdSubTab)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="p-5">
            {reportLoading[sdSubTab] ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-copper" /></div>
            ) : !reportData[sdSubTab] ? (
              <Empty icon={BarChart2} title="No data" sub="Click refresh to load this report" />
            ) : (
              <div>
                {Array.isArray(reportData[sdSubTab]) ? (
                  <div className="space-y-2">
                    {reportData[sdSubTab].slice(0, 20).map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 text-sm">
                        <span className="text-gray-600">{Object.values(item)[0] ?? `Item ${i + 1}`}</span>
                        <span className="font-semibold text-charcoal">{Object.values(item)[1] ?? ''}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {Object.entries(reportData[sdSubTab]).slice(0, 16).map(([k, v]) => (
                      <div key={k}>
                        <p className="text-xs text-gray-400 capitalize">{k.replace(/_/g, ' ')}</p>
                        <p className="font-semibold text-charcoal">{typeof v === 'object' ? JSON.stringify(v) : String(v ?? '—')}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const MAIN_TABS = [
  { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
  { id: 'analytics', label: 'Global Analytics', icon: BarChart2 },
  { id: 'accounts', label: 'Email Accounts', icon: Server },
  { id: 'leads', label: 'All Leads', icon: Users },
  { id: 'prospect', label: 'Smart Prospect', icon: Search },
  { id: 'delivery', label: 'Smart Delivery', icon: Zap },
];

export default function CampaignsPage() {
  const [tab, setTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const d = await sl('campaigns');
      // SmartLead returns an array directly or { data: [] }
      setCampaigns(Array.isArray(d) ? d : (d.data || []));
    } catch {
      setErr('Could not load campaigns. Check that the `smartlead` env var is set correctly.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  const active = campaigns.filter((c) => (c.status || '').toUpperCase() === 'ACTIVE').length;

  return (
    <div>
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal font-playfair mb-1">Campaigns</h1>
          <p className="text-gray-500 text-sm">
            SmartLead cold email campaigns · {campaigns.length} total · {active} active
          </p>
        </div>
        <button
          onClick={fetchCampaigns}
          disabled={loading}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors disabled:opacity-40"
          title="Refresh"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* If a campaign is selected, show detail view */}
      {selectedCampaign ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <CampaignDetail campaign={selectedCampaign} onBack={() => setSelectedCampaign(null)} />
        </div>
      ) : (
        <>
          {/* Main tab bar */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
            {MAIN_TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  tab === id ? 'bg-white text-copper shadow-sm' : 'text-gray-500 hover:text-charcoal'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            {tab === 'campaigns' && (
              <CampaignsTab
                campaigns={campaigns}
                loading={loading}
                err={err}
                onRefresh={fetchCampaigns}
                onSelectCampaign={setSelectedCampaign}
              />
            )}
            {tab === 'analytics' && (
              loading
                ? <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-copper" /></div>
                : <GlobalAnalyticsTab campaigns={campaigns} />
            )}
            {tab === 'accounts' && <EmailAccountsTab />}
            {tab === 'leads' && <GlobalLeadsTab />}
            {tab === 'prospect' && <SmartProspectTab />}
            {tab === 'delivery' && <SmartDeliveryTab />}
          </div>
        </>
      )}
    </div>
  );
}
