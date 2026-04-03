import { useMemo, useState } from 'react';
import { Search, Download, Plus, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import AdminTopBar from '../components/AdminTopBar';
import { useAdminCrud } from '../hooks/useAdminCrud';
import { bookingsApi } from '../../services/adminApi';

const statusColors: Record<string, string> = {
  confirmed: 'bg-sage text-warm-canvas',
  pending: 'bg-gold text-warm-canvas',
  cancelled: 'bg-terracotta text-warm-canvas',
  completed: 'bg-warm-charcoal text-warm-canvas',
  'deposit-paid': 'bg-warm-charcoal text-warm-canvas',
  'fully-paid': 'bg-sage text-warm-canvas',
};

const statusLabels: Record<string, string> = {
  confirmed: 'Confirmed',
  pending: 'Pending',
  cancelled: 'Cancelled',
  completed: 'Completed',
  'deposit-paid': 'Deposit Paid',
  'fully-paid': 'Fully Paid',
};

export default function AdminBookings() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { items: allBookings, isLoading, create, update, remove, refetch } = useAdminCrud('bookings', bookingsApi);
  // Handle paginated response from API
  const bookings = Array.isArray(allBookings) ? allBookings : ((allBookings as any)?.data ?? []);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [form, setForm] = useState<any>({
    ref: '',
    guestName: '',
    email: '',
    whatsapp: '',
    country: '',
    safariName: '',
    departureDate: '',
    returnDate: '',
    pax: 1,
    children: 0,
    totalAmount: 0,
    depositPaid: 0,
    balanceDue: 0,
    status: 'pending',
    paymentStatus: 'pending',
    groupType: 'private',
    guide: '',
    notes: '',
    accommodationTier: '',
  });

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ref: '',
      guestName: '',
      email: '',
      whatsapp: '',
      country: '',
      safariName: '',
      departureDate: '',
      returnDate: '',
      pax: 1,
      children: 0,
      totalAmount: 0,
      depositPaid: 0,
      balanceDue: 0,
      status: 'pending',
      paymentStatus: 'pending',
      groupType: 'private',
      guide: '',
      notes: '',
      accommodationTier: '',
    });
    setShowForm(true);
  };

  const openEdit = (b: any) => {
    setEditingId(b.id);
    setForm({
      ref: b.ref ?? '',
      guestName: b.guestName ?? '',
      email: b.email ?? '',
      whatsapp: b.whatsapp ?? '',
      country: b.country ?? '',
      safariName: b.safariName ?? '',
      departureDate: b.departureDate ?? '',
      returnDate: b.returnDate ?? '',
      pax: Number(b.pax ?? 1),
      children: Number(b.children ?? 0),
      totalAmount: Number(b.totalAmount ?? 0),
      depositPaid: Number(b.depositPaid ?? 0),
      balanceDue: Number(b.balanceDue ?? 0),
      status: b.status ?? 'pending',
      paymentStatus: b.paymentStatus ?? 'pending',
      groupType: b.groupType ?? 'private',
      guide: b.guide ?? '',
      notes: Array.isArray(b.notes) ? b.notes.join('\n') : (b.notes ?? ''),
      accommodationTier: b.accommodationTier ?? '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Delete this booking?')) return;
    await remove(id);
    await refetch();
  };

  const filtered = bookings.filter((b: any) => {
    const matchSearch = !search || (b.guestName || '').toLowerCase().includes(search.toLowerCase()) || (b.ref || '').toLowerCase().includes(search.toLowerCase()) || (b.email || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const payload = useMemo(() => {
    const notesArr = (form.notes ?? '')
      .split('\n')
      .map((s: string) => s.trim())
      .filter(Boolean);

    const base: any = {
      guestName: form.guestName,
      email: form.email,
      whatsapp: form.whatsapp || null,
      country: form.country || null,
      safariName: form.safariName || null,
      pax: Number(form.pax ?? 1),
      children: Number(form.children ?? 0),
      totalAmount: Number(form.totalAmount ?? 0),
      depositPaid: Number(form.depositPaid ?? 0),
      balanceDue: Number(form.balanceDue ?? 0),
      status: form.status,
      paymentStatus: form.paymentStatus,
      groupType: form.groupType,
      guide: form.guide || null,
      notes: notesArr,
      accommodationTier: form.accommodationTier || null,
    };

    // Date keys differ slightly between create vs update validation.
    const datePayload: any = {};
    if (form.departureDate) datePayload.departureDate = form.departureDate;
    else if (!editingId) datePayload.departureDate = null;

    if (form.returnDate) datePayload.returnDate = form.returnDate;
    else if (!editingId) datePayload.returnDate = null;

    if (!editingId) {
      base.ref = form.ref;
    }

    return { ...base, ...datePayload };
  }, [editingId, form]);

  return (
    <div>
      <AdminTopBar title="All Bookings" />
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div />
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2.5 bg-terracotta text-warm-canvas font-sub font-normal text-[13px] uppercase tracking-[0.1em] hover:opacity-90 transition-opacity"
            >
              <Plus size={14} /> New Booking
            </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-[#FFFFFF] border border-[#E8E0D5] p-4 mb-4 flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-[300px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-charcoal" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search guest, email, ref..." className="w-full h-9 pl-9 pr-4 font-sub font-normal text-[13px] text-warm-charcoal bg-transparent border border-[#E8E0D5] outline-none focus:border-terracotta transition-colors placeholder:text-[#B5A998]" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] bg-transparent outline-none focus:border-terracotta">
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="fully-paid">Fully Paid</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select className="h-9 px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] bg-transparent outline-none focus:border-terracotta">
            <option>All Safaris</option>
            <option>Great Migration Safari</option>
            <option>Northern Circuit Classic</option>
            <option>Kilimanjaro Lemosho</option>
          </select>
          <select className="h-9 px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] bg-transparent outline-none focus:border-terracotta">
            <option>All Types</option>
            <option>Private</option>
            <option>Group</option>
          </select>
          <button className="flex items-center gap-2 h-9 px-4 border border-warm-charcoal text-warm-charcoal font-sub font-normal text-[12px] uppercase tracking-[0.1em] hover:bg-warm-charcoal hover:text-warm-canvas transition-colors">
            <Download size={12} /> Export CSV
          </button>
          <span className="font-sub font-normal text-[12px] text-warm-charcoal ml-auto">Showing {filtered.length} bookings</span>
        </div>

        {/* Table */}
        <div className="bg-[#FFFFFF] border border-[#E8E0D5]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E0D5]">
                {['Booking Ref', 'Guest Name', 'Safari', 'Departure', 'Pax', 'Total', 'Deposit', 'Balance', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.1em] cursor-pointer hover:text-warm-charcoal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} className="border-b border-[#E8E0D5]/50 hover:bg-[#FBF8F3] transition-colors">
                  <td className="px-4 py-3 font-mono text-[13px] text-terracotta cursor-pointer hover:underline">{b.ref}</td>
                  <td className="px-4 py-3 font-sub font-normal text-[13px] text-warm-charcoal">{b.guestName}</td>
                  <td className="px-4 py-3 font-sub font-normal text-[13px] text-warm-charcoal">{b.safariName}</td>
                  <td className="px-4 py-3 font-sub font-normal text-[13px] text-warm-charcoal">{new Date(b.departureDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}</td>
                  <td className="px-4 py-3 font-sub font-normal text-[13px] text-warm-charcoal">{b.pax + b.children}</td>
                  <td className="px-4 py-3 font-sub font-normal text-[13px] text-warm-charcoal">${b.totalAmount.toLocaleString()}</td>
                  <td className="px-4 py-3 font-sub font-normal text-[13px] text-sage">${b.depositPaid.toLocaleString()}</td>
                  <td className="px-4 py-3 font-sub font-normal text-[13px] text-warm-charcoal">${b.balanceDue.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 font-sub font-normal text-[10px] uppercase tracking-[0.1em] ${statusColors[b.status]}`}>{statusLabels[b.status]}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-warm-charcoal hover:text-warm-charcoal transition-colors" onClick={() => openEdit(b)} aria-label="View/Edit booking">
                        <Eye size={14} />
                      </button>
                      <button className="p-1.5 text-warm-charcoal hover:text-warm-charcoal transition-colors" onClick={() => openEdit(b)} aria-label="Edit booking">
                        <Pencil size={14} />
                      </button>
                      <button className="p-1.5 text-warm-charcoal hover:text-terracotta transition-colors" onClick={() => handleDelete(b.id)} aria-label="Delete booking">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#E8E0D5]">
            <span className="font-sub font-normal text-[12px] text-warm-charcoal">Page 1 of 1</span>
            <div className="flex items-center gap-2">
              <button className="p-1.5 border border-[#E8E0D5] text-warm-charcoal hover:text-warm-charcoal transition-colors"><ChevronLeft size={14} /></button>
              <button className="px-2.5 py-1 bg-warm-charcoal text-warm-canvas font-sub text-[12px]">1</button>
              <button className="p-1.5 border border-[#E8E0D5] text-warm-charcoal hover:text-warm-charcoal transition-colors"><ChevronRight size={14} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] w-full max-w-[720px] p-6 border border-[#E8E0D5] overflow-y-auto max-h-[85vh]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display italic text-[20px] text-warm-charcoal">
                {editingId ? 'Edit Booking' : 'New Booking'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-warm-charcoal hover:text-warm-charcoal" aria-label="Close">
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {!editingId && (
                <div className="space-y-1">
                  <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Booking Ref *</label>
                  <input value={form.ref} onChange={e => setForm({ ...form, ref: e.target.value })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
                </div>
              )}

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Guest Name *</label>
                <input value={form.guestName} onChange={e => setForm({ ...form, guestName: e.target.value })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Email *</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Safari *</label>
                <input value={form.safariName} onChange={e => setForm({ ...form, safariName: e.target.value })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Departure Date</label>
                <input type="date" value={form.departureDate} onChange={e => setForm({ ...form, departureDate: e.target.value })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Return Date</label>
                <input type="date" value={form.returnDate} onChange={e => setForm({ ...form, returnDate: e.target.value })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Pax *</label>
                <input type="number" min={1} value={form.pax} onChange={e => setForm({ ...form, pax: Number(e.target.value) })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Children</label>
                <input type="number" min={0} value={form.children} onChange={e => setForm({ ...form, children: Number(e.target.value) })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Total Amount *</label>
                <input type="number" min={0} value={form.totalAmount} onChange={e => setForm({ ...form, totalAmount: Number(e.target.value) })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Deposit Paid *</label>
                <input type="number" min={0} value={form.depositPaid} onChange={e => setForm({ ...form, depositPaid: Number(e.target.value) })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Balance Due *</label>
                <input type="number" min={0} value={form.balanceDue} onChange={e => setForm({ ...form, balanceDue: Number(e.target.value) })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Group Type *</label>
                <select value={form.groupType} onChange={e => setForm({ ...form, groupType: e.target.value })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta">
                  <option value="private">Private</option>
                  <option value="group">Group</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Status *</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta">
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="deposit-paid">Deposit Paid</option>
                  <option value="fully-paid">Fully Paid</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Payment Status *</label>
                <select value={form.paymentStatus} onChange={e => setForm({ ...form, paymentStatus: e.target.value })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta">
                  <option value="pending">Pending</option>
                  <option value="deposit-paid">Deposit Paid</option>
                  <option value="fully-paid">Fully Paid</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">WhatsApp</label>
                <input value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Country</label>
                <input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Guide</label>
                <input value={form.guide} onChange={e => setForm({ ...form, guide: e.target.value })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Accommodation Tier</label>
                <input value={form.accommodationTier} onChange={e => setForm({ ...form, accommodationTier: e.target.value })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1 col-span-2">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  rows={4}
                  className="w-full border border-[#E8E0D5] outline-none focus:border-terracotta px-3 py-2 resize-none"
                  placeholder="One note per line"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-[#E8E0D5] text-warm-charcoal hover:text-warm-charcoal">
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (editingId) await update(editingId, payload);
                  else await create(payload);
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
      )}
    </div>
  );
}
