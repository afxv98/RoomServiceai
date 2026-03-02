'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Pencil, User, Mail, Calendar } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';

const EMPTY_FORM = { name: '', email: '', password: '' };

export default function UsersPage() {
  const { toast, confirm } = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  // modal state: null = closed, 'create' = new account, { ...user } = editing
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/hotel-users');
      if (!res.ok) throw new Error();
      setUsers(await res.json());
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setModal('create');
  };

  const openEdit = (user) => {
    setForm({ name: user.name || '', email: user.email, password: '' });
    setModal(user);
  };

  const closeModal = () => {
    setModal(null);
    setForm(EMPTY_FORM);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/hotel-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Failed to create user'); return; }
      toast.success('Hotel manager account created');
      closeModal();
      setUsers((u) => [data, ...u]);
    } catch {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { name: form.name, email: form.email };
    if (form.password) payload.password = form.password;
    try {
      const res = await fetch(`/api/admin/hotel-users/${modal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Failed to update user'); return; }
      toast.success('Account updated');
      closeModal();
      setUsers((u) => u.map((x) => (x.id === data.id ? data : x)));
    } catch {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user) => {
    const ok = await confirm(`Delete account for ${user.email}? This cannot be undone.`);
    if (!ok) return;
    try {
      const res = await fetch(`/api/admin/hotel-users/${user.id}`, { method: 'DELETE' });
      if (!res.ok) { toast.error('Failed to delete user'); return; }
      toast.success('Account deleted');
      setUsers((u) => u.filter((x) => x.id !== user.id));
    } catch {
      toast.error('Network error');
    }
  };

  const isEditing = modal && modal !== 'create';

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hotel Manager Accounts</h1>
          <p className="text-gray-500 text-sm mt-1">Manage login access for hotel managers</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-copper text-white px-4 py-2 rounded-sm font-medium hover:bg-copper-hover transition-colors"
        >
          <Plus className="w-4 h-4" /> New Account
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-copper" />
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-sm border border-gray-200 p-12 text-center text-gray-400">
          <User className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No hotel manager accounts yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-sm border border-gray-200 divide-y divide-gray-100">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-copper/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-copper" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user.name || '—'}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Mail className="w-3 h-3" />
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-gray-400 mr-2">
                  <Calendar className="w-3 h-3" />
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
                <button
                  onClick={() => openEdit(user)}
                  className="p-1.5 text-gray-400 hover:text-copper transition-colors rounded"
                  title="Edit account"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(user)}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded"
                  title="Delete account"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              {isEditing ? 'Edit Account' : 'New Hotel Manager Account'}
            </h2>
            <form onSubmit={isEditing ? handleEdit : handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Jane Smith"
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-copper"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="jane@hotel.com"
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-copper"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {!isEditing && <span className="text-red-500">*</span>}
                  {isEditing && <span className="text-gray-400 font-normal"> — leave blank to keep current</span>}
                </label>
                <input
                  type="password"
                  required={!isEditing}
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder={isEditing ? 'New password (optional)' : 'Min. 8 characters'}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-copper"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm bg-copper text-white rounded-sm font-medium hover:bg-copper-hover disabled:opacity-60"
                >
                  {saving ? (isEditing ? 'Saving…' : 'Creating…') : (isEditing ? 'Save Changes' : 'Create Account')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
