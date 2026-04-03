import { useState } from 'react';
import { Plus, Eye, Pencil, Trash2, Star, X, Send } from 'lucide-react';
import AdminTopBar from '../components/AdminTopBar';
import { useAdminCrud } from '../hooks/useAdminCrud';
import { reviewsApi } from '../../services/adminApi';

const statusColors: Record<string, string> = {
  pending: 'bg-gold text-warm-canvas',
  published: 'bg-sage text-warm-canvas',
  hidden: 'bg-muted text-warm-charcoal',
  featured: 'bg-terracotta text-warm-canvas',
};

interface ReviewForm {
  guestName: string;
  country: string;
  countryFlag: string;
  rating: number;
  safariName: string;
  safariDate: string;
  fullText: string;
  status: 'pending' | 'published' | 'hidden' | 'featured';
  categoryRatings: { guide: number; wildlife: number; accommodation: number; value: number };
  ownerResponse: string;
}

const emptyForm: ReviewForm = {
  guestName: '', country: '', countryFlag: '🌍', rating: 5, safariName: '', safariDate: '',
  fullText: '', status: 'pending', categoryRatings: { guide: 5, wildlife: 5, accommodation: 5, value: 5 }, ownerResponse: ''
};

export default function AdminReviews() {
  const { items: reviews, isLoading, create, update, remove, refetch } = useAdminCrud('reviews', reviewsApi);
  const [tab, setTab] = useState('All');
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<ReviewForm>({ ...emptyForm });
  const [detailId, setDetailId] = useState<string | null>(null);
  const [ownerResponseDraft, setOwnerResponseDraft] = useState<string>('');

  const tabs = ['All', 'Pending Approval', 'Published', 'Hidden', 'Featured'];

  const filtered = reviews.filter(r => {
    if (tab === 'Pending Approval') return r.status === 'pending';
    if (tab === 'Published') return r.status === 'published';
    if (tab === 'Hidden') return r.status === 'hidden';
    if (tab === 'Featured') return r.status === 'featured';
    return true;
  });

  const avgRating = reviews.length > 0 ? (reviews.reduce((a: number, r: any) => a + (r.rating || 0), 0) / reviews.length).toFixed(1) : '0';

  const updateForm = (key: keyof ReviewForm, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const normalizeStatus = (value: any): ReviewForm['status'] => {
    const v = String(value ?? '').trim().toLowerCase();
    if (v === 'pending' || v === 'published' || v === 'hidden' || v === 'featured') return v;
    return 'pending';
  };

  const openEditor = (review?: any) => {
    if (review) {
      setForm({
        guestName: review.guestName ?? '',
        country: review.country ?? '',
        countryFlag: review.countryFlag ?? '🌍',
        rating: Number(review.rating ?? 5),
        safariName: review.safariName ?? '',
        safariDate: review.safariDate ?? '',
        fullText: review.fullText ?? '',
        status: normalizeStatus(review.status),
        categoryRatings: {
          guide: Number(review.categoryRatings?.guide ?? 5),
          wildlife: Number(review.categoryRatings?.wildlife ?? 5),
          accommodation: Number(review.categoryRatings?.accommodation ?? 5),
          value: Number(review.categoryRatings?.value ?? 5),
        },
        ownerResponse: '',
      });
      setEditing(review.id);
    } else {
      setForm({ ...emptyForm });
      setCreating(true);
    }
  };

  const closeEditor = () => { setEditing(null); setCreating(false); };

  const handleSave = async () => {
    const safeStatus = normalizeStatus(form.status);
    if (editing) {
      await update(editing, { ...form, status: safeStatus, excerpt: form.fullText.slice(0, 100) });
    } else {
      await create({ ...form, status: safeStatus, excerpt: form.fullText.slice(0, 100), submittedDate: new Date().toISOString().split('T')[0] });
    }
    closeEditor();
  };

  const updateStatus = async (id: string, status: string) => {
    // Use the dedicated endpoint to avoid full-update validation edge-cases.
    const normalized = String(status || '').trim().toLowerCase();
    await reviewsApi.updateStatus(id, normalized);
    await refetch();
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    await remove(id);
  };

  const detailReview = detailId ? reviews.find(r => r.id === detailId) : null;
  const openDetail = (id: string) => {
    setOwnerResponseDraft('');
    setDetailId(id);
  };

  return (
    <div>
      <AdminTopBar title="Reviews" />
      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-[#FFFFFF] border border-[#E8E0D5] p-6 text-center">
            <p className="font-display italic text-[48px] text-gold">{avgRating}</p>
            <div className="flex justify-center gap-0.5 mt-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className={i < Math.round(+avgRating) ? 'text-terracotta fill-terracotta' : 'text-faded-sand'} />)}</div>
            <p className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.1em] mt-2">Average Rating</p>
          </div>
          <div className="bg-[#FFFFFF] border border-[#E8E0D5] p-6 text-center">
            <p className="font-display italic text-[48px] text-warm-charcoal">{reviews.length}</p>
            <p className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.1em] mt-2">Total Reviews</p>
          </div>
          <div className="bg-[#FFFFFF] border border-[#E8E0D5] p-6 text-center">
            <p className="font-display italic text-[48px] text-sage">{reviews.filter(r => r.status === 'pending').length}</p>
            <p className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.1em] mt-2">Pending Approval</p>
          </div>
          <div className="bg-[#FFFFFF] border border-[#E8E0D5] p-6 text-center">
            <p className="font-display italic text-[48px] text-terracotta">{reviews.filter(r => r.status === 'featured').length}</p>
            <p className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.1em] mt-2">Featured</p>
          </div>
        </div>

        {/* Tabs + Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-0 border-b border-[#E8E0D5]">
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 font-sub font-normal text-[12px] border-b-2 transition-colors ${tab === t ? 'border-terracotta text-terracotta' : 'border-transparent text-warm-charcoal hover:text-warm-charcoal'}`}>{t}</button>
            ))}
          </div>
          <button onClick={() => openEditor()} className="flex items-center gap-2 px-4 py-2 bg-terracotta text-warm-canvas font-sub font-normal text-[12px] uppercase tracking-[0.1em] hover:opacity-90">
            <Plus size={14} /> Add Review
          </button>
        </div>

        {/* Table */}
        <div className="bg-[#FFFFFF] border border-[#E8E0D5]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E0D5]">
                {['Guest', 'Rating', 'Safari', 'Safari Date', 'Submitted', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.1em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-[#E8E0D5]/50 hover:bg-[#FBF8F3] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span>{r.countryFlag}</span>
                      <span className="font-sub font-normal text-[13px] text-warm-charcoal">{r.guestName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} className={i < r.rating ? 'text-terracotta fill-terracotta' : 'text-faded-sand'} />)}</div>
                  </td>
                  <td className="px-4 py-3 font-sub font-normal text-[13px] text-warm-charcoal">{r.safariName}</td>
                  <td className="px-4 py-3 font-sub font-normal text-[13px] text-warm-charcoal">{new Date(r.safariDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</td>
                  <td className="px-4 py-3 font-sub font-normal text-[13px] text-warm-charcoal">{new Date(r.submittedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</td>
                  <td className="px-4 py-3">
                    <select value={r.status} onChange={e => updateStatus(r.id, e.target.value)} className={`px-2 py-0.5 font-sub font-normal text-[10px] uppercase tracking-[0.1em] border-none outline-none cursor-pointer ${statusColors[r.status]}`}>
                      <option value="pending">Pending</option>
                      <option value="published">Published</option>
                      <option value="featured">Featured</option>
                      <option value="hidden">Hidden</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openDetail(r.id)} className="p-1.5 text-warm-charcoal hover:text-warm-charcoal transition-colors"><Eye size={14} /></button>
                      <button onClick={() => openEditor(r)} className="p-1.5 text-warm-charcoal hover:text-warm-charcoal transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => deleteReview(r.id)} className="p-1.5 text-warm-charcoal hover:text-terracotta transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail Drawer */}
        {detailReview && (
          <div className="fixed inset-0 bg-warm-charcoal/50 z-50 flex justify-end">
            <div className="w-[500px] bg-[#FFFFFF] h-full overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E0D5]">
                <h3 className="font-display italic text-[20px] text-warm-charcoal">Review Detail</h3>
                <button onClick={() => setDetailId(null)} className="text-warm-charcoal hover:text-warm-charcoal"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-terracotta/10 flex items-center justify-center font-display italic text-[20px] text-terracotta">{detailReview.guestName.charAt(0)}</div>
                  <div>
                    <p className="font-sub font-normal text-[15px] text-warm-charcoal">{detailReview.countryFlag} {detailReview.guestName}</p>
                    <p className="font-sub font-normal text-[12px] text-warm-charcoal">{detailReview.country}</p>
                  </div>
                </div>

                <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} className={i < detailReview.rating ? 'text-terracotta fill-terracotta' : 'text-faded-sand'} />)}</div>

                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(detailReview.categoryRatings).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between py-1.5 border-b border-[#E8E0D5]/50">
                      <span className="font-sub font-normal text-[12px] text-warm-charcoal capitalize">{key}</span>
                      <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={10} className={i < (val as number) ? 'text-gold fill-gold' : 'text-faded-sand'} />)}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1">Safari</p>
                  <p className="font-sub font-normal text-[14px] text-terracotta">{detailReview.safariName}</p>
                  <p className="font-sub font-normal text-[12px] text-warm-charcoal">{new Date(detailReview.safariDate).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
                </div>

                <div>
                  <p className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1">Full Review</p>
                  <p className="font-sub font-normal text-[14px] text-warm-charcoal leading-relaxed">{detailReview.fullText}</p>
                </div>

                <div className="border-t border-[#E8E0D5] pt-4">
                  <p className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-2">Owner Response</p>
                  <textarea
                    rows={4}
                    value={ownerResponseDraft}
                    onChange={(e) => setOwnerResponseDraft(e.target.value)}
                    className="w-full px-3 py-2 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta resize-none"
                    placeholder="Write a public response to this review..."
                  />
                  <button
                    onClick={async () => {
                      const msg = ownerResponseDraft.trim();
                      if (!msg) return alert('Response cannot be empty');
                      await reviewsApi.saveResponse(detailReview.id, msg);
                      setOwnerResponseDraft('');
                      await refetch();
                    }}
                    className="mt-2 flex items-center gap-2 px-4 py-2 bg-terracotta text-warm-canvas font-sub font-normal text-[12px] uppercase tracking-[0.1em] hover:opacity-90"
                  >
                    <Send size={12} /> Save Response
                  </button>
                </div>

                <div className="border-t border-[#E8E0D5] pt-4 flex gap-2">
                  <button onClick={() => { updateStatus(detailReview.id, 'published'); setDetailId(null); }} className="flex-1 py-2 bg-sage text-warm-canvas font-sub font-normal text-[11px] uppercase tracking-[0.1em]">Approve</button>
                  <button onClick={() => { updateStatus(detailReview.id, 'featured'); setDetailId(null); }} className="flex-1 py-2 bg-terracotta text-warm-canvas font-sub font-normal text-[11px] uppercase tracking-[0.1em]">Feature</button>
                  <button onClick={() => { updateStatus(detailReview.id, 'hidden'); setDetailId(null); }} className="flex-1 py-2 border border-[#E8E0D5] text-warm-charcoal font-sub font-normal text-[11px] uppercase tracking-[0.1em]">Hide</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {(editing || creating) && (
          <div className="fixed inset-0 bg-warm-charcoal/60 z-50 flex items-center justify-center p-4">
            <div className="bg-[#FFFFFF] w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E0D5]">
                <h3 className="font-display italic text-[20px] text-warm-charcoal">{creating ? 'Add Review' : 'Edit Review'}</h3>
                <button onClick={closeEditor} className="text-warm-charcoal hover:text-warm-charcoal"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Guest Name *</label>
                    <input value={form.guestName} onChange={e => updateForm('guestName', e.target.value)} className="w-full h-[40px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" />
                  </div>
                  <div>
                    <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Country</label>
                    <input value={form.country} onChange={e => updateForm('country', e.target.value)} className="w-full h-[40px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Safari Name *</label>
                    <input value={form.safariName} onChange={e => updateForm('safariName', e.target.value)} className="w-full h-[40px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" />
                  </div>
                  <div>
                    <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Safari Date</label>
                    <input type="date" value={form.safariDate} onChange={e => updateForm('safariDate', e.target.value)} className="w-full h-[40px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" />
                  </div>
                </div>
                <div>
                  <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-2 block">Overall Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} onClick={() => updateForm('rating', n)}>
                        <Star size={24} className={n <= form.rating ? 'text-terracotta fill-terracotta' : 'text-faded-sand'} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {(['guide', 'wildlife', 'accommodation', 'value'] as const).map(key => (
                    <div key={key}>
                      <label className="font-sub text-[9px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block capitalize">{key}</label>
                      <select value={form.categoryRatings[key]} onChange={e => updateForm('categoryRatings', { ...form.categoryRatings, [key]: +e.target.value })} className="w-full h-[36px] px-2 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta">
                        {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n}★</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Full Review Text *</label>
                  <textarea value={form.fullText} onChange={e => updateForm('fullText', e.target.value)} rows={6} className="w-full px-3 py-2 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta resize-none" />
                </div>
                <div>
                  <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Status</label>
                  <select value={form.status} onChange={e => updateForm('status', e.target.value)} className="w-full h-[40px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta">
                    <option value="pending">Pending</option>
                    <option value="published">Published</option>
                    <option value="featured">Featured</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E8E0D5]">
                <button onClick={closeEditor} className="px-5 py-2.5 border border-[#E8E0D5] text-warm-charcoal font-sub font-normal text-[12px] uppercase tracking-[0.1em]">Cancel</button>
                <button onClick={handleSave} className="px-5 py-2.5 bg-terracotta text-warm-canvas font-sub font-normal text-[12px] uppercase tracking-[0.1em] hover:opacity-90">Save Review</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
