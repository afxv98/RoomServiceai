'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Inbox,
  RefreshCw,
  Loader2,
  Mail,
  MailOpen,
  Star,
  Clock,
  Archive,
  BellRing,
  Calendar,
  Reply,
  Forward,
  DollarSign,
  Tag,
  CheckSquare,
  FileText,
  Ban,
  Play,
  Eye,
  EyeOff,
  Bell,
  Zap,
  X,
  Users,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// ─── SmartLead proxy helper ───────────────────────────────────────────────────

const sl = (path, opts = {}) =>
  fetch(`/api/smartlead/${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  }).then((r) => r.json());

// ─── Shared UI atoms ──────────────────────────────────────────────────────────

function ErrBanner({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-2.5 text-sm mb-3">
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      {msg}
    </div>
  );
}

function SuccessBanner({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 rounded-lg px-4 py-2.5 text-sm mb-3">
      <CheckSquare className="w-4 h-4 flex-shrink-0" />
      {msg}
    </div>
  );
}

function Empty({ icon: Icon, title, sub }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <Icon className="w-10 h-10 text-gray-300 mb-3" />
      <p className="font-semibold text-gray-500 text-sm">{title}</p>
      {sub && <p className="text-xs text-gray-400 mt-1 max-w-xs">{sub}</p>}
    </div>
  );
}

function ActionBtn({ icon: Icon, label, onClick, variant = 'default' }) {
  const cls =
    variant === 'danger'
      ? 'bg-red-50 text-red-600 hover:bg-red-100'
      : 'bg-gray-100 text-gray-600 hover:bg-gray-200';
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${cls}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

function InlinePanel({ title, children, onClose }) {
  return (
    <div className="mx-5 mb-4 border border-copper/20 rounded-lg p-4 bg-copper/5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-charcoal">{title}</p>
        <button onClick={onClose} className="p-1 rounded hover:bg-gray-200 text-gray-400">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      {children}
    </div>
  );
}

function PrimaryBtn({ onClick, disabled, loading, icon: Icon, label, loadingLabel }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="inline-flex items-center gap-2 bg-copper text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-copper-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Icon className="w-3.5 h-3.5" />}
      {loading ? (loadingLabel || 'Loading…') : label}
    </button>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(raw) {
  if (!raw) return '—';
  try {
    const d = new Date(raw);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return String(raw);
  }
}

const CATEGORY_COLORS = {
  Interested: 'bg-green-100 text-green-700 border-green-200',
  'Not Interested': 'bg-red-100 text-red-700 border-red-200',
  'Meeting Booked': 'bg-blue-100 text-blue-700 border-blue-200',
  'Out of Office': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Wrong Person': 'bg-gray-100 text-gray-600 border-gray-200',
  'Do Not Contact': 'bg-red-100 text-red-800 border-red-300',
};

// ─── Inbox tab definitions ────────────────────────────────────────────────────

const INBOX_TABS = [
  {
    id: 'all',
    label: 'All Replies',
    icon: Inbox,
    endpoint: 'master-inbox/inbox-replies',
  },
  {
    id: 'unread',
    label: 'Unread',
    icon: Mail,
    endpoint: 'master-inbox/unread-replies',
  },
  {
    id: 'snoozed',
    label: 'Snoozed',
    icon: Clock,
    endpoint: 'master-inbox/snoozed',
  },
  {
    id: 'important',
    label: 'Important',
    icon: Star,
    endpoint: 'master-inbox/important',
  },
  {
    id: 'scheduled',
    label: 'Scheduled',
    icon: Calendar,
    endpoint: 'master-inbox/scheduled',
  },
  {
    id: 'reminders',
    label: 'Reminders',
    icon: BellRing,
    endpoint: 'master-inbox/reminders',
  },
  {
    id: 'archived',
    label: 'Archived',
    icon: Archive,
    endpoint: 'master-inbox/archived',
  },
  {
    id: 'untracked',
    label: 'Untracked',
    icon: Users,
    endpoint: 'master-inbox/untracked-replies',
  },
];

const inputCls =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/30 transition-colors bg-white';

// ─── Message Detail ───────────────────────────────────────────────────────────

function MessageDetail({ message, onClose, onRefresh }) {
  const [leadData, setLeadData] = useState(null);
  const [loadingLead, setLoadingLead] = useState(false);

  // Message history — needed for stats_id/message_id to reply or forward
  const [lastStatsId, setLastStatsId] = useState('');
  const [lastMsgId, setLastMsgId] = useState('');
  const [lastMsgTime, setLastMsgTime] = useState('');
  const [lastMsgBody, setLastMsgBody] = useState('');

  // Reply
  const [replyBody, setReplyBody] = useState('');
  const [replySending, setReplySending] = useState(false);
  const [replyErr, setReplyErr] = useState('');
  const [replyOk, setReplyOk] = useState(false);

  // Forward
  const [showForward, setShowForward] = useState(false);
  const [forwardTo, setForwardTo] = useState('');
  const [forwarding, setForwarding] = useState(false);
  const [forwardErr, setForwardErr] = useState('');

  // Revenue
  const [showRevenue, setShowRevenue] = useState(false);
  const [revenue, setRevenue] = useState('');
  const [updatingRevenue, setUpdatingRevenue] = useState(false);
  const [revenueOk, setRevenueOk] = useState(false);

  // Category
  const [showCategory, setShowCategory] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [availableCategories, setAvailableCategories] = useState([]);
  const [updatingCategory, setUpdatingCategory] = useState(false);
  const [categoryOk, setCategoryOk] = useState(false);

  // Task
  const [showTask, setShowTask] = useState(false);
  const [task, setTask] = useState({ name: '', priority: 'HIGH', due_date: '' });
  const [creatingTask, setCreatingTask] = useState(false);
  const [taskErr, setTaskErr] = useState('');
  const [taskOk, setTaskOk] = useState(false);

  // Note
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState('');
  const [creatingNote, setCreatingNote] = useState(false);
  const [noteOk, setNoteOk] = useState(false);

  // Block domain
  const [showBlock, setShowBlock] = useState(false);
  const [blockDomain, setBlockDomain] = useState(
    message.lead_email?.split('@')[1] || message.from_email?.split('@')[1] || ''
  );
  const [blocking, setBlocking] = useState(false);
  const [blockOk, setBlockOk] = useState(false);

  // Resume lead
  const [resuming, setResuming] = useState(false);
  const [resumeOk, setResumeOk] = useState(false);

  // Reminder
  const [showReminder, setShowReminder] = useState(false);
  const [reminderMsg, setReminderMsg] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [settingReminder, setSettingReminder] = useState(false);
  const [reminderOk, setReminderOk] = useState(false);

  // Subsequence
  const [showSubseq, setShowSubseq] = useState(false);
  const [subsequenceId, setSubsequenceId] = useState('');
  const [pushingSubseq, setPushingSubseq] = useState(false);
  const [subseqErr, setSubseqErr] = useState('');
  const [subseqOk, setSubseqOk] = useState(false);

  // Smartlead uses email_lead_map_id as the primary identifier for all inbox actions
  const emailLeadMapId = message.email_lead_map_id;
  const campaignId = message.email_campaign_id;
  const emailLeadId = message.email_lead_id;

  // Fetch lead details
  useEffect(() => {
    if (!emailLeadMapId) return;
    setLoadingLead(true);
    sl(`master-inbox/${emailLeadMapId}`)
      .then((d) => setLeadData(d.data || d))
      .catch(() => {})
      .finally(() => setLoadingLead(false));
  }, [emailLeadMapId]);

  // Fetch message history to get stats_id/message_id needed for reply & forward
  useEffect(() => {
    if (!campaignId || !emailLeadId) return;
    sl(`campaigns/${campaignId}/leads/${emailLeadId}/message-history`)
      .then((d) => {
        const history = Array.isArray(d) ? d : (d.data || []);
        const latest = history[history.length - 1] || {};
        setLastStatsId(latest.stats_id || '');
        setLastMsgId(latest.message_id || '');
        setLastMsgTime(latest.time || '');
        setLastMsgBody(latest.email_body || '');
      })
      .catch(() => {});
  }, [campaignId, emailLeadId]);

  // Fetch lead categories when the category panel opens (API needs integer category_id)
  useEffect(() => {
    if (!showCategory || availableCategories.length > 0) return;
    sl('leads/fetch-categories')
      .then((d) => {
        const cats = Array.isArray(d) ? d : (d.data || d.categories || []);
        setAvailableCategories(cats);
      })
      .catch(() => {});
  }, [showCategory, availableCategories.length]);

  const sendReply = async () => {
    if (!replyBody.trim()) return;
    setReplySending(true);
    setReplyErr('');
    try {
      const res = await sl(`campaigns/${campaignId}/reply-email-thread`, {
        method: 'POST',
        body: JSON.stringify({
          email_stats_id: lastStatsId,
          email_body: replyBody.trim(),
          reply_message_id: lastMsgId,
          reply_email_time: lastMsgTime,
          reply_email_body: lastMsgBody,
          to_email: message.lead_email || '',
        }),
      });
      if (res.error) throw new Error(res.error);
      setReplyBody('');
      setReplyOk(true);
    } catch (e) {
      setReplyErr(e.message || 'Failed to send reply.');
    } finally {
      setReplySending(false);
    }
  };

  const sendForward = async () => {
    if (!forwardTo.trim()) return;
    setForwarding(true);
    setForwardErr('');
    try {
      const res = await sl(`campaigns/${campaignId}/forward-email`, {
        method: 'POST',
        body: JSON.stringify({
          message_id: lastMsgId,
          stats_id: lastStatsId,
          to_emails: forwardTo.trim(),
        }),
      });
      if (res.error) throw new Error(res.error);
      setShowForward(false);
      setForwardTo('');
    } catch (e) {
      setForwardErr(e.message || 'Failed to forward message.');
    } finally {
      setForwarding(false);
    }
  };

  const updateRevenue = async () => {
    if (!revenue) return;
    setUpdatingRevenue(true);
    try {
      const res = await sl('master-inbox/update-revenue', {
        method: 'PATCH',
        body: JSON.stringify({ email_lead_map_id: emailLeadMapId, revenue: parseFloat(revenue) }),
      });
      if (res.error) throw new Error(res.error);
      setShowRevenue(false);
      setRevenue('');
      setRevenueOk(true);
      setTimeout(() => setRevenueOk(false), 3000);
    } catch {
      // silent
    } finally {
      setUpdatingRevenue(false);
    }
  };

  const updateCategory = async () => {
    if (!categoryId) return;
    setUpdatingCategory(true);
    try {
      const res = await sl('master-inbox/update-category', {
        method: 'PATCH',
        body: JSON.stringify({
          email_lead_map_id: emailLeadMapId,
          category_id: parseInt(categoryId, 10),
        }),
      });
      if (res.error) throw new Error(res.error);
      setShowCategory(false);
      setCategoryOk(true);
      setTimeout(() => setCategoryOk(false), 3000);
    } catch {
      // silent
    } finally {
      setUpdatingCategory(false);
    }
  };

  const createTask = async () => {
    if (!task.name.trim()) {
      setTaskErr('Name is required.');
      return;
    }
    setCreatingTask(true);
    setTaskErr('');
    try {
      const res = await sl('master-inbox/create-task', {
        method: 'POST',
        body: JSON.stringify({
          email_lead_map_id: emailLeadMapId,
          name: task.name.trim(),
          priority: task.priority,
          ...(task.due_date && { due_date: new Date(task.due_date).toISOString() }),
        }),
      });
      if (res.error) throw new Error(res.error);
      setShowTask(false);
      setTask({ name: '', priority: 'HIGH', due_date: '' });
      setTaskOk(true);
      setTimeout(() => setTaskOk(false), 3000);
    } catch (e) {
      setTaskErr(e.message || 'Failed to create task.');
    } finally {
      setCreatingTask(false);
    }
  };

  const createNote = async () => {
    if (!note.trim()) return;
    setCreatingNote(true);
    try {
      const res = await sl('master-inbox/create-note', {
        method: 'POST',
        body: JSON.stringify({ email_lead_map_id: emailLeadMapId, note_message: note.trim() }),
      });
      if (res.error) throw new Error(res.error);
      setShowNote(false);
      setNote('');
      setNoteOk(true);
      setTimeout(() => setNoteOk(false), 3000);
    } catch {
      // silent
    } finally {
      setCreatingNote(false);
    }
  };

  const blockDomainFn = async () => {
    if (!blockDomain.trim()) return;
    setBlocking(true);
    try {
      const res = await sl('master-inbox/block-domains', {
        method: 'POST',
        body: JSON.stringify({ domains: [blockDomain.trim()], source: 'manual' }),
      });
      if (res.error) throw new Error(res.error);
      setShowBlock(false);
      setBlockOk(true);
      setTimeout(() => setBlockOk(false), 3000);
    } catch {
      // silent
    } finally {
      setBlocking(false);
    }
  };

  const resumeLead = async () => {
    setResuming(true);
    try {
      await sl('master-inbox/resume-lead', {
        method: 'PATCH',
        body: JSON.stringify({
          campaign_id: campaignId,
          email_lead_map_id: emailLeadMapId,
          resume_delay_days: 0,
        }),
      });
      setResumeOk(true);
      setTimeout(() => setResumeOk(false), 3000);
    } catch {
      // silent
    } finally {
      setResuming(false);
    }
  };

  const changeReadStatus = async (read_status) => {
    try {
      await sl('master-inbox/change-read-status', {
        method: 'PATCH',
        body: JSON.stringify({ email_lead_map_id: emailLeadMapId, read_status }),
      });
      onRefresh();
    } catch {
      // silent
    }
  };

  const setReminderFn = async () => {
    if (!reminderDate) return;
    setSettingReminder(true);
    try {
      const res = await sl('master-inbox/set-reminder', {
        method: 'POST',
        body: JSON.stringify({
          email_lead_map_id: emailLeadMapId,
          email_stats_id: lastStatsId,
          message: reminderMsg || 'Reminder',
          reminder_time: new Date(reminderDate).toISOString(),
        }),
      });
      if (res.error) throw new Error(res.error);
      setShowReminder(false);
      setReminderDate('');
      setReminderMsg('');
      setReminderOk(true);
      setTimeout(() => setReminderOk(false), 3000);
    } catch {
      // silent
    } finally {
      setSettingReminder(false);
    }
  };

  const pushToSubsequence = async () => {
    if (!subsequenceId) {
      setSubseqErr('Subsequence ID is required.');
      return;
    }
    setPushingSubseq(true);
    setSubseqErr('');
    try {
      const res = await sl('master-inbox/push-to-subsequence', {
        method: 'POST',
        body: JSON.stringify({
          email_lead_map_id: emailLeadMapId,
          sub_sequence_id: parseInt(subsequenceId, 10),
          sub_sequence_delay_time: 0,
          stop_lead_on_parent_campaign_reply: false,
        }),
      });
      if (res.error) throw new Error(res.error);
      setShowSubseq(false);
      setSubsequenceId('');
      setSubseqOk(true);
      setTimeout(() => setSubseqOk(false), 3000);
    } catch (e) {
      setSubseqErr(e.message || 'Failed to push to subsequence.');
    } finally {
      setPushingSubseq(false);
    }
  };

  const msgBody =
    message.message_body || message.body || message.content || message.preview || '';

  return (
    <div className="bg-white border border-gray-200 rounded-lg flex flex-col" style={{ minHeight: '600px' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-charcoal text-sm truncate">
            {message.subject || message.message_subject || '(no subject)'}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            From: <span className="font-medium">{message.lead_email || message.from_email || '—'}</span>
            {campaignId && (
              <span className="ml-2 text-gray-400">Campaign #{campaignId}</span>
            )}
            <span className="ml-2 text-gray-400">{fmtDate(message.time || message.created_at)}</span>
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-400 ml-3 flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Feedback banners */}
      {(revenueOk || categoryOk || taskOk || noteOk || blockOk || resumeOk || reminderOk || subseqOk) && (
        <div className="px-5 pt-3">
          <SuccessBanner msg="Action completed successfully." />
        </div>
      )}

      {/* Actions bar */}
      <div className="px-5 py-3 border-b border-gray-100 flex flex-wrap gap-2">
        <ActionBtn
          icon={message.is_read ? EyeOff : Eye}
          label={message.is_read ? 'Mark Unread' : 'Mark Read'}
          onClick={() => changeReadStatus(!message.is_read)}
        />
        <ActionBtn icon={Forward} label="Forward" onClick={() => setShowForward(!showForward)} />
        <ActionBtn icon={DollarSign} label="Revenue" onClick={() => setShowRevenue(!showRevenue)} />
        <ActionBtn icon={Tag} label="Category" onClick={() => setShowCategory(!showCategory)} />
        <ActionBtn icon={CheckSquare} label="Task" onClick={() => setShowTask(!showTask)} />
        <ActionBtn icon={FileText} label="Note" onClick={() => setShowNote(!showNote)} />
        <ActionBtn icon={Ban} label="Block Domain" onClick={() => setShowBlock(!showBlock)} variant="danger" />
        <ActionBtn
          icon={resuming ? Loader2 : Play}
          label={resuming ? 'Resuming…' : 'Resume Lead'}
          onClick={resumeLead}
        />
        <ActionBtn icon={Bell} label="Reminder" onClick={() => setShowReminder(!showReminder)} />
        <ActionBtn icon={Zap} label="Subsequence" onClick={() => setShowSubseq(!showSubseq)} />
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Lead info bar */}
        {loadingLead ? (
          <div className="px-5 py-2 text-xs text-gray-400 flex items-center gap-2 border-b border-gray-50">
            <Loader2 className="w-3 h-3 animate-spin" /> Loading lead info…
          </div>
        ) : leadData ? (
          <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-3 text-xs text-gray-600">
            {(leadData.lead_first_name || leadData.lead_last_name) && (
              <span>
                <span className="font-semibold">Lead:</span>{' '}
                {[leadData.lead_first_name, leadData.lead_last_name].filter(Boolean).join(' ')}
              </span>
            )}
            {leadData.company_name && (
              <span>
                <span className="font-semibold">Company:</span> {leadData.company_name}
              </span>
            )}
            {leadData.revenue != null && (
              <span>
                <span className="font-semibold">Revenue:</span> ${leadData.revenue.toLocaleString()}
              </span>
            )}
          </div>
        ) : null}

        {/* Inline action panels */}
        <div className="pt-3">
          {showForward && (
            <InlinePanel title="Forward Message" onClose={() => setShowForward(false)}>
              <ErrBanner msg={forwardErr} />
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">To Email *</label>
                  <input
                    className={inputCls}
                    type="email"
                    placeholder="recipient@email.com"
                    value={forwardTo}
                    onChange={(e) => setForwardTo(e.target.value)}
                  />
                </div>
                <PrimaryBtn
                  onClick={sendForward}
                  disabled={!forwardTo.trim()}
                  loading={forwarding}
                  icon={Forward}
                  label="Forward"
                  loadingLabel="Forwarding…"
                />
              </div>
            </InlinePanel>
          )}

          {showRevenue && (
            <InlinePanel title="Update Lead Revenue" onClose={() => setShowRevenue(false)}>
              <div className="flex gap-2 items-center">
                <span className="text-gray-500 text-sm">$</span>
                <input
                  className={`${inputCls} flex-1`}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                />
                <PrimaryBtn
                  onClick={updateRevenue}
                  disabled={!revenue}
                  loading={updatingRevenue}
                  icon={DollarSign}
                  label="Save"
                  loadingLabel="Saving…"
                />
              </div>
            </InlinePanel>
          )}

          {showCategory && (
            <InlinePanel title="Update Lead Category" onClose={() => setShowCategory(false)}>
              <div className="flex gap-2">
                <select
                  className={`${inputCls} flex-1`}
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">
                    {availableCategories.length === 0 ? 'Loading categories…' : 'Select category…'}
                  </option>
                  {availableCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <PrimaryBtn
                  onClick={updateCategory}
                  disabled={!categoryId}
                  loading={updatingCategory}
                  icon={Tag}
                  label="Save"
                  loadingLabel="Saving…"
                />
              </div>
            </InlinePanel>
          )}

          {showTask && (
            <InlinePanel title="Create Lead Task" onClose={() => setShowTask(false)}>
              <ErrBanner msg={taskErr} />
              <div className="space-y-2">
                <input
                  className={inputCls}
                  placeholder="Task name *"
                  value={task.name}
                  onChange={(e) => setTask({ ...task, name: e.target.value })}
                />
                <select
                  className={inputCls}
                  value={task.priority}
                  onChange={(e) => setTask({ ...task, priority: e.target.value })}
                >
                  <option value="HIGH">High priority</option>
                  <option value="MEDIUM">Medium priority</option>
                  <option value="LOW">Low priority</option>
                </select>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Due Date</label>
                  <input
                    className={inputCls}
                    type="datetime-local"
                    value={task.due_date}
                    onChange={(e) => setTask({ ...task, due_date: e.target.value })}
                  />
                </div>
                <PrimaryBtn
                  onClick={createTask}
                  loading={creatingTask}
                  icon={CheckSquare}
                  label="Create Task"
                  loadingLabel="Creating…"
                />
              </div>
            </InlinePanel>
          )}

          {showNote && (
            <InlinePanel title="Add Note" onClose={() => setShowNote(false)}>
              <div className="space-y-2">
                <textarea
                  className={inputCls}
                  rows={3}
                  placeholder="Write a note about this lead…"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <PrimaryBtn
                  onClick={createNote}
                  disabled={!note.trim()}
                  loading={creatingNote}
                  icon={FileText}
                  label="Add Note"
                  loadingLabel="Saving…"
                />
              </div>
            </InlinePanel>
          )}

          {showBlock && (
            <InlinePanel title="Block Domain" onClose={() => setShowBlock(false)}>
              <div className="space-y-2">
                <p className="text-xs text-gray-500">All future emails to this domain will be blocked.</p>
                <div className="flex gap-2">
                  <input
                    className={`${inputCls} flex-1`}
                    placeholder="example.com"
                    value={blockDomain}
                    onChange={(e) => setBlockDomain(e.target.value)}
                  />
                  <PrimaryBtn
                    onClick={blockDomainFn}
                    disabled={!blockDomain.trim()}
                    loading={blocking}
                    icon={Ban}
                    label="Block"
                    loadingLabel="Blocking…"
                  />
                </div>
              </div>
            </InlinePanel>
          )}

          {showReminder && (
            <InlinePanel title="Set Reminder" onClose={() => setShowReminder(false)}>
              <div className="space-y-2">
                <input
                  className={inputCls}
                  placeholder="Reminder message"
                  value={reminderMsg}
                  onChange={(e) => setReminderMsg(e.target.value)}
                />
                <div className="flex gap-2 items-center">
                  <input
                    className={`${inputCls} flex-1`}
                    type="datetime-local"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                  />
                  <PrimaryBtn
                    onClick={setReminderFn}
                    disabled={!reminderDate}
                    loading={settingReminder}
                    icon={Bell}
                    label="Set"
                    loadingLabel="Setting…"
                  />
                </div>
              </div>
            </InlinePanel>
          )}

          {showSubseq && (
            <InlinePanel title="Push to Subsequence" onClose={() => setShowSubseq(false)}>
              <ErrBanner msg={subseqErr} />
              <div className="space-y-2">
                <p className="text-xs text-gray-500">Enter the Subsequence ID to enroll this lead.</p>
                <div className="flex gap-2">
                  <input
                    className={`${inputCls} flex-1`}
                    placeholder="Subsequence ID"
                    value={subsequenceId}
                    onChange={(e) => setSubsequenceId(e.target.value)}
                  />
                  <PrimaryBtn
                    onClick={pushToSubsequence}
                    disabled={!subsequenceId}
                    loading={pushingSubseq}
                    icon={Zap}
                    label="Push"
                    loadingLabel="Pushing…"
                  />
                </div>
              </div>
            </InlinePanel>
          )}
        </div>

        {/* Message body */}
        <div className="px-5 py-4">
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed break-words">
            {msgBody
              .replace(/<[^>]*>/g, ' ')
              .replace(/&nbsp;/g, ' ')
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/\s{2,}/g, ' ')
              .trim() || '(no content)'}
          </p>
        </div>
      </div>

      {/* Reply box */}
      <div className="border-t border-gray-200 p-4 flex-shrink-0">
        {replyOk ? (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckSquare className="w-4 h-4" />
            Reply sent successfully.
            <button
              onClick={() => setReplyOk(false)}
              className="underline text-xs ml-1 text-gray-400 hover:text-gray-600"
            >
              Reply again
            </button>
          </div>
        ) : (
          <>
            <ErrBanner msg={replyErr} />
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/30 resize-none"
              rows={3}
              placeholder="Write a reply…"
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <PrimaryBtn
                onClick={sendReply}
                disabled={!replyBody.trim()}
                loading={replySending}
                icon={Reply}
                label="Send Reply"
                loadingLabel="Sending…"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Message List Item ────────────────────────────────────────────────────────

function MessageItem({ msg, isSelected, onClick }) {
  const email = msg.lead_email || msg.from_email || msg.email || 'Unknown';
  const subject = msg.subject || msg.message_subject || '(no subject)';
  const preview =
    (msg.preview || msg.message_body || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 80);
  const isUnread = !msg.is_read;
  const time = fmtDate(msg.time || msg.created_at);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${
        isSelected ? 'bg-copper/5 border-l-2 border-l-copper' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            {isUnread && <div className="w-2 h-2 rounded-full bg-copper flex-shrink-0" />}
            <p
              className={`text-sm truncate ${
                isUnread ? 'font-bold text-charcoal' : 'font-medium text-gray-700'
              }`}
            >
              {email}
            </p>
          </div>
          <p className="text-xs text-gray-600 truncate font-medium">{subject}</p>
          {preview && (
            <p className="text-xs text-gray-400 truncate mt-0.5">{preview}</p>
          )}
        </div>
        <p className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">{time}</p>
      </div>
      {msg.category && (
        <span
          className={`mt-1.5 inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${
            CATEGORY_COLORS[msg.category] || 'bg-gray-100 text-gray-600 border-gray-200'
          }`}
        >
          {msg.category}
        </span>
      )}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MasterInboxPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const PER_PAGE = 20; // SmartLead API max limit is 20

  const fetchMessages = useCallback(
    async (tab, p) => {
      setLoading(true);
      setErr('');
      try {
        const tabConfig = INBOX_TABS.find((t) => t.id === tab);
        const offset = (p - 1) * PER_PAGE;
        const data = await sl(
          `${tabConfig.endpoint}?fetch_message_history=false`,
          { method: 'POST', body: JSON.stringify({ offset, limit: PER_PAGE }) }
        );
        if (data.error) throw new Error(data.error);
        const msgs = data.data || (Array.isArray(data) ? data : []);
        setMessages(msgs);
        setHasMore(msgs.length === PER_PAGE);
      } catch (e) {
        setErr(e.message || 'Failed to load messages.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    setSelected(null);
    setPage(1);
    fetchMessages(activeTab, 1);
  }, [activeTab, fetchMessages]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchMessages(activeTab, newPage);
    setSelected(null);
  };

  const activeTabConfig = INBOX_TABS.find((t) => t.id === activeTab);

  return (
    <div>
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal font-playfair mb-1">Master Inbox</h1>
          <p className="text-gray-500 text-sm">
            All replies and conversations from your SmartLead campaigns
          </p>
        </div>
        <button
          onClick={() => fetchMessages(activeTab, page)}
          disabled={loading}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors disabled:opacity-40"
          title="Refresh"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex gap-5">
        {/* Sidebar nav */}
        <div className="w-52 flex-shrink-0">
          <nav className="space-y-0.5">
            {INBOX_TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === id
                    ? 'bg-copper text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <ErrBanner msg={err} />

          {loading ? (
            <div className="flex items-center justify-center py-20 bg-white border border-gray-200 rounded-lg">
              <Loader2 className="w-6 h-6 animate-spin text-copper" />
            </div>
          ) : (
            <div className={`flex gap-4 ${selected ? 'items-start' : ''}`}>
              {/* Message list */}
              <div
                className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${
                  selected ? 'w-80 flex-shrink-0' : 'flex-1'
                }`}
              >
                {/* List header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <activeTabConfig.icon className="w-4 h-4 text-copper" />
                    <span className="text-sm font-semibold text-charcoal">
                      {activeTabConfig.label}
                    </span>
                    {messages.length > 0 && (
                      <span className="bg-copper/10 text-copper text-xs font-bold px-2 py-0.5 rounded-full">
                        {messages.length}
                      </span>
                    )}
                  </div>
                </div>

                {messages.length === 0 ? (
                  <Empty
                    icon={activeTabConfig.icon}
                    title="No messages"
                    sub="Nothing in this folder right now"
                  />
                ) : (
                  <div className="divide-y divide-gray-100">
                    {messages.map((msg, i) => (
                      <MessageItem
                        key={msg.id ?? i}
                        msg={msg}
                        isSelected={selected?.id === msg.id}
                        onClick={() => setSelected(msg)}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {(page > 1 || hasMore) && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1}
                      className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-charcoal disabled:opacity-40"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Prev
                    </button>
                    <span className="text-xs text-gray-400">Page {page}</span>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={!hasMore}
                      className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-charcoal disabled:opacity-40"
                    >
                      Next <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Message detail */}
              {selected && (
                <div className="flex-1 min-w-0">
                  <MessageDetail
                    message={selected}
                    onClose={() => setSelected(null)}
                    onRefresh={() => fetchMessages(activeTab, page)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
