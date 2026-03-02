'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft, ChevronRight, Plus, X, Calendar, Clock,
  User, Tag, Link2, Trash2, Edit2, Filter,
} from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';

// ── Constants ─────────────────────────────────────────────────────────────────
const EVENT_TYPES = [
  { value: 'demo',     label: 'Demo',     color: 'bg-blue-500',    text: 'text-blue-700',   border: 'border-blue-300',   light: 'bg-blue-50'   },
  { value: 'reminder', label: 'Reminder', color: 'bg-amber-400',   text: 'text-amber-700',  border: 'border-amber-300',  light: 'bg-amber-50'  },
  { value: 'call',     label: 'Call',     color: 'bg-emerald-500', text: 'text-emerald-700',border: 'border-emerald-300',light: 'bg-emerald-50'},
  { value: 'meeting',  label: 'Meeting',  color: 'bg-violet-500',  text: 'text-violet-700', border: 'border-violet-300', light: 'bg-violet-50' },
  { value: 'other',    label: 'Other',    color: 'bg-gray-400',    text: 'text-gray-700',   border: 'border-gray-300',   light: 'bg-gray-50'   },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function typeInfo(type) {
  return EVENT_TYPES.find(t => t.value === type) || EVENT_TYPES[4];
}

function toLocalISO(date) {
  const d = new Date(date);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ── Modal Component ───────────────────────────────────────────────────────────
function EventModal({ event, defaultDate, salesReps, onSave, onDelete, onClose }) {
  const isNew = !event;
  const [form, setForm] = useState({
    title: event?.title || '',
    description: event?.description || '',
    startTime: event ? toLocalISO(event.startTime) : (defaultDate ? toLocalISO(defaultDate) : ''),
    endTime: event?.endTime ? toLocalISO(event.endTime) : '',
    type: event?.type || 'other',
    assignedToId: event?.assignedToId ? String(event.assignedToId) : '',
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title.trim()) return;
    if (!form.startTime) return;
    setSaving(true);
    await onSave({
      ...form,
      assignedToId: form.assignedToId || null,
      endTime: form.endTime || null,
    });
    setSaving(false);
  };

  const ti = typeInfo(form.type);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className={`px-6 py-4 rounded-t-xl flex items-center justify-between ${ti.light} border-b ${ti.border}`}>
          <h2 className={`font-bold text-lg ${ti.text}`}>
            {isNew ? 'New Event' : 'Edit Event'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Title *</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-copper"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Event title"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Type</label>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map(t => (
                <button
                  key={t.value}
                  onClick={() => set('type', t.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    form.type === t.value
                      ? `${t.color} text-white border-transparent`
                      : `${t.light} ${t.text} ${t.border}`
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Start *</label>
              <input
                type="datetime-local"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-copper"
                value={form.startTime}
                onChange={e => set('startTime', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">End</label>
              <input
                type="datetime-local"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-copper"
                value={form.endTime}
                onChange={e => set('endTime', e.target.value)}
              />
            </div>
          </div>

          {/* Assign to sales rep */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Assign to Sales Rep</label>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-copper"
              value={form.assignedToId}
              onChange={e => set('assignedToId', e.target.value)}
            >
              <option value="">— Admin event (unassigned) —</option>
              {salesReps.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-copper resize-none"
              rows={3}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Optional notes…"
            />
          </div>

          {/* Lead link info */}
          {event?.lead && (
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
              <Link2 className="w-3.5 h-3.5" />
              <span>Linked to lead: <strong>{event.lead.hotelName}</strong></span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex items-center justify-between">
          <div>
            {!isNew && (
              <button
                onClick={() => onDelete(event.id)}
                className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.title.trim() || !form.startTime}
              className="px-5 py-2 text-sm bg-copper text-white rounded-lg hover:bg-copper/90 disabled:opacity-50 transition-colors font-medium"
            >
              {saving ? 'Saving…' : (isNew ? 'Create' : 'Save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminCalendarPage() {
  const { toast } = useNotification();
  const success = (msg) => toast.success(msg);
  const showError = (msg) => toast.error(msg);

  const today = new Date();
  const [view, setView] = useState('month'); // 'month' | 'week'
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [events, setEvents] = useState([]);
  const [salesReps, setSalesReps] = useState([]);
  const [filterRep, setFilterRep] = useState('all');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | { event?, defaultDate? }

  // ── Data fetching ──────────────────────────────────────────────────────────
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/calendar/events');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEvents(data.events);
      setSalesReps(data.salesReps || []);
    } catch {
      showError('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  // ── Filtered events ────────────────────────────────────────────────────────
  const filteredEvents = events.filter(e => {
    if (filterRep === 'all') return true;
    if (filterRep === 'admin') return !e.assignedToId;
    return String(e.assignedToId) === filterRep;
  });

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const handleSave = async (form) => {
    const isNew = !modal?.event;
    const url = isNew ? '/api/calendar/events' : `/api/calendar/events/${modal.event.id}`;
    const method = isNew ? 'POST' : 'PUT';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      success(isNew ? 'Event created' : 'Event updated');
      setModal(null);
      fetchEvents();
    } catch {
      showError('Failed to save event');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/calendar/events/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      success('Event deleted');
      setModal(null);
      fetchEvents();
    } catch {
      showError('Failed to delete event');
    }
  };

  // ── Calendar helpers ───────────────────────────────────────────────────────
  const eventsOnDay = (date) => {
    const d = date.toDateString();
    return filteredEvents.filter(e => new Date(e.startTime).toDateString() === d);
  };

  const isSameDay = (a, b) => a.toDateString() === b.toDateString();

  // ── Month view grid ────────────────────────────────────────────────────────
  const buildMonthGrid = () => {
    const year = current.getFullYear();
    const month = current.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  };

  // ── Week view ──────────────────────────────────────────────────────────────
  const buildWeekDays = () => {
    const base = view === 'week' ? current : today;
    const dow = base.getDay();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() - dow + i);
      return d;
    });
  };

  const prevPeriod = () => {
    if (view === 'month') {
      setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1));
    } else {
      const d = new Date(current);
      d.setDate(d.getDate() - 7);
      setCurrent(d);
    }
  };

  const nextPeriod = () => {
    if (view === 'month') {
      setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1));
    } else {
      const d = new Date(current);
      d.setDate(d.getDate() + 7);
      setCurrent(d);
    }
  };

  const goToday = () => {
    setCurrent(view === 'month'
      ? new Date(today.getFullYear(), today.getMonth(), 1)
      : new Date(today));
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  const monthGrid = view === 'month' ? buildMonthGrid() : [];
  const weekDays = view === 'week' ? buildWeekDays() : [];

  const headerTitle = view === 'month'
    ? `${MONTHS[current.getMonth()]} ${current.getFullYear()}`
    : (() => {
        const days = buildWeekDays();
        return `${MONTHS[days[0].getMonth()]} ${days[0].getDate()} – ${MONTHS[days[6].getMonth()]} ${days[6].getDate()}, ${days[6].getFullYear()}`;
      })();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal font-playfair">Calendar</h1>
          <p className="text-gray-500 text-sm mt-0.5">All team events, demos and reminders</p>
        </div>
        <button
          onClick={() => setModal({ event: null, defaultDate: today })}
          className="flex items-center gap-2 px-4 py-2 bg-copper text-white rounded-lg text-sm font-medium hover:bg-copper/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Event
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-wrap items-center gap-3">
        {/* Navigation */}
        <div className="flex items-center gap-1">
          <button onClick={prevPeriod} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button onClick={goToday} className="px-3 py-1.5 text-sm rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium">
            Today
          </button>
          <button onClick={nextPeriod} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
          <span className="ml-2 text-base font-semibold text-charcoal">{headerTitle}</span>
        </div>

        <div className="flex-1" />

        {/* Filter by rep */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-copper"
            value={filterRep}
            onChange={e => setFilterRep(e.target.value)}
          >
            <option value="all">All Events</option>
            <option value="admin">Admin Only</option>
            {salesReps.map(r => (
              <option key={r.id} value={String(r.id)}>{r.name}</option>
            ))}
          </select>
        </div>

        {/* View toggle */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          {['month', 'week'].map(v => (
            <button
              key={v}
              onClick={() => { setView(v); setCurrent(v === 'month' ? new Date(today.getFullYear(), today.getMonth(), 1) : new Date(today)); }}
              className={`px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                view === v ? 'bg-copper text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {EVENT_TYPES.map(t => (
          <div key={t.value} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-full ${t.color}`} />
            <span className="text-xs text-gray-500">{t.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
          Loading events…
        </div>
      ) : (
        <>
          {/* ── Month view ── */}
          {view === 'month' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Day names */}
              <div className="grid grid-cols-7 border-b border-gray-100">
                {DAYS.map(d => (
                  <div key={d} className="py-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {d}
                  </div>
                ))}
              </div>
              {/* Cells */}
              <div className="grid grid-cols-7">
                {monthGrid.map((date, i) => {
                  if (!date) return <div key={`empty-${i}`} className="h-28 border-r border-b border-gray-50 bg-gray-50/50" />;
                  const dayEvents = eventsOnDay(date);
                  const isToday = isSameDay(date, today);
                  const isOtherMonth = date.getMonth() !== current.getMonth();
                  return (
                    <div
                      key={date.toISOString()}
                      className={`h-28 border-r border-b border-gray-100 p-1.5 cursor-pointer hover:bg-gray-50 transition-colors group ${isOtherMonth ? 'bg-gray-50/30' : ''}`}
                      onClick={() => setModal({ event: null, defaultDate: date })}
                    >
                      <div className={`text-xs font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                        isToday ? 'bg-copper text-white' : isOtherMonth ? 'text-gray-300' : 'text-gray-600 group-hover:text-charcoal'
                      }`}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-0.5 overflow-hidden">
                        {dayEvents.slice(0, 3).map(ev => {
                          const ti = typeInfo(ev.type);
                          return (
                            <div
                              key={ev.id}
                              onClick={e => { e.stopPropagation(); setModal({ event: ev }); }}
                              className={`text-xs px-1.5 py-0.5 rounded truncate cursor-pointer ${ti.color} text-white hover:opacity-80 transition-opacity`}
                              title={`${ev.title}${ev.assignedTo ? ` · ${ev.assignedTo.name}` : ''}`}
                            >
                              {ev.title}
                            </div>
                          );
                        })}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-400 pl-1">+{dayEvents.length - 3} more</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Week view ── */}
          {view === 'week' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-7 border-b border-gray-100">
                {weekDays.map(date => {
                  const isToday = isSameDay(date, today);
                  return (
                    <div
                      key={date.toISOString()}
                      className={`py-3 text-center border-r border-gray-100 last:border-r-0 cursor-pointer hover:bg-gray-50 transition-colors`}
                      onClick={() => setModal({ event: null, defaultDate: date })}
                    >
                      <div className="text-xs text-gray-400 uppercase mb-1">{DAYS[date.getDay()]}</div>
                      <div className={`text-lg font-bold mx-auto w-9 h-9 flex items-center justify-center rounded-full ${
                        isToday ? 'bg-copper text-white' : 'text-charcoal'
                      }`}>
                        {date.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-7 min-h-64">
                {weekDays.map(date => {
                  const dayEvents = eventsOnDay(date);
                  return (
                    <div
                      key={date.toISOString()}
                      className="border-r border-gray-100 last:border-r-0 p-2 space-y-1 min-h-48 cursor-pointer hover:bg-gray-50/50 transition-colors"
                      onClick={() => setModal({ event: null, defaultDate: date })}
                    >
                      {dayEvents.length === 0 && (
                        <div className="text-xs text-gray-300 text-center pt-4">—</div>
                      )}
                      {dayEvents.map(ev => {
                        const ti = typeInfo(ev.type);
                        const time = new Date(ev.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        return (
                          <div
                            key={ev.id}
                            onClick={e => { e.stopPropagation(); setModal({ event: ev }); }}
                            className={`rounded-lg p-2 cursor-pointer border ${ti.light} ${ti.border} hover:shadow-sm transition-shadow`}
                          >
                            <div className={`text-xs font-semibold ${ti.text} truncate`}>{ev.title}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{time}</div>
                            {ev.assignedTo && (
                              <div className="text-xs text-gray-400 mt-0.5 truncate">→ {ev.assignedTo.name}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Upcoming events sidebar list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-charcoal mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-copper" /> Upcoming Events
        </h2>
        {filteredEvents
          .filter(e => new Date(e.startTime) >= new Date())
          .slice(0, 8)
          .map(ev => {
            const ti = typeInfo(ev.type);
            const d = new Date(ev.startTime);
            return (
              <div
                key={ev.id}
                onClick={() => setModal({ event: ev })}
                className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
              >
                <span className={`mt-0.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${ti.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal truncate">{ev.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {d.toLocaleDateString([], { month: 'short', day: 'numeric' })} · {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {ev.assignedTo && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <User className="w-3 h-3" /> {ev.assignedTo.name}
                      </span>
                    )}
                    {ev.lead && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Link2 className="w-3 h-3" /> {ev.lead.hotelName}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ti.light} ${ti.text}`}>
                  {ti.label}
                </span>
              </div>
            );
          })}
        {filteredEvents.filter(e => new Date(e.startTime) >= new Date()).length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No upcoming events</p>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <EventModal
          event={modal.event || null}
          defaultDate={modal.defaultDate || null}
          salesReps={salesReps}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
