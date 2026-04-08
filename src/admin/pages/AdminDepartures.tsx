import { useMemo, useState } from 'react';
import { Plus, Users, Trash2, Pencil, X, UserPlus, UserMinus } from 'lucide-react';
import AdminTopBar from '../components/AdminTopBar';
import { useAdminCrud } from '../hooks/useAdminCrud';
import { departuresApi, safarisApi } from '../../services/adminApi';

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
  const { items: safaris } = useAdminCrud('safaris', safarisApi);

  const filtered = departures.filter((d: any) => {
    if (filter === 'upcoming') return d.status !== 'completed';
    if (filter === 'past') return d.status === 'completed';
    return true;
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [form, setForm] = useState<any>({
    safariId: '',
    safariName: '',
    startDate: '',
    endDate: '',
    totalSeats: 1,
    bookedSeats: 0,
    status: 'open',
    revenue: 0,
    projectedRevenue: 0,
    guide: '',
    guests: [],
    waitlist: [],
  });

  const openCreate = () => {
    setEditingId(null);
    setForm({
      safariId: '',
      safariName: '',
      startDate: '',
      endDate: '',
      totalSeats: 1,
      bookedSeats: 0,
      status: 'open',
      revenue: 0,
      projectedRevenue: 0,
      guide: '',
      guests: [],
      waitlist: [],
    });
    setShowForm(true);
  };

  const openEdit = (dep: any) => {
    setEditingId(dep.id);
    setForm({
      safariId: dep.safariId ?? '',
      safariName: dep.safariName ?? '',
      startDate: dep.startDate ?? '',
      endDate: dep.endDate ?? '',
      totalSeats: Number(dep.totalSeats ?? 1),
      bookedSeats: Number(dep.bookedSeats ?? 0),
      status: dep.status ?? 'open',
      revenue: Number(dep.revenue ?? 0),
      projectedRevenue: Number(dep.projectedRevenue ?? 0),
      guide: dep.guide ?? '',
      guests: dep.guests ?? [],
      waitlist: dep.waitlist ?? [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Delete this departure?')) return;
    await remove(id);
    await refetch();
  };

  const buildPayload = useMemo(() => {
    return {
      safari_id: form.safariId || null,
      safari_name: form.safariName || null,
      start_date: form.startDate || null,
      end_date: form.endDate || null,
      total_seats: Number(form.totalSeats ?? 1),
      booked_seats: Number(form.bookedSeats ?? 0),
      status: form.status,
      revenue: Number(form.revenue ?? 0),
      projected_revenue: Number(form.projectedRevenue ?? 0),
      guide: form.guide || null,
      guests: form.guests ?? [],
      waitlist: form.waitlist ?? [],
    };
  }, [form]);
  const handleSafariChange = (safariId: string) => {
    const selectedSafari = safaris.find(s => String(s.id) === safariId);
    setForm({
      ...form,
      safariId: safariId,
      safariName: selectedSafari ? selectedSafari.name : '',
    });
  };

  const addGuest = () => {
    setForm({
      ...form,
      guests: [...form.guests, { name: '', country: '' }]
    });
  };

  const updateGuest = (index: number, field: string, value: string) => {
    const updatedGuests = [...form.guests];
    updatedGuests[index] = { ...updatedGuests[index], [field]: value };
    setForm({ ...form, guests: updatedGuests });
  };

  const removeGuest = (index: number) => {
    const updatedGuests = form.guests.filter((_: any, i: number) => i !== index);
    setForm({ ...form, guests: updatedGuests });
  };

  const addWaitlist = () => {
    setForm({
      ...form,
      waitlist: [...form.waitlist, { name: '', email: '', whatsapp: '' }]
    });
  };

  const updateWaitlist = (index: number, field: string, value: string) => {
    const updatedWaitlist = [...form.waitlist];
    updatedWaitlist[index] = { ...updatedWaitlist[index], [field]: value };
    setForm({ ...form, waitlist: updatedWaitlist });
  };

  const removeWaitlist = (index: number) => {
    const updatedWaitlist = form.waitlist.filter((_: any, i: number) => i !== index);
    setForm({ ...form, waitlist: updatedWaitlist });
  };

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
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Safari *</label>
                <select 
                  value={form.safariId} 
                  onChange={e => handleSafariChange(e.target.value)} 
                  className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta"
                >
                  <option value="">Select a safari...</option>
                  {safaris.map((safari: any) => (
                    <option key={safari.id} value={safari.id}>
                      {safari.name}
                    </option>
                  ))}
                </select>
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
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5">Start Date *</label>
                <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5">End Date *</label>
                <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5">Total Seats *</label>
                <input type="number" min={1} value={form.totalSeats} onChange={e => setForm({ ...form, totalSeats: Number(e.target.value) })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5">Booked Seats *</label>
                <input type="number" min={0} value={form.bookedSeats} onChange={e => setForm({ ...form, bookedSeats: Number(e.target.value) })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5">Revenue</label>
                <input type="number" min={0} value={form.revenue} onChange={e => setForm({ ...form, revenue: Number(e.target.value) })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5">Projected Revenue</label>
                <input type="number" min={0} value={form.projectedRevenue} onChange={e => setForm({ ...form, projectedRevenue: Number(e.target.value) })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5">Guide</label>
                <input value={form.guide} onChange={e => setForm({ ...form, guide: e.target.value })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-sub font-normal text-[14px] text-warm-charcoal">Guests ({form.guests.length})</h3>
                <button onClick={addGuest} className="flex items-center gap-2 px-3 py-1.5 bg-terracotta text-warm-canvas font-sub font-normal text-[11px] uppercase tracking-[0.1em] hover:opacity-90">
                  <UserPlus size={12} /> Add Guest
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {form.guests.map((guest: any, index: number) => (
                  <div key={index} className="flex gap-2 items-center p-2 border border-[#E8E0D5] bg-[#FEFCF9]">
                    <input
                      placeholder="Name"
                      value={guest.name}
                      onChange={e => updateGuest(index, 'name', e.target.value)}
                      className="flex-1 h-[32px] px-2 border border-[#E8E0D5] outline-none focus:border-terracotta text-[12px]"
                    />
                    <input
                      placeholder="Country"
                      value={guest.country}
                      onChange={e => updateGuest(index, 'country', e.target.value)}
                      className="flex-1 h-[32px] px-2 border border-[#E8E0D5] outline-none focus:border-terracotta text-[12px]"
                    />
                    <button onClick={() => removeGuest(index)} className="p-1 text-red-500 hover:text-red-700">
                      <UserMinus size={14} />
                    </button>
                  </div>
                ))}
                {form.guests.length === 0 && (
                  <p className="text-[12px] text-warm-charcoal/60 italic">No guests added yet</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-sub font-normal text-[14px] text-warm-charcoal">Waitlist ({form.waitlist.length})</h3>
                <button onClick={addWaitlist} className="flex items-center gap-2 px-3 py-1.5 bg-gold text-warm-canvas font-sub font-normal text-[11px] uppercase tracking-[0.1em] hover:opacity-90">
                  <UserPlus size={12} /> Add to Waitlist
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {form.waitlist.map((person: any, index: number) => (
                  <div key={index} className="flex gap-2 items-center p-2 border border-[#E8E0D5] bg-[#FEFCF9]">
                    <input
                      placeholder="Name"
                      value={person.name}
                      onChange={e => updateWaitlist(index, 'name', e.target.value)}
                      className="flex-1 h-[32px] px-2 border border-[#E8E0D5] outline-none focus:border-terracotta text-[12px]"
                    />
                    <input
                      placeholder="Email"
                      type="email"
                      value={person.email}
                      onChange={e => updateWaitlist(index, 'email', e.target.value)}
                      className="flex-1 h-[32px] px-2 border border-[#E8E0D5] outline-none focus:border-terracotta text-[12px]"
                    />
                    <input
                      placeholder="WhatsApp"
                      value={person.whatsapp}
                      onChange={e => updateWaitlist(index, 'whatsapp', e.target.value)}
                      className="flex-1 h-[32px] px-2 border border-[#E8E0D5] outline-none focus:border-terracotta text-[12px]"
                    />
                    <button onClick={() => removeWaitlist(index)} className="p-1 text-red-500 hover:text-red-700">
                      <UserMinus size={14} />
                    </button>
                  </div>
                ))}
                {form.waitlist.length === 0 && (
                  <p className="text-[12px] text-warm-charcoal/60 italic">No one on waitlist</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-[#E8E0D5] text-warm-charcoal hover:text-warm-charcoal">
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!form.safariId || !form.startDate || !form.endDate) {
                    return alert('Safari, Start Date, and End Date are required');
                  }
                  if (editingId) await update(editingId, buildPayload);
                  else await create(buildPayload);
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

