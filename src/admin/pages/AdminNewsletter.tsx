import { useState } from 'react';
import { Plus, Search, Download, Mail, Pencil, Trash2, X } from 'lucide-react';
import AdminTopBar from '../components/AdminTopBar';
import { useAdminCrud } from '../hooks/useAdminCrud';
import { subscribersApi } from '../../services/adminApi';

export default function AdminNewsletter() {
  const [tab, setTab] = useState<'subscribers' | 'campaigns' | 'automations'>('subscribers');
  const [search, setSearch] = useState('');
  const { items: allSubscribers, isLoading, create, update, remove, refetch } = useAdminCrud('subscribers', subscribersApi);
  const subscribers = Array.isArray(allSubscribers) ? allSubscribers : ((allSubscribers as any)?.data ?? []);

  const filtered = subscribers.filter((s: any) => !search || (s.email || '').toLowerCase().includes(search.toLowerCase()) || (s.name || '').toLowerCase().includes(search.toLowerCase()));

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [form, setForm] = useState<any>({
    email: '',
    name: '',
    country: '',
    source: 'admin',
    status: 'active',
  });

  const openCreate = () => {
    setEditingId(null);
    setForm({ email: '', name: '', country: '', source: 'admin', status: 'active' });
    setShowForm(true);
  };

  const openEdit = (s: any) => {
    setEditingId(s.id);
    setForm({
      email: s.email ?? '',
      name: s.name ?? '',
      country: s.country ?? '',
      source: s.source ?? 'admin',
      status: s.status ?? 'active',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Delete this subscriber?')) return;
    await remove(id);
    await refetch();
  };

  return (
    <div>
      <AdminTopBar title="Newsletter" />
      <div className="p-8">
        {/* Tabs */}
        <div className="flex gap-0 border-b border-[#E8E0D5] mb-6">
          {(['subscribers', 'campaigns', 'automations'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-6 py-3 font-sub font-normal text-[13px] capitalize border-b-2 transition-colors ${tab === t ? 'border-terracotta text-terracotta' : 'border-transparent text-warm-charcoal hover:text-warm-charcoal'}`}>{t}</button>
          ))}
        </div>

        {tab === 'subscribers' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[{ label: 'Total Subscribers', value: '1,247' }, { label: 'New This Month', value: '48', color: 'text-sage' }, { label: 'Unsubscribed', value: '3', color: 'text-terracotta' }, { label: 'Avg Open Rate', value: '34.2%' }].map((s, i) => (
                <div key={i} className="bg-[#FFFFFF] border border-[#E8E0D5] p-6">
                  <p className={`font-display italic text-[36px] ${s.color || 'text-warm-charcoal'}`}>{s.value}</p>
                  <p className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.1em] mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Filter + Actions */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1 max-w-[300px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-charcoal" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by email or name..." className="w-full h-9 pl-9 pr-4 font-sub font-normal text-[13px] text-warm-charcoal bg-transparent border border-[#E8E0D5] outline-none focus:border-terracotta placeholder:text-[#B5A998]" />
              </div>
              <button className="flex items-center gap-2 h-9 px-4 border border-warm-charcoal text-warm-charcoal font-sub font-normal text-[12px] uppercase tracking-[0.1em] hover:bg-warm-charcoal hover:text-warm-canvas transition-colors"><Download size={12} /> Export</button>
              <button onClick={openCreate} className="flex items-center gap-2 h-9 px-4 bg-terracotta text-warm-canvas font-sub font-normal text-[12px] uppercase tracking-[0.1em] hover:opacity-90"><Plus size={12} /> Add Subscriber</button>
            </div>

            {/* Table */}
            <div className="bg-[#FFFFFF] border border-[#E8E0D5]">
              <table className="w-full">
                <thead><tr className="border-b border-[#E8E0D5]">
                  {['Email', 'Name', 'Country', 'Source', 'Subscribed', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.1em]">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.id} className="border-b border-[#E8E0D5]/50 hover:bg-[#FBF8F3] transition-colors">
                      <td className="px-4 py-3 font-sub font-normal text-[13px] text-warm-charcoal">{s.email}</td>
                      <td className="px-4 py-3 font-sub font-normal text-[13px] text-warm-charcoal">{s.name}</td>
                      <td className="px-4 py-3 font-sub font-normal text-[13px] text-warm-charcoal">{s.country}</td>
                      <td className="px-4 py-3 font-sub font-normal text-[12px] text-warm-charcoal">{s.source}</td>
                      <td className="px-4 py-3 font-sub font-normal text-[12px] text-warm-charcoal">{new Date(s.dateSubscribed).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 font-sub font-normal text-[10px] uppercase tracking-[0.1em] ${s.status === 'active' ? 'bg-sage text-warm-canvas' : 'bg-muted text-warm-charcoal'}`}>{s.status}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(s)} className="p-1.5 text-warm-charcoal hover:text-warm-charcoal transition-colors" aria-label="Edit subscriber">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleDelete(s.id)} className="p-1.5 text-red-500 hover:text-red-500 transition-colors" aria-label="Delete subscriber">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'campaigns' && (
          <div className="bg-[#FFFFFF] border border-[#E8E0D5] p-12 text-center">
            <Mail size={32} className="text-warm-charcoal mx-auto mb-4" />
            <h3 className="font-display italic text-[24px] text-warm-charcoal mb-2">Email Campaigns</h3>
            <p className="font-sub font-normal text-[14px] text-warm-charcoal mb-6">Create and send branded email campaigns to your subscribers.</p>
            <button className="px-6 py-2.5 bg-terracotta text-warm-canvas font-sub font-normal text-[13px] uppercase tracking-[0.1em] hover:opacity-90">+ New Campaign</button>
          </div>
        )}

        {tab === 'automations' && (
          <div className="space-y-4">
            {[
              { name: 'New Subscriber Welcome', trigger: 'New subscriber', active: true, emails: 3 },
              { name: 'Post-Enquiry Nurture', trigger: 'Enquiry not converted (3 days)', active: true, emails: 3 },
              { name: 'Booking Confirmation Sequence', trigger: 'Booking confirmed', active: true, emails: 4 },
              { name: 'Balance Due Reminder', trigger: '14 days before balance due', active: true, emails: 1 },
              { name: 'Departure Countdown', trigger: '7 days before departure', active: false, emails: 1 },
            ].map((auto, i) => (
              <div key={i} className="bg-[#FFFFFF] border border-[#E8E0D5] p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-sub font-normal text-[15px] text-warm-charcoal">{auto.name}</h3>
                  <p className="font-sub font-normal text-[12px] text-warm-charcoal mt-0.5">Trigger: {auto.trigger} · {auto.emails} emails</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-5 ${auto.active ? 'bg-sage' : 'bg-faded-sand'} cursor-pointer relative transition-colors`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-[#FFFFFF] transition-all ${auto.active ? 'left-[22px]' : 'left-0.5'}`} />
                  </div>
                  <button className="px-3 py-1.5 border border-[#E8E0D5] font-sub font-normal text-[11px] text-warm-charcoal hover:border-warm-charcoal transition-colors">Edit</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Subscriber Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] w-full max-w-[520px] p-6 border border-[#E8E0D5]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display italic text-[20px] text-warm-charcoal">
                {editingId ? 'Edit Subscriber' : 'New Subscriber'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-warm-charcoal hover:text-warm-charcoal" aria-label="Close">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Email *</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>
              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Country</label>
                  <input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
                </div>
                <div className="space-y-1">
                  <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta">
                    <option value="active">Active</option>
                    <option value="unsubscribed">Unsubscribed</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Source</label>
                <input value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-[#E8E0D5] text-warm-charcoal hover:text-warm-charcoal">
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!form.email?.trim()) return alert('Email is required');
                    if (editingId) await update(editingId, form);
                    else await create(form);
                    setShowForm(false);
                    await refetch();
                  }}
                  className="px-5 py-2 bg-terracotta text-warm-canvas font-sub font-normal text-[13px] uppercase tracking-[0.1em] hover:opacity-90"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
