'use client';

import { useState, useEffect, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import {
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  StickyNote,
  X,
  ChevronRight,
  DollarSign,
  TrendingUp,
  Users,
  Percent,
  Clock,
  Send,
  User,
  MapPin,
  Globe,
  Plus,
  Edit,
  Trash2,
  Save,
  Upload,
  Download,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function CRMPage() {
  const { toast, confirm } = useNotification();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [smsMessage, setSmsMessage] = useState('');
  const [newNote, setNewNote] = useState('');
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [draggedLead, setDraggedLead] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvRows, setCsvRows] = useState([]);
  const [csvErrors, setCsvErrors] = useState([]);
  const [csvImporting, setCsvImporting] = useState(false);

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch('/api/crm/leads');
      if (!res.ok) throw new Error('Failed to fetch leads');
      const data = await res.json();
      setLeads(data);
    } catch (error) {
      console.error('fetchLeads error:', error);
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const columns = [
    { id: 'lead', label: 'Lead' },
    { id: 'contacted', label: 'Contacted' },
    { id: 'demo', label: 'Demo Scheduled' },
    { id: 'proposal', label: 'Proposal Sent' },
    { id: 'won', label: 'Won' },
    { id: 'lost', label: 'Lost' },
  ];

  const getLeadsByStatus = (status) => {
    return leads.filter((lead) => lead.status === status);
  };

  const totalPipelineValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const activeLeads = leads.filter(l => !['won', 'lost'].includes(l.status)).length;
  const dealsWon = getLeadsByStatus('won').length;
  const conversionRate = leads.length > 0 ? ((dealsWon / leads.length) * 100).toFixed(1) : 0;

  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
  };

  const closeDrawer = () => {
    setSelectedLead(null);
  };

  const handleSMS = () => {
    setShowSMSModal(true);
  };

  const sendSMS = async () => {
    toast.success(`SMS sent to ${selectedLead.mobile}`);
    // Log activity
    await fetch(`/api/crm/leads/${selectedLead.id}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'sms_sent', user: 'Admin', note: smsMessage, lastActivity: 'SMS sent · Just now' }),
    });
    setSmsMessage('');
    setShowSMSModal(false);
    fetchLeads();
  };

  const handleCall = async () => {
    toast.info(`Initiating call to ${selectedLead.mobile}`);
    const note = prompt('Add a note about this call?');
    if (note) {
      await fetch(`/api/crm/leads/${selectedLead.id}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'call_made', user: 'Admin', note, lastActivity: 'Call made · Just now' }),
      });
      toast.success('Call note added');
      fetchLeads();
    }
  };

  const handleEmail = () => {
    window.location.href = `mailto:${selectedLead.email}?subject=RoomService AI - Follow Up`;
  };

  const handleScheduleDemo = async () => {
    const date = prompt('Enter demo date (YYYY-MM-DD):');
    const time = prompt('Enter demo time (HH:MM):');
    if (date && time) {
      await Promise.all([
        fetch(`/api/crm/leads/${selectedLead.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'demo', lastActivity: `Demo scheduled · Just now` }),
        }),
        fetch(`/api/crm/leads/${selectedLead.id}/activities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'demo_scheduled', user: 'Admin', note: `Demo set for ${date} at ${time}` }),
        }),
      ]);
      toast.success(`Demo scheduled for ${date} at ${time}`);
      fetchLeads();
      setSelectedLead({ ...selectedLead, status: 'demo' });
    }
  };

  const handleAddNote = async () => {
    if (newNote.trim()) {
      const res = await fetch(`/api/crm/leads/${selectedLead.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newNote, user: 'Admin' }),
      });
      if (res.ok) {
        const note = await res.json();
        setSelectedLead({ ...selectedLead, notes: [...(selectedLead.notes || []), note] });
        setNewNote('');
        fetchLeads();
      } else {
        toast.error('Failed to add note');
      }
    }
  };

  const handleStageChange = async (newStage) => {
    let lostReason = null;
    if (newStage === 'lost') {
      lostReason = prompt('Reason for losing the deal? (optional)');
    }

    await Promise.all([
      fetch(`/api/crm/leads/${selectedLead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStage, lastActivity: `Stage changed to ${newStage} · Just now` }),
      }),
      fetch(`/api/crm/leads/${selectedLead.id}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'stage_changed',
          user: 'Admin',
          note: lostReason ? `Lost reason: ${lostReason}` : `Moved to ${newStage}`,
        }),
      }),
    ]);

    setSelectedLead({ ...selectedLead, status: newStage });
    fetchLeads();
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    if (draggedLead && draggedLead.status !== newStatus) {
      await fetch(`/api/crm/leads/${draggedLead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, lastActivity: `Moved to ${newStatus} · Just now` }),
      });
      if (selectedLead && selectedLead.id === draggedLead.id) {
        setSelectedLead({ ...draggedLead, status: newStatus });
      }
      fetchLeads();
    }
    setDraggedLead(null);
  };

  // New Lead Handler
  const handleCreateLead = async (formData) => {
    const res = await fetch('/api/crm/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, user: 'Admin' }),
    });
    if (res.ok) {
      toast.success('Lead created successfully');
      fetchLeads();
      setShowNewLeadModal(false);
    } else {
      toast.error('Failed to create lead');
    }
  };

  // Delete Lead Handler
  const handleDeleteLead = async () => {
    const confirmed = await confirm({
      title: 'Delete Lead',
      message: `Are you sure you want to delete ${selectedLead.hotelName}?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger'
    });

    if (confirmed) {
      const res = await fetch(`/api/crm/leads/${selectedLead.id}`, { method: 'DELETE' });
      if (res.ok) {
        setSelectedLead(null);
        toast.success(`${selectedLead.hotelName} has been deleted`);
        fetchLeads();
      } else {
        toast.error('Failed to delete lead');
      }
    }
  };

  // Edit Lead Handlers
  const handleEnterEditMode = () => {
    setEditForm({
      hotelName: selectedLead.hotelName,
      contactName: selectedLead.contactName,
      role: selectedLead.role,
      phone: selectedLead.phone,
      mobile: selectedLead.mobile,
      email: selectedLead.email,
      city: selectedLead.city,
      country: selectedLead.country,
      value: selectedLead.value,
    });
    setEditMode(true);
  };

  const handleSaveEdit = async () => {
    const res = await fetch(`/api/crm/leads/${selectedLead.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editForm, value: parseInt(editForm.value) || 0 }),
    });
    if (res.ok) {
      const updated = await res.json();
      setSelectedLead(updated);
      toast.success('Lead updated');
      fetchLeads();
    } else {
      toast.error('Failed to update lead');
    }
    setEditMode(false);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditForm({});
  };

  // CSV column aliases → internal field names
  const CSV_FIELD_MAP = {
    hotelname: 'hotelName', 'hotel name': 'hotelName', hotel: 'hotelName', property: 'hotelName', 'property name': 'hotelName',
    contactname: 'contactName', 'contact name': 'contactName', contact: 'contactName', name: 'contactName',
    role: 'role', position: 'role', title: 'role', 'job title': 'role',
    phone: 'phone', telephone: 'phone', tel: 'phone',
    mobile: 'mobile', cell: 'mobile', cellphone: 'mobile',
    email: 'email', 'email address': 'email',
    city: 'city', location: 'city',
    country: 'country',
    timezone: 'timezone', 'time zone': 'timezone', tz: 'timezone',
    value: 'value', 'deal value': 'value', price: 'value', amount: 'value',
    nextactiondate: 'nextActionDate', 'next action date': 'nextActionDate', 'next action': 'nextActionDate', 'action date': 'nextActionDate',
  };

  const parseCsv = (text) => {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return { rows: [], errors: ['CSV must have a header row and at least one data row.'] };

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
    const fieldKeys = headers.map(h => CSV_FIELD_MAP[h] || null);

    const rows = [];
    const errors = [];

    lines.slice(1).forEach((line, i) => {
      if (!line.trim()) return;
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const row = {};
      fieldKeys.forEach((key, j) => { if (key) row[key] = values[j] ?? ''; });

      const rowErrors = [];
      if (!row.hotelName) rowErrors.push('Hotel Name required');
      if (!row.contactName) rowErrors.push('Contact Name required');
      if (rowErrors.length) {
        errors.push(`Row ${i + 2}: ${rowErrors.join(', ')}`);
      } else {
        rows.push(row);
      }
    });

    return { rows, errors };
  };

  const handleCsvFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const { rows, errors } = parseCsv(ev.target.result);
      setCsvRows(rows);
      setCsvErrors(errors);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCsvImport = async () => {
    if (!csvRows.length) return;
    setCsvImporting(true);
    try {
      const res = await fetch('/api/crm/leads/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads: csvRows }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Import failed');
      toast.success(`${data.created} lead${data.created !== 1 ? 's' : ''} imported successfully`);
      setShowCsvModal(false);
      setCsvRows([]);
      setCsvErrors([]);
      fetchLeads();
    } catch (err) {
      toast.error(err.message || 'Import failed');
    } finally {
      setCsvImporting(false);
    }
  };

  const downloadTemplate = () => {
    const header = 'hotelName,contactName,role,phone,mobile,email,city,country,timezone,value,nextActionDate';
    const example = 'The Dorchester,John Smith,General Manager,+44 20 7629 8888,+44 7700 900123,john@dorchester.com,London,United Kingdom,Europe/London,45000,2026-04-01';
    const blob = new Blob([`${header}\n${example}\n`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crm_leads_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const smsTemplates = [
    { label: 'Intro follow-up', text: 'Hi {name}, thanks for your interest in RoomService AI. I wanted to follow up on our conversation. When would be a good time to discuss how we can help {hotel}?' },
    { label: 'Demo scheduling', text: 'Hi {name}, I\'d love to show you RoomService AI in action. Are you available for a quick demo this week?' },
    { label: 'Post-demo follow-up', text: 'Hi {name}, thanks for taking the time for the demo yesterday. Do you have any questions about how RoomService AI can work for {hotel}?' },
    { label: 'Proposal check-in', text: 'Hi {name}, just checking in on the proposal I sent last week. Happy to answer any questions!' },
  ];

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'lead_created': return <User className="w-4 h-4 text-blue-500" />;
      case 'sms_sent': return <MessageSquare className="w-4 h-4 text-green-500" />;
      case 'call_made': return <Phone className="w-4 h-4 text-purple-500" />;
      case 'email_sent': return <Mail className="w-4 h-4 text-orange-500" />;
      case 'demo_scheduled': return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'demo_completed': return <Calendar className="w-4 h-4 text-green-500" />;
      case 'proposal_sent': return <Send className="w-4 h-4 text-copper" />;
      case 'stage_changed': return <ChevronRight className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading CRM data...</div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal font-playfair mb-2">CRM Pipeline</h1>
          <p className="text-gray-600">Manage hotel leads, conversations, and deal progress — all in one place.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCsvModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload CSV
          </button>
          <button
            onClick={() => setShowNewLeadModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-copper text-white rounded-sm font-medium hover:bg-copper-hover transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Lead
          </button>
        </div>
      </div>

      {/* Stats Summary - At Top */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-sm shadow-md border-l-4 border-copper">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 font-medium">Total Pipeline Value</p>
            <DollarSign className="w-5 h-5 text-copper" />
          </div>
          <p className="text-3xl font-bold text-charcoal">£{totalPipelineValue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-sm shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 font-medium">Active Leads</p>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-charcoal">{activeLeads}</p>
        </div>
        <div className="bg-white p-6 rounded-sm shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 font-medium">Deals Won</p>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">{dealsWon}</p>
        </div>
        <div className="bg-white p-6 rounded-sm shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 font-medium">Conversion Rate</p>
            <Percent className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-charcoal">{conversionRate}%</p>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {columns.map((column) => (
          <div
            key={column.id}
            className="bg-gray-100 rounded-sm p-3"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold uppercase text-xs text-gray-700 truncate">
                {column.label}
              </h3>
              <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full ml-1 flex-shrink-0">
                {getLeadsByStatus(column.id).length}
              </span>
            </div>

            <div className="space-y-2.5 min-h-[100px]">
              {getLeadsByStatus(column.id).map((lead) => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead)}
                  className="bg-white p-2.5 rounded-sm shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-grab active:cursor-grabbing hover:border-copper hover:scale-105 min-h-[160px] flex flex-col justify-between"
                  onClick={() => handleLeadClick(lead)}
                >
                  <div>
                    <h4 className="font-bold text-xs mb-1 text-charcoal line-clamp-2 leading-tight">{lead.hotelName}</h4>
                    <p className="text-xs text-gray-600 mb-1 truncate">{lead.contactName}</p>
                    <p className="text-sm font-bold text-copper mb-1.5">£{lead.value.toLocaleString()}</p>
                  </div>
                  <div>
                    {lead.nextActionDate && (
                      <p className="text-xs text-gray-500 mb-0.5 flex items-center">
                        <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{new Date(lead.nextActionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                      </p>
                    )}
                    <p className="text-xs text-gray-400 italic truncate">{lead.lastActivity}</p>
                  </div>
                </div>
              ))}

              {getLeadsByStatus(column.id).length === 0 && (
                <p className="text-xs text-gray-400 text-center py-8">No leads</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lead Detail Drawer */}
      {selectedLead && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <div className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-white z-50 shadow-2xl overflow-y-auto">
            {/* Drawer Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-charcoal font-playfair mb-1">
                    {editMode ? (
                      <input
                        type="text"
                        value={editForm.hotelName}
                        onChange={(e) => setEditForm({ ...editForm, hotelName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                      />
                    ) : (
                      selectedLead.hotelName
                    )}
                  </h2>
                  <p className="text-gray-600 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {editMode ? (
                      <>
                        <input
                          type="text"
                          value={editForm.city}
                          onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                          placeholder="City"
                          className="w-24 px-2 py-1 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-copper"
                        />
                        <span>,</span>
                        <input
                          type="text"
                          value={editForm.country}
                          onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                          placeholder="Country"
                          className="w-32 px-2 py-1 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-copper"
                        />
                      </>
                    ) : (
                      `${selectedLead.city}, ${selectedLead.country}`
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  {editMode ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        className="p-2 bg-green-500 text-white hover:bg-green-600 rounded-sm transition-colors"
                        title="Save"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 hover:bg-gray-100 rounded-sm transition-colors"
                        title="Cancel"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleEnterEditMode}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-sm transition-colors"
                        title="Edit Lead"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleDeleteLead}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-sm transition-colors"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={closeDrawer}
                        className="p-2 hover:bg-gray-100 rounded-sm transition-colors"
                        title="Close"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Deal Value</label>
                  {editMode ? (
                    <input
                      type="number"
                      value={editForm.value}
                      onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-sm text-xl font-bold text-copper focus:outline-none focus:border-copper"
                      placeholder="0"
                    />
                  ) : (
                    <p className="text-xl font-bold text-copper">£{selectedLead.value.toLocaleString()}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Stage</label>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleStageChange(e.target.value)}
                    disabled={editMode}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-sm text-sm font-medium focus:outline-none focus:border-copper disabled:bg-gray-100"
                  >
                    <option value="lead">Lead</option>
                    <option value="contacted">Contacted</option>
                    <option value="demo">Demo Scheduled</option>
                    <option value="proposal">Proposal Sent</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div>
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        value={editForm.contactName}
                        onChange={(e) => setEditForm({ ...editForm, contactName: e.target.value })}
                        placeholder="Contact Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm font-bold focus:outline-none focus:border-copper mb-2"
                      />
                      <input
                        type="text"
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                        placeholder="Role"
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-copper"
                      />
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-charcoal">{selectedLead.contactName}</p>
                      <p className="text-sm text-gray-600">{selectedLead.role}</p>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  {editMode ? (
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      placeholder="Phone"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                    />
                  ) : (
                    <span className="text-gray-700">{selectedLead.phone}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  {editMode ? (
                    <input
                      type="tel"
                      value={editForm.mobile}
                      onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                      placeholder="Mobile"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                    />
                  ) : (
                    <span className="text-gray-700">{selectedLead.mobile}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  {editMode ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      placeholder="Email"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                    />
                  ) : (
                    <span className="text-gray-700">{selectedLead.email}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{selectedLead.timezone}</span>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleSMS}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-sm font-medium hover:bg-green-600 transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  SMS
                </button>
                <button
                  onClick={handleCall}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Call
                </button>
                <button
                  onClick={handleEmail}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-sm font-medium hover:bg-orange-600 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Email
                </button>
                <button
                  onClick={handleScheduleDemo}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 text-white rounded-sm font-medium hover:bg-purple-600 transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule Demo
                </button>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-4">Activity Timeline</h3>
              <div className="space-y-4">
                {selectedLead.activities && selectedLead.activities.length > 0 ? (
                  selectedLead.activities.slice().reverse().map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-charcoal capitalize">
                          {activity.type.replace(/_/g, ' ')}
                        </p>
                        {activity.note && (
                          <p className="text-sm text-gray-600 mt-1">{activity.note}</p>
                        )}
                        {activity.duration && (
                          <p className="text-xs text-gray-500 mt-1">
                            Duration: {Math.floor(activity.duration / 60)} minutes
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {activity.user} · {formatTimestamp(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic">No activity yet</p>
                )}
              </div>
            </div>

            {/* Notes Section */}
            <div className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-4">Notes</h3>

              {/* Add Note */}
              <div className="mb-4">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-copper resize-none"
                  rows="3"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="mt-2 px-4 py-2 bg-copper text-white rounded-sm font-medium hover:bg-copper-hover transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add Note
                </button>
              </div>

              {/* Notes List */}
              <div className="space-y-3">
                {selectedLead.notes && selectedLead.notes.length > 0 ? (
                  selectedLead.notes.slice().reverse().map((note) => (
                    <div key={note.id} className="bg-gray-50 p-4 rounded-sm border border-gray-200">
                      <p className="text-sm text-gray-700 mb-2">{note.text}</p>
                      <p className="text-xs text-gray-400">
                        {note.user} · {formatTimestamp(note.timestamp)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic">No notes yet</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* SMS Modal */}
      {showSMSModal && selectedLead && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={() => setShowSMSModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-sm shadow-2xl z-[70] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-charcoal">Send SMS</h3>
              <button
                onClick={() => setShowSMSModal(false)}
                className="p-2 hover:bg-gray-100 rounded-sm transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Recipient</label>
              <input
                type="text"
                value={selectedLead.mobile}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-sm bg-gray-50 text-gray-600"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Templates</label>
              <select
                onChange={(e) => {
                  const template = smsTemplates.find(t => t.label === e.target.value);
                  if (template) {
                    setSmsMessage(
                      template.text
                        .replace('{name}', selectedLead.contactName.split(' ')[0])
                        .replace('{hotel}', selectedLead.hotelName)
                    );
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
              >
                <option value="">Select a template...</option>
                {smsTemplates.map((template) => (
                  <option key={template.label} value={template.label}>
                    {template.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-copper resize-none"
                rows="6"
              />
              <p className="text-xs text-gray-500 mt-1">{smsMessage.length} characters</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSMSModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={sendSMS}
                disabled={!smsMessage.trim()}
                className="flex-1 px-4 py-2 bg-copper text-white rounded-sm font-medium hover:bg-copper-hover transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Send SMS
              </button>
            </div>
          </div>
        </>
      )}

      {/* CSV Upload Modal */}
      {showCsvModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[60]" onClick={() => { setShowCsvModal(false); setCsvRows([]); setCsvErrors([]); }} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-white rounded-sm shadow-2xl z-[70] p-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-bold text-charcoal">Import Leads via CSV</h3>
                <p className="text-sm text-gray-500 mt-0.5">Upload a CSV file to bulk-import leads into the pipeline</p>
              </div>
              <button onClick={() => { setShowCsvModal(false); setCsvRows([]); setCsvErrors([]); }} className="p-2 hover:bg-gray-100 rounded-sm transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template download */}
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-sm px-4 py-3 mb-5">
              <div>
                <p className="text-sm font-medium text-blue-800">Need a template?</p>
                <p className="text-xs text-blue-600 mt-0.5">Download our CSV template with the correct column headers</p>
              </div>
              <button onClick={downloadTemplate} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-sm font-medium hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Template
              </button>
            </div>

            {/* File input */}
            <div className="border-2 border-dashed border-gray-300 rounded-sm p-8 text-center mb-5 hover:border-copper transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700 mb-1">Choose a CSV file</p>
              <p className="text-xs text-gray-400 mb-3">Required columns: hotelName, contactName — all others optional</p>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-copper text-white text-sm rounded-sm font-medium hover:bg-copper-hover transition-colors">
                <Upload className="w-4 h-4" />
                Browse File
                <input type="file" accept=".csv,text/csv" className="hidden" onChange={handleCsvFile} />
              </label>
            </div>

            {/* Errors */}
            {csvErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-sm p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <p className="text-sm font-medium text-red-700">{csvErrors.length} row{csvErrors.length !== 1 ? 's' : ''} skipped</p>
                </div>
                <ul className="text-xs text-red-600 space-y-0.5 list-disc list-inside">
                  {csvErrors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            )}

            {/* Preview table */}
            {csvRows.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-medium text-green-700">{csvRows.length} lead{csvRows.length !== 1 ? 's' : ''} ready to import</p>
                </div>
                <div className="overflow-x-auto rounded-sm border border-gray-200 mb-5">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        {['Hotel', 'Contact', 'Role', 'Email', 'City', 'Country', 'Value'].map(h => (
                          <th key={h} className="px-3 py-2 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvRows.slice(0, 10).map((row, i) => (
                        <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="px-3 py-2 font-medium text-charcoal">{row.hotelName}</td>
                          <td className="px-3 py-2 text-gray-600">{row.contactName}</td>
                          <td className="px-3 py-2 text-gray-600">{row.role || '—'}</td>
                          <td className="px-3 py-2 text-gray-600">{row.email || '—'}</td>
                          <td className="px-3 py-2 text-gray-600">{row.city || '—'}</td>
                          <td className="px-3 py-2 text-gray-600">{row.country || '—'}</td>
                          <td className="px-3 py-2 text-gray-600">{row.value ? `£${parseInt(row.value).toLocaleString()}` : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {csvRows.length > 10 && (
                    <p className="text-xs text-gray-400 text-center py-2 border-t border-gray-100">
                      +{csvRows.length - 10} more rows not shown
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setCsvRows([]); setCsvErrors([]); }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleCsvImport}
                    disabled={csvImporting}
                    className="flex-1 px-4 py-2 bg-copper text-white rounded-sm font-medium hover:bg-copper-hover transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {csvImporting ? 'Importing…' : `Import ${csvRows.length} Lead${csvRows.length !== 1 ? 's' : ''}`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* New Lead Modal */}
      {showNewLeadModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={() => setShowNewLeadModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-sm shadow-2xl z-[70] p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-charcoal">Create New Lead</h3>
              <button
                onClick={() => setShowNewLeadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-sm transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleCreateLead(Object.fromEntries(formData));
                e.target.reset();
              }}
              className="space-y-4"
            >
              {/* Hotel Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Name *</label>
                <input
                  type="text"
                  name="hotelName"
                  required
                  placeholder="The Dorchester"
                  className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="London"
                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                  <input
                    type="text"
                    name="country"
                    required
                    placeholder="United Kingdom"
                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-bold text-gray-700 mb-3">Contact Person</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name *</label>
                      <input
                        type="text"
                        name="contactName"
                        required
                        placeholder="John Smith"
                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                      <input
                        type="text"
                        name="role"
                        required
                        placeholder="General Manager"
                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="+44 20 7629 8888"
                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mobile *</label>
                      <input
                        type="tel"
                        name="mobile"
                        required
                        placeholder="+44 7700 900123"
                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="contact@hotel.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                    />
                  </div>
                </div>
              </div>

              {/* Deal Information */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-bold text-gray-700 mb-3">Deal Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deal Value (£) *</label>
                    <input
                      type="number"
                      name="value"
                      required
                      placeholder="45000"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Next Action Date</label>
                    <input
                      type="date"
                      name="nextActionDate"
                      className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <input
                    type="text"
                    name="timezone"
                    placeholder="Europe/London"
                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewLeadModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-copper text-white rounded-sm font-medium hover:bg-copper-hover transition-colors"
                >
                  Create Lead
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
