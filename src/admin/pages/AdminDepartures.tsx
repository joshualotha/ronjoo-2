import { useMemo, useState } from 'react';
import { Plus, Users, Trash2, Pencil, X } from 'lucide-react';
import AdminTopBar from '../components/AdminTopBar';
import { useAdminCrud } from '../hooks/useAdminCrud';
import { departuresApi } from '../../services/adminApi';

const statusColors: Record<string, string> = {
  open: 'bg-sage text-warm-canvas',
  full: 'bg-terracotta text-warm-canvas',
  closed: 'bg-muted text-warm-charcoal',
  cancelled: 'bg-terracotta/50 text-warm-charcoal',
  completed: 'bg-warm-charcoal text-warm-canvas',
};

export default function AdminDepartures() {
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const { items: departures, isLoading, create, update, remove, refetch } = useAdminCrud('departures', departuresApi);

  const filtered = departures.filter((d: any) => {
    if (filter === 'upcoming') return d.status !== 'completed';
    if (filter === 'past') return d.status === 'completed';
    return true;
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [form, setForm] = useState<any>({
    safariName: '',
    startDate: '',
    endDate: '',
    totalSeats: 1,
    bookedSeats: 0,
    status: 'open',
    revenue: 0,
    projectedRevenue: 0,
    guide: '',
    guestsJson: '[]',
    waitlistJson: '[]',
  });

  const openCreate = () => {
    setEditingId(null);
    setForm({
      safariName: '',
      startDate: '',
      endDate: '',
      totalSeats: 1,
      bookedSeats: 0,
      status: 'open',
      revenue: 0,
      projectedRevenue: 0,
      guide: '',
      guestsJson: '[]',
      waitlistJson: '[]',
    });
    setShowForm(true);
  };

  const openEdit = (dep: any) => {
    setEditingId(dep.id);
    setForm({
      safariName: dep.safariName ?? '',
      startDate: dep.startDate ?? '',
      endDate: dep.endDate ?? '',
      totalSeats: Number(dep.totalSeats ?? 1),
      bookedSeats: Number(dep.bookedSeats ?? 0),
      status: dep.status ?? 'open',
      revenue: Number(dep.revenue ?? 0),
      projectedRevenue: Number(dep.projectedRevenue ?? 0),
      guide: dep.guide ?? '',
      guestsJson: JSON.stringify(dep.guests ?? [], null, 2),
      waitlistJson: JSON.stringify(dep.waitlist ?? [], null, 2),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Delete this departure?')) return;
    await remove(id);
    await refetch();
  };

  const buildPayload = useMemo(() => {
    const guestsParsed = (() => {
      try {
        if (!form.guestsJson?.trim()) return [];
        const parsed = JSON.parse(form.guestsJson);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return null;
      }
    })();
    const waitlistParsed = (() => {
      try {
        if (!form.waitlistJson?.trim()) return [];
        const parsed = JSON.parse(form.waitlistJson);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return null;
      }
    })();

    return {
      guestsParsed,
      waitlistParsed,
      payload: {
        safariName: form.safariName || null,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        totalSeats: Number(form.totalSeats ?? 1),
        bookedSeats: Number(form.bookedSeats ?? 0),
        status: form.status,
        revenue: Number(form.revenue ?? 0),
        projectedRevenue: Number(form.projectedRevenue ?? 0),
        guide: form.guide || null,
        guests: guestsParsed ?? [],
        waitlist: waitlistParsed ?? [],
      },
    };
  }, [form]);

  return (
    <div>
      <AdminTopBar title="Group Departures" />
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {(['upcoming', 'past', 'all'] as const).map(t => (
              <button key={t} onClick={() => setFilter(t)} className={`px-4 py-2 font-sub font-normal text-[12px] uppercase tracking-[0.1em] border transition-colors ${filter === t ? 'bg-warm-charcoal text-warm-canvas border-warm-charcoal' : 'border-[#E8E0D5] text-warm-charcoal hover:border-terracotta'}`}>{t}</button>
            ))}
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-terracotta text-warm-canvas font-sub font-normal text-[13px] uppercase tracking-[0.1em] hover:opacity-90 transition-opacity"
          >
            <Plus size={14} /> New Departure
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(dep => {
            const totalSeats = Number(dep.totalSeats ?? 0);
            const bookedSeats = Number(dep.bookedSeats ?? 0);
            const revenue = Number(dep.revenue ?? 0);
            const projectedRevenue = Number(dep.projectedRevenue ?? 0);
            const sliderWidth = projectedRevenue > 0 ? (revenue / projectedRevenue) * 100 : 0;

            return (
            <div key={dep.id} className="bg-[#FFFFFF] border border-[#E8E0D5] overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-sub font-normal text-[16px] text-warm-charcoal">{dep.safariName}</h3>
                  <span className={`px-2 py-0.5 font-sub font-normal text-[10px] uppercase tracking-[0.1em] ${statusColors[dep.status]}`}>{dep.status}</span>
                </div>
                <p className="font-display italic text-[22px] text-warm-charcoal mb-1">
                  {new Date(dep.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}, {new Date(dep.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>

                {/* Seat visualization */}
                <div className="flex gap-2 mt-4 mb-2">
                  {Array.from({ length: totalSeats }).map((_, i) => (
                    <div key={i} className={`w-7 h-7 flex items-center justify-center ${i < bookedSeats ? 'bg-terracotta' : 'border border-faded-sand'}`}>
                      {i < bookedSeats && <Users size={12} className="text-warm-canvas" />}
                    </div>
                  ))}
                </div>
                <p className="font-sub font-normal text-[12px] text-warm-charcoal">{bookedSeats} of {totalSeats} seats booked</p>

                {/* Revenue */}
                <div className="mt-4">
                  <div className="flex justify-between font-sub font-normal text-[12px] text-warm-charcoal mb-1">
                    <span>${revenue.toLocaleString()} collected</span>
                    <span>${projectedRevenue.toLocaleString()} total</span>
                  </div>
                  <div className="h-1.5 bg-faded-sand">
                    <div className="h-full bg-sage transition-all" style={{ width: `${sliderWidth}%` }} />
                  </div>
                </div>

                {/* Guide */}
                {dep.guide && (
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-6 h-6 bg-gold/20 flex items-center justify-center font-sub text-[10px] text-gold">{dep.guide.charAt(0)}</div>
                    <span className="font-sub font-normal text-[12px] text-warm-charcoal">Guide: {dep.guide}</span>
                  </div>
                )}

                {/* Guest avatars */}
                {(dep.guests ?? []).length > 0 && (
                  <div className="flex items-center gap-1 mt-3">
                    {(dep.guests ?? []).map((g, i) => (
                      <span key={i} className="text-[14px]" title={g.name}>{g.country}</span>
                    ))}
                  </div>
                )}

                {/* Waitlist */}
                {(dep.waitlist ?? []).length > 0 && (
                  <p className="font-sub font-normal text-[11px] text-gold mt-2">{(dep.waitlist ?? []).length} on waitlist</p>
                )}
              </div>
              <div className="border-t border-[#E8E0D5] px-6 py-3 flex gap-2">
                <button className="flex-1 py-1.5 font-sub font-normal text-[11px] text-warm-charcoal border border-[#E8E0D5] hover:border-warm-charcoal transition-colors text-center" onClick={() => openEdit(dep)}>
                  Edit
                </button>
                <button
                  className="flex-1 py-1.5 font-sub font-normal text-[11px] text-warm-charcoal border border-[#E8E0D5] hover:border-terracotta hover:text-terracotta transition-colors text-center"
                  onClick={() => openEdit({ ...dep, status: dep.status === 'open' ? 'completed' : 'open' })}
                >
                  {dep.status === 'open' ? 'Close Sales' : 'Reopen'}
                </button>
                <button
                  className="flex-1 py-1.5 font-sub font-normal text-[11px] text-warm-charcoal border border-[#E8E0D5] hover:border-red-500 hover:text-red-500 transition-colors text-center"
                  onClick={() => handleDelete(dep.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] w-full max-w-[760px] p-6 border border-[#E8E0D5] overflow-y-auto max-h-[85vh]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display italic text-[20px] text-warm-charcoal">
                {editingId ? 'Edit Departure' : 'New Departure'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-warm-charcoal hover:text-warm-charcoal">
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Safari Name *</label>
                <input value={form.safariName} onChange={e => setForm({ ...form, safariName: e.target.value })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Status *</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta">
                  <option value="open">Open</option>
                  <option value="full">Full</option>
                  <option value="closed">Closed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Start Date *</label>
                <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">End Date *</label>
                <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Total Seats *</label>
                <input type="number" min={1} value={form.totalSeats} onChange={e => setForm({ ...form, totalSeats: Number(e.target.value) })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Booked Seats *</label>
                <input type="number" min={0} value={form.bookedSeats} onChange={e => setForm({ ...form, bookedSeats: Number(e.target.value) })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Revenue</label>
                <input type="number" min={0} value={form.revenue} onChange={e => setForm({ ...form, revenue: Number(e.target.value) })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Projected Revenue</label>
                <input type="number" min={0} value={form.projectedRevenue} onChange={e => setForm({ ...form, projectedRevenue: Number(e.target.value) })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Guide</label>
                <input value={form.guide} onChange={e => setForm({ ...form, guide: e.target.value })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Guests JSON</label>
                <textarea
                  value={form.guestsJson}
                  onChange={e => setForm({ ...form, guestsJson: e.target.value })}
                  rows={6}
                  className="w-full border border-[#E8E0D5] outline-none focus:border-terracotta px-3 py-2 resize-none"
                  placeholder='[{"name":"...","country":"..."}]'
                />
              </div>
              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Waitlist JSON</label>
                <textarea
                  value={form.waitlistJson}
                  onChange={e => setForm({ ...form, waitlistJson: e.target.value })}
                  rows={6}
                  className="w-full border border-[#E8E0D5] outline-none focus:border-terracotta px-3 py-2 resize-none"
                  placeholder='[{"name":"...","email":"...","whatsapp":"..."}]'
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-[#E8E0D5] text-warm-charcoal hover:text-warm-charcoal">
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (buildPayload.guestsParsed === null) return alert('Guests JSON is invalid');
                  if (buildPayload.waitlistParsed === null) return alert('Waitlist JSON is invalid');
                  if (!form.safariName?.trim() || !form.startDate || !form.endDate) {
                    return alert('Safari Name, Start Date, and End Date are required');
                  }
                  if (editingId) await update(editingId, buildPayload.payload);
                  else await create(buildPayload.payload);
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
