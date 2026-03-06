'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Mail, Send, RefreshCw, Loader2, AlertCircle, CheckCircle,
  ExternalLink, Inbox, ChevronRight, Paperclip, Download,
  FileText, Image as ImageIcon, File, X, Plus, Pencil,
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(raw) {
  if (!raw) return '';
  try {
    const d = new Date(raw), now = new Date();
    if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch { return raw; }
}
function senderName(from) {
  if (!from) return '';
  const m = from.match(/^"?([^"<]+)"?\s*</);
  return m ? m[1].trim() : from.split('@')[0];
}
function formatBytes(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function attachmentIcon(mimeType = '') {
  if (mimeType.startsWith('image/')) return ImageIcon;
  if (mimeType.includes('pdf') || mimeType.includes('text')) return FileText;
  return File;
}
function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => { const data = e.target.result.split(',')[1] || ''; resolve({ name: file.name, type: file.type, size: file.size, data }); };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── AttachmentChip ───────────────────────────────────────────────────────────
function AttachmentChip({ att }) {
  const Icon = attachmentIcon(att.mimeType);
  const href = `/api/gmail/sales/attachment/${att.messageId}/${att.attachmentId}?filename=${encodeURIComponent(att.filename)}&type=${encodeURIComponent(att.mimeType)}`;
  return (
    <a href={href} download={att.filename} className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 rounded-lg px-3 py-2 text-xs font-medium transition-colors group">
      <Icon className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
      <span className="max-w-[140px] truncate">{att.filename}</span>
      {att.size > 0 && <span className="text-gray-400 flex-shrink-0">{formatBytes(att.size)}</span>}
      <Download className="w-3 h-3 text-copper opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </a>
  );
}

// ─── FileChip ─────────────────────────────────────────────────────────────────
function FileChip({ file, onRemove }) {
  const Icon = attachmentIcon(file.type);
  return (
    <div className="inline-flex items-center gap-2 bg-copper/10 border border-copper/20 text-charcoal rounded-lg px-3 py-1.5 text-xs font-medium">
      <Icon className="w-3.5 h-3.5 text-copper flex-shrink-0" />
      <span className="max-w-[120px] truncate">{file.name}</span>
      <span className="text-gray-400 flex-shrink-0">{formatBytes(file.size)}</span>
      <button type="button" onClick={() => onRemove(file.name)} className="text-gray-400 hover:text-red-500 transition-colors ml-0.5">
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

// ─── ConnectBanner ────────────────────────────────────────────────────────────
function ConnectBanner({ error }) {
  const msgs = {
    access_denied: 'Your Google account is not authorized to connect. The app is in restricted mode — only approved accounts can link Gmail. Contact tech@roomserviceai.com to get your email added as an authorized user.',
    auth_denied: 'Authorization was denied. Please try again.',
    no_refresh_token: 'Could not get a refresh token. Please revoke access in your Google security settings and try again.',
    auth_failed: 'Authentication failed. Please try again.',
    token_invalid: 'Your Gmail session has expired. Please reconnect.',
  };
  return (
    <div className="flex flex-col items-center justify-center h-full py-24 text-center px-6">
      <div className="w-16 h-16 bg-copper/10 rounded-full flex items-center justify-center mb-6">
        <Mail className="w-8 h-8 text-copper" />
      </div>
      <h2 className="text-xl font-bold text-charcoal mb-2">Connect your Gmail</h2>
      <p className="text-gray-500 max-w-sm mb-6 text-sm leading-relaxed">
        Link your Gmail account to send and receive emails directly from the sales portal.
      </p>
      {msgs[error] && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm max-w-sm text-left">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{msgs[error]}</span>
        </div>
      )}
      <a href="/api/gmail/sales-auth" className="inline-flex items-center gap-2 bg-copper text-white px-6 py-3 rounded-lg font-semibold hover:bg-copper/90 transition-all duration-200 text-sm">
        <ExternalLink className="w-4 h-4" />
        Connect Gmail Account
      </a>
    </div>
  );
}

// ─── ThreadList ───────────────────────────────────────────────────────────────
function ThreadList({ threads, selectedId, onSelect, loading, onRefresh, onCompose }) {
  return (
    <div className="col-span-1 border-r border-gray-200 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <h2 className="font-bold text-charcoal flex items-center gap-2">
          <Inbox className="w-4 h-4" /> Inbox
          {threads.length > 0 && <span className="text-xs font-normal text-gray-400">({threads.length})</span>}
        </h2>
        <div className="flex items-center gap-1">
          <button onClick={onCompose} className="inline-flex items-center gap-1.5 bg-copper text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-copper/90 transition-colors">
            <Pencil className="w-3 h-3" /> Compose
          </button>
          <button onClick={onRefresh} disabled={loading} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors disabled:opacity-40">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      <div className="overflow-y-auto flex-1">
        {loading && threads.length === 0 ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-5 h-5 animate-spin text-copper" /></div>
        ) : threads.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-16">No emails found.</p>
        ) : (
          threads.map((thread) => (
            <button key={thread.id} onClick={() => onSelect(thread)}
              className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedId === thread.id ? 'bg-blue-50 border-l-4 border-l-copper' : ''}`}
            >
              <div className="flex items-start justify-between mb-1 gap-2">
                <span className={`text-sm truncate ${thread.unread ? 'font-bold text-charcoal' : 'font-medium text-gray-600'}`}>
                  {senderName(thread.from) || 'Unknown'}
                </span>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {thread.unread && <span className="w-2 h-2 bg-copper rounded-full" />}
                  <span className="text-xs text-gray-400">{formatDate(thread.date)}</span>
                </div>
              </div>
              <p className={`text-xs mb-1 truncate ${thread.unread ? 'text-charcoal font-medium' : 'text-gray-500'}`}>{thread.subject}</p>
              <p className="text-xs text-gray-400 truncate">{thread.snippet}</p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

// ─── MessageBubble ────────────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  return (
    <div className="mb-4">
      <div className="rounded-lg p-4 bg-gray-50 border border-gray-200">
        <div className="flex items-center justify-between mb-2 gap-4">
          <span className="text-xs font-semibold text-charcoal truncate">{msg.from}</span>
          <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(msg.date)}</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{msg.body || '(no content)'}</p>
        {msg.attachments?.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200/70 flex flex-wrap gap-2">
            {msg.attachments.map((att) => <AttachmentChip key={att.attachmentId} att={att} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ThreadDetail ─────────────────────────────────────────────────────────────
function ThreadDetail({ thread, messages, loadingMessages, onSend, sending }) {
  const [replyText, setReplyText] = useState('');
  const [sendError, setSendError] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const latestMsg = messages[messages.length - 1];

  const handleFileChange = async (e) => {
    const read = await Promise.all(Array.from(e.target.files || []).map(readFileAsBase64));
    setAttachedFiles((prev) => { const s = new Set(prev.map(f => f.name)); return [...prev, ...read.filter(f => !s.has(f.name))]; });
    e.target.value = '';
  };

  const handleSend = async () => {
    if (!replyText.trim() && !attachedFiles.length) return;
    setSendError('');
    const ok = await onSend({ threadId: thread.id, to: latestMsg?.from || '', subject: thread.subject, body: replyText, inReplyTo: latestMsg?.messageId || '', references: latestMsg?.references || latestMsg?.messageId || '', attachments: attachedFiles.map(({ name, type, data }) => ({ name, type, data })) });
    if (ok) { setReplyText(''); setAttachedFiles([]); }
    else setSendError('Failed to send. Please try again.');
  };

  return (
    <div className="col-span-2 flex flex-col overflow-hidden">
      <div className="p-5 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-lg font-bold text-charcoal mb-1 truncate">{thread.subject}</h2>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Mail className="w-3.5 h-3.5" />
          <span className="truncate">{thread.from}</span>
          <span>·</span><span>{formatDate(thread.date)}</span>
          {thread.messageCount > 1 && <><span>·</span><span>{thread.messageCount} messages</span></>}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        {loadingMessages
          ? <div className="flex items-center justify-center py-16"><Loader2 className="w-5 h-5 animate-spin text-copper" /></div>
          : messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)}
      </div>
      <div className="p-5 border-t border-gray-200 flex-shrink-0">
        <textarea value={replyText} onChange={(e) => { setReplyText(e.target.value); if (sendError) setSendError(''); }} rows={4}
          placeholder={`Reply to ${senderName(thread.from)}…`}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/30 resize-none transition-colors" />
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {attachedFiles.map((f) => <FileChip key={f.name} file={f} onRemove={(n) => setAttachedFiles((p) => p.filter(x => x.name !== n))} />)}
          </div>
        )}
        {sendError && <p className="text-xs text-red-500 mt-1.5">{sendError}</p>}
        <div className="flex items-center gap-2 mt-3">
          <button onClick={handleSend} disabled={sending || (!replyText.trim() && !attachedFiles.length)}
            className="inline-flex items-center gap-2 bg-copper text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-copper/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {sending ? 'Sending…' : 'Send Reply'}
          </button>
          <button type="button" onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 border border-gray-300 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Paperclip className="w-4 h-4" /> Attach
          </button>
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />
        </div>
      </div>
    </div>
  );
}

// ─── ComposeModal ─────────────────────────────────────────────────────────────
function ComposeModal({ isOpen, onClose, onSend, sending, initialTo = '', initialSubject = '' }) {
  const [to, setTo] = useState(initialTo);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [sendError, setSendError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => { if (isOpen) { setTo(initialTo); setSubject(initialSubject); } }, [isOpen, initialTo, initialSubject]);

  const reset = () => { setTo(''); setSubject(''); setBody(''); setAttachedFiles([]); setSendError(''); };
  const handleClose = () => { reset(); onClose(); };

  const handleFileChange = async (e) => {
    const read = await Promise.all(Array.from(e.target.files || []).map(readFileAsBase64));
    setAttachedFiles((prev) => { const s = new Set(prev.map(f => f.name)); return [...prev, ...read.filter(f => !s.has(f.name))]; });
    e.target.value = '';
  };

  const handleSend = async () => {
    if (!to.trim() || !body.trim()) { setSendError('To and message body are required.'); return; }
    setSendError('');
    const ok = await onSend({ to: to.trim(), subject: subject.trim(), body, attachments: attachedFiles.map(({ name, type, data }) => ({ name, type, data })) });
    if (ok) handleClose();
    else setSendError('Failed to send. Please try again.');
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="font-bold text-charcoal flex items-center gap-2"><Pencil className="w-4 h-4 text-copper" /> New Message</h2>
          <button onClick={handleClose} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-charcoal transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">To</label>
            <input type="email" value={to} onChange={(e) => setTo(e.target.value)} placeholder="recipient@example.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/30 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Subject</label>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/30 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Message</label>
            <textarea value={body} onChange={(e) => { setBody(e.target.value); if (sendError) setSendError(''); }} rows={7} placeholder="Write your message…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/30 resize-none transition-colors" />
          </div>
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {attachedFiles.map((f) => <FileChip key={f.name} file={f} onRemove={(n) => setAttachedFiles((p) => p.filter(x => x.name !== n))} />)}
            </div>
          )}
          {sendError && <p className="text-xs text-red-500">{sendError}</p>}
        </div>
        <div className="flex items-center gap-2 px-5 py-4 border-t border-gray-200">
          <button onClick={handleSend} disabled={sending}
            className="inline-flex items-center gap-2 bg-copper text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-copper/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {sending ? 'Sending…' : 'Send'}
          </button>
          <button type="button" onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 border border-gray-300 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Paperclip className="w-4 h-4" /> Attach
          </button>
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />
          <button onClick={handleClose} className="ml-auto text-sm text-gray-400 hover:text-charcoal transition-colors">Discard</button>
        </div>
      </div>
    </div>
  );
}

// ─── EmptyThreadState ─────────────────────────────────────────────────────────
function EmptyThreadState({ onCompose }) {
  return (
    <div className="col-span-2 flex flex-col items-center justify-center h-full text-center px-8">
      <Mail className="w-10 h-10 text-gray-200 mb-4" />
      <p className="text-gray-400 text-sm mb-4">Select a conversation to read it</p>
      <button onClick={onCompose} className="inline-flex items-center gap-2 border border-copper text-copper px-4 py-2 rounded-lg text-sm font-semibold hover:bg-copper hover:text-white transition-colors">
        <Plus className="w-4 h-4" /> Compose New Email
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SalesEmailHubPage() {
  const searchParams = useSearchParams();
  const gmailConnected = searchParams.get('gmail_connected');
  const gmailError = searchParams.get('gmail_error');
  const composeParam = searchParams.get('compose');
  const toParam = searchParams.get('to') || '';
  const subjectParam = searchParams.get('subject') || '';

  const [status, setStatus] = useState('loading');
  const [connectedEmail, setConnectedEmail] = useState('');
  const [connectionError, setConnectionError] = useState(gmailError || '');
  const [showSuccess, setShowSuccess] = useState(!!gmailConnected);

  const [threads, setThreads] = useState([]);
  const [threadsLoading, setThreadsLoading] = useState(false);
  const [threadsError, setThreadsError] = useState('');

  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const [sending, setSending] = useState(false);
  const [composing, setComposing] = useState(!!composeParam);
  const [composeSending, setComposeSending] = useState(false);

  useEffect(() => {
    if (!showSuccess) return;
    const t = setTimeout(() => setShowSuccess(false), 4000);
    return () => clearTimeout(t);
  }, [showSuccess]);

  useEffect(() => {
    fetch('/api/gmail/sales/status')
      .then(r => r.json())
      .then(data => {
        if (data.connected) { setStatus('connected'); setConnectedEmail(data.email || ''); }
        else { setStatus('disconnected'); if (data.error === 'token_invalid') setConnectionError('token_invalid'); }
      })
      .catch(() => setStatus('disconnected'));
  }, []);

  const fetchThreads = useCallback(async () => {
    setThreadsLoading(true);
    setThreadsError('');
    try {
      const res = await fetch('/api/gmail/sales/threads');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setThreads(data.threads || []);
    } catch {
      setThreadsError('Could not load emails. Please refresh or reconnect.');
    } finally {
      setThreadsLoading(false);
    }
  }, []);

  useEffect(() => { if (status === 'connected') fetchThreads(); }, [status, fetchThreads]);

  const selectThread = async (thread) => {
    setSelectedThread(thread);
    setMessages([]);
    setMessagesLoading(true);
    try {
      const res = await fetch(`/api/gmail/sales/thread/${thread.id}`);
      const data = await res.json();
      setMessages(data.messages || []);
      setThreads(prev => prev.map(t => t.id === thread.id ? { ...t, unread: false } : t));
    } catch {
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSend = async (payload) => {
    setSending(true);
    try {
      const res = await fetch('/api/gmail/sales/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!data.success) throw new Error();
      const refreshRes = await fetch(`/api/gmail/sales/thread/${payload.threadId}`);
      const refreshData = await refreshRes.json();
      setMessages(refreshData.messages || []);
      return true;
    } catch { return false; }
    finally { setSending(false); }
  };

  const handleComposeSend = async (payload) => {
    setComposeSending(true);
    try {
      const res = await fetch('/api/gmail/sales/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!data.success) throw new Error();
      setTimeout(fetchThreads, 1500);
      return true;
    } catch { return false; }
    finally { setComposeSending(false); }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-charcoal font-playfair mb-1">Email Hub</h1>
          <p className="text-gray-500 text-sm">
            {status === 'connected' && connectedEmail ? `Connected as ${connectedEmail}` : 'Manage your outreach emails'}
          </p>
        </div>
        {status === 'connected' && (
          <div className="flex items-center gap-3">
            <button onClick={() => setComposing(true)}
              className="inline-flex items-center gap-2 bg-copper text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-copper/90 transition-colors">
              <Pencil className="w-4 h-4" /> New Email
            </button>
            <span className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
              <CheckCircle className="w-3.5 h-3.5" /> Gmail connected
            </span>
            <a href="/api/gmail/sales-auth" className="text-xs text-gray-500 hover:text-charcoal underline transition-colors">Reconnect</a>
          </div>
        )}
      </div>

      {showSuccess && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-4 text-sm">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          Gmail connected successfully! Your inbox is loading below.
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex-1">
        {status === 'loading' && (
          <div className="flex items-center justify-center h-full py-32"><Loader2 className="w-6 h-6 animate-spin text-copper" /></div>
        )}
        {status === 'disconnected' && <ConnectBanner error={connectionError} />}
        {status === 'connected' && (
          <>
            {threadsError && (
              <div className="flex items-center gap-2 bg-red-50 border-b border-red-200 text-red-700 px-5 py-3 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {threadsError}
              </div>
            )}
            <div className="grid md:grid-cols-3" style={{ height: threadsError ? 'calc(100vh - 280px)' : 'calc(100vh - 240px)', minHeight: '500px' }}>
              <ThreadList threads={threads} selectedId={selectedThread?.id} onSelect={selectThread} loading={threadsLoading} onRefresh={fetchThreads} onCompose={() => setComposing(true)} />
              {selectedThread
                ? <ThreadDetail thread={selectedThread} messages={messages} loadingMessages={messagesLoading} onSend={handleSend} sending={sending} />
                : <EmptyThreadState onCompose={() => setComposing(true)} />}
            </div>
          </>
        )}
      </div>

      <ComposeModal isOpen={composing} onClose={() => setComposing(false)} onSend={handleComposeSend} sending={composeSending} initialTo={toParam} initialSubject={subjectParam} />
    </div>
  );
}
