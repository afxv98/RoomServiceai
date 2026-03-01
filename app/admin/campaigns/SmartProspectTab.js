'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Search, Loader2, X, Users, BarChart2, Bookmark,
  Clock, Download, RefreshCw, Building2, MapPin,
  Star, Mail, TrendingUp, Filter, AlertCircle,
  ChevronDown, Plus, Check, FileSearch, Hash,
} from 'lucide-react';

// ─── Proxy helper (prospect-api.smartlead.ai) ─────────────────────────────────

const slp = (path, opts = {}) =>
  fetch(`/api/smartlead-prospect/${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  }).then((r) => r.json());

// ─── Endpoint paths ────────────────────────────────────────────────────────────
// NOTE: verify each path against your SmartLead API docs if any return 404/405

const EP = {
  // Filter option lookups (GET)
  departments:       'search-email-leads/departments',
  cities:            'search-email-leads/cities',
  countries:         'search-email-leads/countries',
  states:            'search-email-leads/states',
  industries:        'search-email-leads/industries',
  subIndustries:     'search-email-leads/sub-industries',
  headCounts:        'search-email-leads/head-counts',
  levels:            'search-email-leads/levels',
  revenueOptions:    'search-email-leads/revenue',
  companies:         'search-email-leads/company',
  domains:           'search-email-leads/domain',
  jobTitles:         'search-email-leads/job-title',
  keywords:          'search-email-leads/keywords',
  // Contact operations
  searchContacts:    'search-email-leads/search-contacts',
  fetchContacts:     'search-email-leads/fetch-contacts',
  getContacts:       'search-email-leads/get-contacts',
  reviewContacts:    'search-email-leads/review-contacts',
  // Saved / recent / fetched searches
  savedSearches:     'search-email-leads/search-filters/saved-searches',
  recentSearches:    'search-email-leads/search-filters/recent-searches',
  fetchedSearches:   'search-email-leads/search-filters/fetched-searches',
  saveSearch:        'search-email-leads/search-filters/save-search',
  updateSavedSearch: 'search-email-leads/search-filters/save-search',   // called as EP.updateSavedSearch/{id} PUT
  updateFetchedLead: 'search-email-leads/search-filters/fetched-searches', // called as EP.updateFetchedLead/{id} PUT
  // Analytics
  searchAnalytics:   'search-email-leads/search-analytics',
  replyAnalytics:    'search-email-leads/reply-analytics',
  // Find emails
  findEmails:        'search-email-leads/search-contacts/find-emails',
};

// ─── Shared UI atoms ──────────────────────────────────────────────────────────

function ErrBanner({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <span>{msg}</span>
    </div>
  );
}

function Empty({ icon: Icon = Users, title, sub }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <p className="font-semibold text-charcoal text-sm mb-1">{title}</p>
      {sub && <p className="text-xs text-gray-500">{sub}</p>}
    </div>
  );
}

function SpinRow() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-6 h-6 animate-spin text-copper" />
    </div>
  );
}

// ─── Sub-tab nav ──────────────────────────────────────────────────────────────

const SP_TABS = [
  { id: 'search',    label: 'Search Contacts', icon: Search },
  { id: 'find',      label: 'Find Emails',     icon: Mail },
  { id: 'saved',     label: 'Saved Searches',  icon: Bookmark },
  { id: 'recent',    label: 'Recent Searches', icon: Clock },
  { id: 'fetched',   label: 'Fetched Leads',   icon: Download },
  { id: 'analytics', label: 'Analytics',       icon: BarChart2 },
];

// ─── Multiselect chip input ───────────────────────────────────────────────────

function MultiSelect({ label, options = [], selected = [], onChange, loading = false }) {
  const [open, setOpen] = useState(false);
  const toggle = (val) =>
    onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white hover:border-copper transition-colors"
      >
        <span className="text-gray-500 truncate">
          {selected.length ? `${label}: ${selected.length} selected` : label}
        </span>
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="absolute z-30 top-full mt-1 left-0 w-full min-w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
          {options.length === 0 ? (
            <p className="px-3 py-2 text-xs text-gray-400">{loading ? 'Loading…' : 'No options'}</p>
          ) : (
            options.map((opt) => {
              const val = typeof opt === 'object' ? (opt.value ?? opt.name ?? opt.id) : opt;
              const lbl = typeof opt === 'object' ? (opt.label ?? opt.name ?? String(opt.id ?? opt)) : opt;
              const active = selected.includes(val);
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => toggle(val)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${active ? 'text-copper font-medium' : 'text-charcoal'}`}
                >
                  <span className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${active ? 'bg-copper border-copper' : 'border-gray-300'}`}>
                    {active && <Check className="w-3 h-3 text-white" />}
                  </span>
                  {lbl}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

// ─── Search Contacts Panel ────────────────────────────────────────────────────

const EMPTY_FILTERS = {
  job_titles: [],
  departments: [],
  levels: [],
  industries: [],
  sub_industries: [],
  countries: [],
  states: [],
  cities: [],
  head_counts: [],
  revenues: [],
  company_names: [],
  domains: [],
  keywords: '',
};

function SearchContactsPanel() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [opts, setOpts] = useState({});
  const [optsLoading, setOptsLoading] = useState({});
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchId, setSearchId] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchingIds, setFetchingIds] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [selected, setSelected] = useState([]);
  const [err, setErr] = useState('');
  const [searched, setSearched] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/30 transition-colors';

  // Load a filter option list once
  const loadOpts = useCallback(async (key, endpoint, params = '') => {
    if (opts[key]) return;
    setOptsLoading((prev) => ({ ...prev, [key]: true }));
    try {
      const d = await slp(`${endpoint}${params ? '?' + params : ''}`);
      const raw = d.data || d.options || d.items || (Array.isArray(d) ? d : []);
      // Normalize: add a consistent `name` field since different endpoints use different
      // naming conventions (country_name, industry_name, level_name, head_count, etc.)
      const list = raw.map((item) => {
        if (typeof item !== 'object' || item === null) return item;
        const name =
          item.name ?? item.country_name ?? item.industry_name ?? item.sub_industry_name ??
          item.department_name ?? item.level_name ?? item.city_name ?? item.state_name ??
          item.head_count ?? item.revenue_range ?? item.label ?? String(item.id ?? item);
        return { ...item, name };
      });
      setOpts((prev) => ({ ...prev, [key]: list }));
    } catch {
      setOpts((prev) => ({ ...prev, [key]: [] }));
    } finally {
      setOptsLoading((prev) => ({ ...prev, [key]: false }));
    }
  }, [opts]);

  // Load static options on mount
  useEffect(() => {
    loadOpts('headCounts',     EP.headCounts,     'limit=100&offset=0');
    loadOpts('levels',         EP.levels,         'limit=100&offset=0');
    loadOpts('revenueOptions', EP.revenueOptions, 'limit=100&offset=0');
    loadOpts('departments',    EP.departments,     'limit=100&offset=0');
    loadOpts('industries',     EP.industries,     'limit=100&offset=0');
    loadOpts('subIndustries',  EP.subIndustries,  'limit=100&offset=0');
    loadOpts('countries',      EP.countries,      'limit=100&offset=0');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (key, val) => setFilters((prev) => ({ ...prev, [key]: val }));

  const handleSearch = async (p = 1) => {
    setLoading(true);
    setErr('');
    setSearched(true);
    setPage(p);
    try {
      const body = { ...filters, page: p, limit: 25 };
      const d = await slp(EP.searchContacts, { method: 'POST', body: JSON.stringify(body) });
      if (d.error) throw new Error(d.error);
      const payload = d.data ?? d;
      setResults(payload.list || payload.contacts || payload.leads || (Array.isArray(payload) ? payload : []));
      setTotal(payload.total_count ?? payload.total ?? payload.count ?? 0);
      setSearchId(payload.filter_id ?? payload.scroll_id ?? payload.search_id ?? null);
      setSelected([]);
    } catch (e) {
      setErr(e.message || 'Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = async () => {
    const ids = selected.length ? selected : results.map((r) => r.id).filter(Boolean);
    if (!ids.length) return;
    setFetching(true);
    setErr('');
    try {
      const body = { contact_ids: ids, search_id: searchId };
      const d = await slp(EP.fetchContacts, { method: 'POST', body: JSON.stringify(body) });
      if (d.error) throw new Error(d.error);
      setFetchingIds(ids);
      setSaveMsg('Contacts fetched successfully.');
    } catch (e) {
      setErr(e.message || 'Fetch failed.');
    } finally {
      setFetching(false);
    }
  };

  const handleSaveSearch = async () => {
    if (!saveName.trim()) return;
    setSaving(true);
    try {
      const d = await slp(EP.saveSearch, {
        method: 'POST',
        body: JSON.stringify({ name: saveName.trim(), filters, search_id: searchId }),
      });
      if (d.error) throw new Error(d.error);
      setSaveMsg('Search saved!');
      setShowSaveForm(false);
      setSaveName('');
    } catch (e) {
      setSaveMsg(e.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const toggleSelect = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]);

  const totalPages = Math.max(1, Math.ceil(total / 25));

  return (
    <div className="space-y-4">
      {/* Filter form */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-charcoal text-sm flex items-center gap-2">
            <Filter className="w-4 h-4 text-copper" />
            Search Filters
          </h3>
          <button
            onClick={() => setFilters(EMPTY_FILTERS)}
            className="text-xs text-gray-400 hover:text-copper transition-colors"
          >
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Job Titles */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Job Titles</label>
            <input
              className={inputCls}
              placeholder="CEO, Founder, Director…"
              value={filters.job_titles.join(', ')}
              onChange={(e) => set('job_titles', e.target.value.split(',').map((v) => v.trim()).filter(Boolean))}
            />
          </div>

          {/* Departments */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Departments</label>
            <MultiSelect
              label="Select departments"
              options={opts.departments || []}
              selected={filters.departments}
              onChange={(v) => set('departments', v)}
              loading={optsLoading.departments}
            />
          </div>

          {/* Levels / Seniority */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Seniority Level</label>
            <MultiSelect
              label="Select levels"
              options={opts.levels || []}
              selected={filters.levels}
              onChange={(v) => set('levels', v)}
              loading={optsLoading.levels}
            />
          </div>

          {/* Industries */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Industries</label>
            <MultiSelect
              label="Select industries"
              options={opts.industries || []}
              selected={filters.industries}
              onChange={(v) => { set('industries', v); set('sub_industries', []); }}
              loading={optsLoading.industries}
            />
          </div>

          {/* Sub-industries */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Sub-industries</label>
            <MultiSelect
              label="Select sub-industries"
              options={opts.subIndustries || []}
              selected={filters.sub_industries}
              onChange={(v) => set('sub_industries', v)}
              loading={optsLoading.subIndustries}
            />
          </div>

          {/* Head Count */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Head Count</label>
            <MultiSelect
              label="Select head counts"
              options={opts.headCounts || []}
              selected={filters.head_counts}
              onChange={(v) => set('head_counts', v)}
              loading={optsLoading.headCounts}
            />
          </div>

          {/* Revenue */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Revenue</label>
            <MultiSelect
              label="Select revenue ranges"
              options={opts.revenueOptions || []}
              selected={filters.revenues}
              onChange={(v) => set('revenues', v)}
              loading={optsLoading.revenueOptions}
            />
          </div>

          {/* Countries */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Countries</label>
            <MultiSelect
              label="Select countries"
              options={opts.countries || []}
              selected={filters.countries}
              onChange={(v) => { set('countries', v); set('states', []); set('cities', []); }}
              loading={optsLoading.countries}
            />
          </div>

          {/* Cities */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Cities</label>
            <input
              className={inputCls}
              placeholder="New York, London…"
              value={filters.cities.join(', ')}
              onChange={(e) => set('cities', e.target.value.split(',').map((v) => v.trim()).filter(Boolean))}
            />
          </div>

          {/* Company Names */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Company Names</label>
            <input
              className={inputCls}
              placeholder="Hilton, Marriott…"
              value={filters.company_names.join(', ')}
              onChange={(e) => set('company_names', e.target.value.split(',').map((v) => v.trim()).filter(Boolean))}
            />
          </div>

          {/* Domains */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Domains</label>
            <input
              className={inputCls}
              placeholder="hilton.com, marriott.com…"
              value={filters.domains.join(', ')}
              onChange={(e) => set('domains', e.target.value.split(',').map((v) => v.trim()).filter(Boolean))}
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Keywords</label>
            <input
              className={inputCls}
              placeholder="hotel, luxury, resort…"
              value={filters.keywords}
              onChange={(e) => set('keywords', e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => handleSearch(1)}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-copper text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-copper-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? 'Searching…' : 'Search Contacts'}
          </button>
          {searched && results.length > 0 && (
            <>
              <button
                onClick={handleFetch}
                disabled={fetching}
                className="inline-flex items-center gap-2 border border-copper text-copper px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-copper/5 transition-colors disabled:opacity-50"
              >
                {fetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {selected.length ? `Fetch ${selected.length} selected` : 'Fetch all'}
              </button>
              <button
                onClick={() => setShowSaveForm((v) => !v)}
                className="inline-flex items-center gap-2 border border-gray-300 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-semibold hover:border-copper hover:text-copper transition-colors"
              >
                <Bookmark className="w-4 h-4" />
                Save search
              </button>
            </>
          )}
        </div>

        {/* Save search form */}
        {showSaveForm && (
          <div className="mt-3 flex items-center gap-2">
            <input
              className={`${inputCls} max-w-xs`}
              placeholder="Search name…"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveSearch()}
            />
            <button
              onClick={handleSaveSearch}
              disabled={saving || !saveName.trim()}
              className="bg-copper text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
            </button>
          </div>
        )}
        {saveMsg && <p className="mt-2 text-xs text-green-600">{saveMsg}</p>}
      </div>

      {/* Results */}
      <ErrBanner msg={err} />
      {loading && <SpinRow />}
      {!loading && searched && (
        results.length === 0 ? (
          <Empty icon={Users} title="No contacts found" sub="Try adjusting your filters" />
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
              <p className="text-sm font-semibold text-charcoal">
                {total > 0 ? `${total.toLocaleString()} contacts` : `${results.length} contacts`}
              </p>
              {selected.length > 0 && (
                <span className="text-xs text-copper font-medium">{selected.length} selected</span>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 w-8">
                      <input
                        type="checkbox"
                        checked={selected.length === results.length && results.length > 0}
                        onChange={(e) => setSelected(e.target.checked ? results.map((r) => r.id).filter(Boolean) : [])}
                        className="rounded"
                      />
                    </th>
                    {['Name', 'Job Title', 'Company', 'Location', 'Industry', 'Status'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((c, i) => (
                    <tr key={c.id ?? i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {c.id && (
                          <input
                            type="checkbox"
                            checked={selected.includes(c.id)}
                            onChange={() => toggleSelect(c.id)}
                            className="rounded"
                          />
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-charcoal whitespace-nowrap">
                        {[c.firstName ?? c.first_name, c.lastName ?? c.last_name].filter(Boolean).join(' ') || c.name || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{c.jobTitle ?? c.job_title ?? c.title ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3 h-3 text-gray-300 flex-shrink-0" />
                          {c.companyName ?? c.company_name ?? c.company?.name ?? (typeof c.company === 'string' ? c.company : null) ?? '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-gray-300 flex-shrink-0" />
                          {c.city || c.country || c.location || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{c.industry ?? '—'}</td>
                      <td className="px-4 py-3">
                        {c.status ? (
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            fetchingIds.includes(c.id)
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {fetchingIds.includes(c.id) ? 'fetched' : c.status}
                          </span>
                        ) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between text-sm">
                <span className="text-gray-500">Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSearch(page - 1)}
                    disabled={page <= 1 || loading}
                    className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium disabled:opacity-40 hover:border-copper transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handleSearch(page + 1)}
                    disabled={page >= totalPages || loading}
                    className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium disabled:opacity-40 hover:border-copper transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}

// ─── Find Emails Panel ────────────────────────────────────────────────────────

const EMPTY_CONTACT = { firstName: '', lastName: '', companyDomain: '' };

function FindEmailsPanel() {
  const [contacts, setContacts] = useState([{ ...EMPTY_CONTACT }]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [searched, setSearched] = useState(false);

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/30 transition-colors';

  const updateContact = (i, field, value) =>
    setContacts((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));

  const addContact = () => {
    if (contacts.length < 10) setContacts((prev) => [...prev, { ...EMPTY_CONTACT }]);
  };

  const removeContact = (i) => setContacts((prev) => prev.filter((_, idx) => idx !== i));

  const handleSearch = async () => {
    const payload = contacts.filter(
      (c) => c.firstName.trim() || c.lastName.trim() || c.companyDomain.trim(),
    );
    if (!payload.length) { setErr('Add at least one contact.'); return; }
    setLoading(true);
    setErr('');
    setSearched(true);
    try {
      const d = await slp(EP.findEmails, { method: 'POST', body: JSON.stringify({ contacts: payload }) });
      if (d.error) throw new Error(d.error);
      setResults(d.data || d.contacts || (Array.isArray(d) ? d : []));
    } catch (e) {
      setErr(e.message || 'Search failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h3 className="font-bold text-charcoal text-sm mb-1 flex items-center gap-2">
          <Mail className="w-4 h-4 text-copper" />
          Find Emails
        </h3>
        <p className="text-xs text-gray-500 mb-4">Up to 10 contacts — first name, last name, and company domain.</p>

        <div className="space-y-3 mb-4">
          {contacts.map((c, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
              <div>
                {i === 0 && <label className="block text-xs font-semibold text-gray-500 mb-1">First Name</label>}
                <input className={inputCls} placeholder="John" value={c.firstName} onChange={(e) => updateContact(i, 'firstName', e.target.value)} />
              </div>
              <div>
                {i === 0 && <label className="block text-xs font-semibold text-gray-500 mb-1">Last Name</label>}
                <input className={inputCls} placeholder="Smith" value={c.lastName} onChange={(e) => updateContact(i, 'lastName', e.target.value)} />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  {i === 0 && <label className="block text-xs font-semibold text-gray-500 mb-1">Company Domain</label>}
                  <input className={inputCls} placeholder="hilton.com" value={c.companyDomain} onChange={(e) => updateContact(i, 'companyDomain', e.target.value)} />
                </div>
                {contacts.length > 1 && (
                  <button onClick={() => removeContact(i)} className={`${i === 0 ? 'mt-5' : ''} flex-shrink-0 p-2 text-gray-400 hover:text-red-500 transition-colors`}>
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {contacts.length < 10 && (
            <button onClick={addContact} className="text-sm text-copper font-semibold hover:text-copper-dark transition-colors">
              + Add another contact
            </button>
          )}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-copper text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-copper-dark transition-colors disabled:opacity-50 ml-auto"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            {loading ? 'Finding…' : 'Find Emails'}
          </button>
        </div>
      </div>

      <ErrBanner msg={err} />
      {searched && !loading && (
        results.length === 0 ? (
          <Empty icon={Mail} title="No emails found" sub="Try different names or domains" />
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-200">
              <p className="text-sm font-semibold text-charcoal">{results.length} result{results.length !== 1 ? 's' : ''}</p>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Name', 'Email', 'Company Domain', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((p, i) => (
                  <tr key={p.id ?? i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-charcoal">
                      {[p.firstName ?? p.first_name, p.lastName ?? p.last_name].filter(Boolean).join(' ') || p.name || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.email || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{p.companyDomain ?? p.company_domain ?? p.domain ?? '—'}</td>
                    <td className="px-4 py-3">
                      {p.status ? (
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          p.status === 'found' || p.status === 'valid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {p.status}
                        </span>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}

// ─── Saved Searches Panel ─────────────────────────────────────────────────────

function SavedSearchesPanel() {
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const d = await slp(EP.savedSearches);
      if (d.error) throw new Error(d.error);
      setSearches(d.data?.savedSearches || d.data?.searches || d.data || d.searches || (Array.isArray(d) ? d : []));
    } catch (e) {
      setErr(e.message || 'Failed to load saved searches.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUpdate = async (id) => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      const d = await slp(`${EP.updateSavedSearch}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name: editName.trim() }),
      });
      if (d.error) throw new Error(d.error);
      setEditId(null);
      load();
    } catch (e) {
      setErr(e.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-bold text-charcoal text-sm flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-copper" />
          Saved Searches
        </h3>
        <button onClick={load} className="p-1.5 rounded text-gray-400 hover:text-copper transition-colors">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
      <ErrBanner msg={err} />
      {loading ? <SpinRow /> : searches.length === 0 ? (
        <Empty icon={Bookmark} title="No saved searches" sub="Save a search from the Search Contacts tab" />
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Name', 'Created', 'Results', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {searches.map((s, i) => (
              <tr key={s.id ?? i} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-charcoal">
                  {editId === s.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-copper"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        autoFocus
                      />
                      <button onClick={() => handleUpdate(s.id)} disabled={saving} className="text-copper text-xs font-semibold">
                        {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save'}
                      </button>
                      <button onClick={() => setEditId(null)} className="text-gray-400 text-xs">Cancel</button>
                    </div>
                  ) : (
                    s.name || s.search_name || `Search #${s.id}`
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {s.created_at ? new Date(s.created_at).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-3 text-gray-600">{s.total_contacts ?? s.results ?? '—'}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => { setEditId(s.id); setEditName(s.name || ''); }}
                    className="text-xs text-gray-400 hover:text-copper transition-colors"
                  >
                    Rename
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ─── Recent Searches Panel ────────────────────────────────────────────────────

function RecentSearchesPanel() {
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const d = await slp(EP.recentSearches);
      if (d.error) throw new Error(d.error);
      setSearches(d.data?.recentSearches || d.data?.searches || (Array.isArray(d.data) ? d.data : []));
    } catch (e) {
      setErr(e.message || 'Failed to load recent searches.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-bold text-charcoal text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-copper" />
          Recent Searches
        </h3>
        <button onClick={load} className="p-1.5 rounded text-gray-400 hover:text-copper transition-colors">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
      <ErrBanner msg={err} />
      {loading ? <SpinRow /> : searches.length === 0 ? (
        <Empty icon={Clock} title="No recent searches" sub="Your search history will appear here" />
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Search', 'Date', 'Results', 'Filters'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {searches.map((s, i) => (
              <tr key={s.id ?? i} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-charcoal">{s.name || s.search_name || `Search #${s.id ?? i + 1}`}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {s.created_at ? new Date(s.created_at).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-3 text-gray-600">{s.total_contacts ?? s.results ?? '—'}</td>
                <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">
                  {s.filters ? JSON.stringify(s.filters) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ─── Fetched Leads Panel ──────────────────────────────────────────────────────

function FetchedLeadsPanel() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const d = await slp(EP.fetchedSearches);
      if (d.error) throw new Error(d.error);
      setLeads(d.data?.fetchedLeads || d.data?.leads || d.data?.contacts || (Array.isArray(d.data) ? d.data : []));
    } catch (e) {
      setErr(e.message || 'Failed to load fetched leads.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUpdate = async (id) => {
    setSaving(true);
    try {
      const d = await slp(`${EP.updateFetchedLead}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(editData),
      });
      if (d.error) throw new Error(d.error);
      setEditId(null);
      load();
    } catch (e) {
      setErr(e.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-bold text-charcoal text-sm flex items-center gap-2">
          <Download className="w-4 h-4 text-copper" />
          Fetched Leads
        </h3>
        <button onClick={load} className="p-1.5 rounded text-gray-400 hover:text-copper transition-colors">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
      <ErrBanner msg={err} />
      {loading ? <SpinRow /> : leads.length === 0 ? (
        <Empty icon={Download} title="No fetched leads" sub="Fetch contacts from the Search Contacts tab" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Name', 'Email', 'Company', 'Job Title', 'Status', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((l, i) => (
                <tr key={l.id ?? i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-charcoal whitespace-nowrap">
                    {editId === l.id ? (
                      <input
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
                        value={editData.name ?? [l.firstName ?? l.first_name, l.lastName ?? l.last_name].filter(Boolean).join(' ')}
                        onChange={(e) => setEditData((p) => ({ ...p, name: e.target.value }))}
                      />
                    ) : (
                      [l.firstName ?? l.first_name, l.lastName ?? l.last_name].filter(Boolean).join(' ') || l.name || '—'
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{l.email || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{l.companyName ?? l.company_name ?? l.company ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{l.jobTitle ?? l.job_title ?? '—'}</td>
                  <td className="px-4 py-3">
                    {l.status ? (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">{l.status}</span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {editId === l.id ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleUpdate(l.id)} disabled={saving} className="text-xs text-copper font-semibold">
                          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save'}
                        </button>
                        <button onClick={() => setEditId(null)} className="text-xs text-gray-400">Cancel</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setEditId(l.id); setEditData({}); }}
                        className="text-xs text-gray-400 hover:text-copper transition-colors"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Analytics Panel ──────────────────────────────────────────────────────────

function AnalyticsPanel() {
  const [searchData, setSearchData] = useState(null);
  const [replyData, setReplyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr('');
      try {
        const [sd, rd] = await Promise.all([
          slp(EP.searchAnalytics),
          slp(EP.replyAnalytics),
        ]);
        setSearchData(sd.data ?? sd);
        setReplyData(rd.data ?? rd);
      } catch (e) {
        setErr(e.message || 'Failed to load analytics.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <SpinRow />;

  return (
    <div className="space-y-5">
      <ErrBanner msg={err} />

      {/* Search Analytics */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h3 className="font-bold text-charcoal text-sm mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-copper" />
          Search Analytics
        </h3>
        {!searchData ? (
          <p className="text-sm text-gray-400">No data available.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Searches',    val: searchData.total_searches ?? searchData.totalSearches },
              { label: 'Total Contacts',    val: searchData.total_contacts ?? searchData.totalContacts },
              { label: 'Fetched Contacts',  val: searchData.fetched_contacts ?? searchData.fetchedContacts },
              { label: 'Credits Used',      val: searchData.credits_used ?? searchData.creditsUsed },
            ].map(({ label, val }) => (
              <div key={label} className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-charcoal">{val?.toLocaleString() ?? '—'}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}
        {searchData && (
          <details className="mt-4">
            <summary className="text-xs text-gray-400 cursor-pointer hover:text-copper">View raw data</summary>
            <pre className="mt-2 text-xs bg-gray-50 rounded p-3 overflow-x-auto text-gray-600">
              {JSON.stringify(searchData, null, 2)}
            </pre>
          </details>
        )}
      </div>

      {/* Reply Analytics */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h3 className="font-bold text-charcoal text-sm mb-4 flex items-center gap-2">
          <Hash className="w-4 h-4 text-copper" />
          Reply Analytics
        </h3>
        {!replyData ? (
          <p className="text-sm text-gray-400">No data available.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Replies',   val: replyData.total_replies ?? replyData.totalReplies },
              { label: 'Positive',        val: replyData.positive_replies ?? replyData.positiveReplies },
              { label: 'Negative',        val: replyData.negative_replies ?? replyData.negativeReplies },
              { label: 'Reply Rate',      val: replyData.reply_rate != null ? `${replyData.reply_rate}%` : null },
            ].map(({ label, val }) => (
              <div key={label} className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-charcoal">{val?.toLocaleString() ?? '—'}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}
        {replyData && (
          <details className="mt-4">
            <summary className="text-xs text-gray-400 cursor-pointer hover:text-copper">View raw data</summary>
            <pre className="mt-2 text-xs bg-gray-50 rounded p-3 overflow-x-auto text-gray-600">
              {JSON.stringify(replyData, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

// ─── Main SmartProspectTab ────────────────────────────────────────────────────

export default function SmartProspectTab() {
  const [subTab, setSubTab] = useState('search');

  return (
    <div className="space-y-4">
      {/* Sub-tab nav */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
        {SP_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSubTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              subTab === id
                ? 'bg-white text-copper shadow-sm'
                : 'text-gray-500 hover:text-charcoal'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Panels */}
      {subTab === 'search'    && <SearchContactsPanel />}
      {subTab === 'find'      && <FindEmailsPanel />}
      {subTab === 'saved'     && <SavedSearchesPanel />}
      {subTab === 'recent'    && <RecentSearchesPanel />}
      {subTab === 'fetched'   && <FetchedLeadsPanel />}
      {subTab === 'analytics' && <AnalyticsPanel />}
    </div>
  );
}
