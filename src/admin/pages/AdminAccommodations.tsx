import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Search, Building2, Star } from 'lucide-react';
import AdminTopBar from '../components/AdminTopBar';
import { useAdminCrud } from '../hooks/useAdminCrud';
import { accommodationsApi, uploadImages } from '../../services/adminApi';

const TIERS = ['Premium', 'Superior', 'Standard', 'Budget'];

const emptyForm = {
  name: '',
  location: '',
  tier: 'Standard',
  stars: '' as any,
  description: '',
  image: '',
  website: '',
  amenities: [] as string[],
};

export default function AdminAccommodations() {
  const { items: accommodations, isLoading, create, update, remove } = useAdminCrud('accommodations', accommodationsApi);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [form, setForm] = useState<any>({ ...emptyForm });
  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState('All');
  const [amenityInput, setAmenityInput] = useState('');

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, amenities: [] });
    setAmenityInput('');
    setShowForm(true);
  };

  const openEdit = (acc: any) => {
    setEditingId(acc.id);
    setForm({
      name: acc.name ?? '',
      location: acc.location ?? '',
      tier: acc.tier ?? 'Standard',
      stars: acc.stars ?? '',
      description: acc.description ?? '',
      image: acc.image ?? '',
      website: acc.website ?? '',
      amenities: acc.amenities ?? [],
    });
    setAmenityInput('');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    const payload = {
      ...form,
      stars: form.stars ? Number(form.stars) : null,
    };
    if (editingId) await update(editingId, payload);
    else await create(payload);
    setShowForm(false);
  };

  const handleDelete = async (acc: any) => {
    const destCount = acc.destinations_count ?? 0;
    const safCount = acc.safaris_count ?? 0;
    if (destCount > 0 || safCount > 0) {
      alert(`Cannot delete "${acc.name}" — it's linked to ${destCount} destination(s) and ${safCount} safari(s). Remove associations first.`);
      return;
    }
    if (!confirm(`Delete "${acc.name}"?`)) return;
    await remove(acc.id);
  };

  const addAmenity = () => {
    const val = amenityInput.trim();
    if (!val || form.amenities.includes(val)) return;
    setForm({ ...form, amenities: [...form.amenities, val] });
    setAmenityInput('');
  };

  const removeAmenity = (idx: number) => {
    setForm({ ...form, amenities: form.amenities.filter((_: any, i: number) => i !== idx) });
  };

  const filtered = accommodations.filter((a: any) => {
    const matchSearch = !search || a.name?.toLowerCase().includes(search.toLowerCase()) || a.location?.toLowerCase().includes(search.toLowerCase());
    const matchTier = filterTier === 'All' || a.tier === filterTier;
    return matchSearch && matchTier;
  });

  const tierColor = (tier: string) => {
    if (tier === 'Premium') return 'bg-gold/20 text-gold';
    if (tier === 'Superior') return 'bg-terracotta/15 text-terracotta';
    if (tier === 'Standard') return 'bg-sage/20 text-sage';
    return 'bg-faded-sand text-warm-charcoal/60';
  };

  if (isLoading) {
    return (
      <div>
        <AdminTopBar title="Accommodations" />
        <div className="p-8">
          <p className="font-sub font-normal text-[13px] text-warm-charcoal">Loading accommodations...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminTopBar title="Accommodations" />
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <p className="font-sub font-normal text-[13px] text-warm-charcoal/60">
              {accommodations.length} lodges & camps in catalog · Manage globally, assign per destination & safari
            </p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-terracotta text-warm-canvas font-sub font-normal text-[13px] uppercase tracking-[0.1em] hover:opacity-90 shrink-0">
            <Plus size={14} /> Add Accommodation
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8 pb-6 border-b border-[#E8E0D5]">
          <div className="relative flex-1 max-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-charcoal/30" size={14} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search lodges & camps..."
              className="w-full h-[38px] pl-9 pr-3 border border-[#E8E0D5] outline-none focus:border-terracotta font-sub font-normal text-[13px] text-warm-charcoal"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterTier('All')}
              className={`px-3 py-1.5 font-sub font-normal text-[11px] uppercase tracking-[0.1em] transition-colors ${
                filterTier === 'All' ? 'bg-terracotta text-warm-canvas' : 'border border-[#E8E0D5] text-warm-charcoal/60 hover:border-terracotta'
              }`}
            >
              All
            </button>
            {TIERS.map(tier => {
              const count = accommodations.filter((a: any) => a.tier === tier).length;
              return (
                <button
                  key={tier}
                  onClick={() => setFilterTier(tier)}
                  className={`px-3 py-1.5 font-sub font-normal text-[11px] uppercase tracking-[0.1em] transition-colors ${
                    filterTier === tier ? 'bg-terracotta text-warm-canvas' : 'border border-[#E8E0D5] text-warm-charcoal/60 hover:border-terracotta'
                  }`}
                >
                  {tier} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Accommodation Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#E8E0D5]">
            <Building2 size={36} className="mx-auto text-warm-charcoal/20 mb-4" />
            <p className="font-sub font-normal text-[14px] text-warm-charcoal/40">No accommodations found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((acc: any) => (
              <div key={acc.id} className="group bg-[#FFFFFF] border border-[#E8E0D5] overflow-hidden hover:border-terracotta/30 transition-colors">
                {/* Image */}
                <div className="aspect-[16/10] bg-faded-sand/30 relative overflow-hidden">
                  {acc.image ? (
                    <img src={acc.image} alt={acc.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 size={32} className="text-warm-charcoal/10" />
                    </div>
                  )}
                  {/* Actions overlay */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(acc)} className="p-1.5 bg-white/90 backdrop-blur-sm text-warm-charcoal hover:text-terracotta transition-colors" aria-label="Edit">
                      <Pencil size={12} />
                    </button>
                    <button onClick={() => handleDelete(acc)} className="p-1.5 bg-white/90 backdrop-blur-sm text-warm-charcoal hover:text-red-500 transition-colors" aria-label="Delete">
                      <Trash2 size={12} />
                    </button>
                  </div>
                  {/* Tier badge */}
                  <span className={`absolute bottom-2 left-2 px-2 py-0.5 font-sub font-normal text-[9px] uppercase tracking-[0.1em] backdrop-blur-sm ${tierColor(acc.tier)}`}>
                    {acc.tier}
                  </span>
                </div>
                {/* Info */}
                <div className="p-4">
                  <h4 className="font-sub font-normal text-[15px] text-warm-charcoal mb-0.5">{acc.name}</h4>
                  {acc.location && (
                    <p className="font-sub font-normal text-[11px] text-terracotta mb-1">{acc.location}</p>
                  )}
                  {acc.stars && (
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: acc.stars }).map((_, i) => (
                        <Star key={i} size={10} className="fill-gold text-gold" />
                      ))}
                    </div>
                  )}
                  {acc.description && (
                    <p className="font-sub font-normal text-[12px] text-warm-charcoal/50 line-clamp-2 leading-relaxed">{acc.description}</p>
                  )}
                  {(acc.amenities?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {acc.amenities.slice(0, 3).map((am: string, i: number) => (
                        <span key={i} className="px-1.5 py-0.5 bg-faded-sand/50 font-sub font-normal text-[9px] text-warm-charcoal/50 uppercase tracking-wider">{am}</span>
                      ))}
                      {acc.amenities.length > 3 && (
                        <span className="px-1.5 py-0.5 font-sub font-normal text-[9px] text-warm-charcoal/40">+{acc.amenities.length - 3}</span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#E8E0D5]/50">
                    <span className="font-sub font-normal text-[10px] text-warm-charcoal/40">
                      {acc.destinations_count ?? 0} destinations
                    </span>
                    <span className="font-sub font-normal text-[10px] text-warm-charcoal/40">
                      {acc.safaris_count ?? 0} safaris
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] w-full max-w-[560px] p-6 border border-[#E8E0D5] max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display italic text-[20px] text-warm-charcoal">
                {editingId ? 'Edit Accommodation' : 'Add New Accommodation'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-warm-charcoal hover:text-terracotta" aria-label="Close">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-5">
              {/* Name */}
              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Serengeti Serena Lodge"
                  className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta font-sub font-normal text-[13px] text-warm-charcoal"
                />
              </div>

              {/* Location & Tier */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Location</label>
                  <input
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Central Serengeti"
                    className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta font-sub font-normal text-[13px] text-warm-charcoal"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Tier</label>
                  <select
                    value={form.tier}
                    onChange={e => setForm({ ...form, tier: e.target.value })}
                    className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta font-sub font-normal text-[13px] text-warm-charcoal"
                  >
                    {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Stars */}
              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Stars</label>
                <select
                  value={form.stars}
                  onChange={e => setForm({ ...form, stars: e.target.value })}
                  className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta font-sub font-normal text-[13px] text-warm-charcoal"
                >
                  <option value="">No rating</option>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>

              {/* Image */}
              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Image</label>
                <div className="flex gap-2">
                  <input
                    value={form.image}
                    onChange={e => setForm({ ...form, image: e.target.value })}
                    placeholder="Image URL"
                    className="flex-1 h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta font-sub font-normal text-[13px] text-warm-charcoal"
                  />
                  <label className="cursor-pointer h-[40px] px-4 bg-faded-sand text-warm-charcoal font-sub font-normal text-[11px] uppercase tracking-[0.1em] flex items-center justify-center hover:bg-gold/10 transition-colors shrink-0">
                    Upload
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const urls = await uploadImages([file], 'accommodations');
                          if (urls?.length > 0) setForm((prev: any) => ({ ...prev, image: urls[0] }));
                        } catch (err) {
                          console.error('Upload failed', err);
                          alert('Upload failed. Please try again.');
                        }
                      }}
                    />
                  </label>
                </div>
                {form.image && (
                  <div className="mt-2 w-24 h-16 border border-[#E8E0D5] overflow-hidden">
                    <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Website */}
              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Website</label>
                <input
                  value={form.website}
                  onChange={e => setForm({ ...form, website: e.target.value })}
                  placeholder="https://www.lodge-website.com"
                  className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta font-sub font-normal text-[13px] text-warm-charcoal"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description of this lodge or camp..."
                  rows={3}
                  className="w-full border border-[#E8E0D5] outline-none focus:border-terracotta px-3 py-2 resize-none font-sub font-normal text-[13px] text-warm-charcoal"
                />
              </div>

              {/* Amenities */}
              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Amenities</label>
                <div className="flex gap-2">
                  <input
                    value={amenityInput}
                    onChange={e => setAmenityInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addAmenity(); }}}
                    placeholder="Type amenity & press Enter"
                    className="flex-1 h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta font-sub font-normal text-[13px] text-warm-charcoal"
                  />
                  <button onClick={addAmenity} type="button" className="px-3 h-[40px] bg-faded-sand text-warm-charcoal font-sub font-normal text-[11px] uppercase tracking-[0.1em] hover:bg-gold/10 transition-colors">Add</button>
                </div>
                {form.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.amenities.map((am: string, i: number) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-faded-sand/60 font-sub font-normal text-[11px] text-warm-charcoal/70">
                        {am}
                        <button onClick={() => removeAmenity(i)} className="text-warm-charcoal/30 hover:text-red-500" aria-label="Remove"><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-[#E8E0D5] text-warm-charcoal font-sub font-normal text-[13px] hover:border-warm-charcoal transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} className="px-5 py-2 bg-terracotta text-warm-canvas font-sub font-normal text-[13px] uppercase tracking-[0.1em] hover:opacity-90">
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
