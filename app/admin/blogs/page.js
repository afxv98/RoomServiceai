'use client';

import { useState, useEffect, useCallback } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Eye, EyeOff, Search, Calendar, User, Clock, Loader2 } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import RichTextEditor from '@/components/shared/RichTextEditor';

const CATEGORIES = ['Technology', 'Best Practices', 'Business', 'Industry Trends', 'Implementation', 'Case Studies'];
const EMPTY_FORM = { title: '', excerpt: '', content: '', author: '', category: 'Technology', readTime: '', slug: '', image: '', published: true };

const INPUT_CLS = 'w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper';

function PostForm({ data, onChange }) {
  return (
    <div className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
        <input type="text" value={data.title} onChange={(e) => onChange({ ...data, title: e.target.value })} className={INPUT_CLS} placeholder="Enter blog post title" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt *</label>
        <textarea value={data.excerpt} onChange={(e) => onChange({ ...data, excerpt: e.target.value })} rows={3} className={INPUT_CLS} placeholder="Brief description of the blog post" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <RichTextEditor value={data.content} onChange={(html) => onChange({ ...data, content: html })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
          <input type="text" value={data.author} onChange={(e) => onChange({ ...data, author: e.target.value })} className={INPUT_CLS} placeholder="Author name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select value={data.category} onChange={(e) => onChange({ ...data, category: e.target.value })} className={INPUT_CLS}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Read Time</label>
          <input type="text" value={data.readTime} onChange={(e) => onChange({ ...data, readTime: e.target.value })} className={INPUT_CLS} placeholder="e.g., 5 min read" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
          <input type="text" value={data.slug} onChange={(e) => onChange({ ...data, slug: e.target.value })} className={INPUT_CLS} placeholder="url-friendly-slug (auto-generated if blank)" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
        <input type="text" value={data.image} onChange={(e) => onChange({ ...data, image: e.target.value })} className={INPUT_CLS} placeholder="/blog/image.jpg" />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={data.published} onChange={(e) => onChange({ ...data, published: e.target.checked })} className="form-checkbox text-copper" />
        <span className="text-sm text-gray-700">Publish immediately</span>
      </label>
    </div>
  );
}

export default function BlogsPage() {
  const { toast, confirm } = useNotification();

  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [newPost, setNewPost] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/blogs');
      if (!res.ok) throw new Error('Failed to fetch');
      setBlogPosts(await res.json());
    } catch {
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || post.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddPost = async () => {
    if (!newPost.title.trim() || !newPost.excerpt.trim() || !newPost.author.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create post');
      toast.success(`"${data.title}" has been created`);
      setShowAddModal(false);
      setNewPost(EMPTY_FORM);
      fetchPosts();
    } catch (err) {
      toast.error(err.message || 'Failed to create post');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePost = async () => {
    if (!editingPost.title.trim() || !editingPost.excerpt.trim() || !editingPost.author.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/blogs/${editingPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPost),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update post');
      toast.success('Blog post updated successfully');
      setShowEditModal(false);
      setEditingPost(null);
      fetchPosts();
    } catch (err) {
      toast.error(err.message || 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (post) => {
    const confirmed = await confirm({
      title: 'Delete Blog Post',
      message: `Are you sure you want to delete "${post.title}"? This action cannot be undone.`,
      variant: 'danger',
    });
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/blogs/${post.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success(`"${post.title}" has been deleted`);
      fetchPosts();
    } catch {
      toast.error('Failed to delete post');
    }
  };

  const handleTogglePublish = async (post) => {
    const action = post.published ? 'unpublish' : 'publish';
    const confirmed = await confirm({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Post`,
      message: `Are you sure you want to ${action} "${post.title}"?`,
      variant: 'primary',
    });
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/blogs/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published }),
      });
      if (!res.ok) throw new Error('Failed to update');
      toast.success(`Blog post ${action}ed successfully`);
      fetchPosts();
    } catch {
      toast.error('Failed to update post');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-copper" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-1">Manage blog posts and content</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-copper text-white px-6 py-3 rounded-sm hover:bg-copper-hover transition-colors shadow-md">
          <Plus className="w-5 h-5" />
          New Post
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Posts', value: blogPosts.length, icon: BookOpen, color: 'text-copper' },
          { label: 'Published', value: blogPosts.filter(p => p.published).length, icon: Eye, color: 'text-green-500' },
          { label: 'Drafts', value: blogPosts.filter(p => !p.published).length, icon: EyeOff, color: 'text-yellow-500' },
          { label: 'Categories', value: CATEGORIES.length, icon: BookOpen, color: 'text-copper' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white p-6 rounded-sm shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
              </div>
              <Icon className={`w-12 h-12 opacity-20 ${color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search posts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['All', ...CATEGORIES].map((cat) => (
              <button key={cat} onClick={() => setFilterCategory(cat)} className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${filterCategory === cat ? 'bg-copper text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-sm shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Status', 'Title', 'Category', 'Author', 'Date', 'Read Time', 'Actions'].map((h, i) => (
                  <th key={h} className={`py-4 px-6 text-sm font-semibold text-gray-700 ${i === 6 ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPosts.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-12 text-gray-500">No blog posts found</td></tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${post.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-4 px-6 max-w-md">
                      <p className="font-medium text-gray-900">{post.title}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">{post.excerpt}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">{post.category}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <User className="w-4 h-4 text-gray-400" />{post.author}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Clock className="w-4 h-4 text-gray-400" />{post.readTime || '—'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleTogglePublish(post)} className={`p-2 rounded hover:bg-gray-100 transition-colors ${post.published ? 'text-yellow-600' : 'text-green-600'}`} title={post.published ? 'Unpublish' : 'Publish'}>
                          {post.published ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        <button onClick={() => { setEditingPost({ ...post }); setShowEditModal(true); }} className="p-2 text-blue-600 rounded hover:bg-blue-50 transition-colors" title="Edit">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDeletePost(post)} className="p-2 text-red-600 rounded hover:bg-red-50 transition-colors" title="Delete">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Post Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Create New Blog Post</h2>
            </div>
            <PostForm data={newPost} onChange={setNewPost} />
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => { setShowAddModal(false); setNewPost(EMPTY_FORM); }} className="px-6 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleAddPost} disabled={saving} className="px-6 py-2 bg-copper text-white rounded-sm hover:bg-copper-hover transition-colors disabled:bg-gray-300 flex items-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {showEditModal && editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Edit Blog Post</h2>
            </div>
            <PostForm data={editingPost} onChange={setEditingPost} />
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => { setShowEditModal(false); setEditingPost(null); }} className="px-6 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleUpdatePost} disabled={saving} className="px-6 py-2 bg-copper text-white rounded-sm hover:bg-copper-hover transition-colors disabled:bg-gray-300 flex items-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Update Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
