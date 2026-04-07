import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Search, PawPrint } from 'lucide-react';
import AdminTopBar from '../components/AdminTopBar';
import { useAdminCrud } from '../hooks/useAdminCrud';
import { wildlifeApi, uploadImages } from '../../services/adminApi';

const CATEGORIES = ['Big Five', 'Predator', 'Primate', 'Bird', 'Marine', 'Herbivore'];
const CONSERVATION_STATUSES = ['Least Concern', 'Near Threatened', 'Vulnerable', 'Endangered', 'Critically Endangered'];

const emptyForm = {
  name: '',
  category: '',
  image: '',
  fact: '',
  description: '',
  conservation_status: '',
};

export default function AdminWildlife() {
  const { items: wildlife, isLoading, create, update, remove } = useAdminCrud('wildlife', wildlifeApi);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [form, setForm] = useState<any>({ ...emptyForm });
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowForm(true);
  };

  const openEdit = (animal: any) => {
    setEditingId(animal.id);
    setForm({
      name: animal.name ?? '',
      category: animal.category ?? '',
      image: animal.image ?? '',
      fact: animal.fact ?? '',
      description: animal.description ?? '',
      conservation_status: animal.conservation_status ?? '',
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    const payload = { ...form };
    if (editingId) await update(editingId, payload);
    else await create(payload);
    setShowForm(false);
  };

  const handleDelete = async (animal: any) => {
    const destCount = animal.destinations_count ?? animal.destinationsCount ?? 0;
    const safCount = animal.safaris_count ?? animal.safarisCount ?? 0;
    if (destCount > 0 || safCount > 0) {
      alert(`Cannot delete "${animal.name}" — it's linked to ${destCount} destination(s) and ${safCount} safari(s). Remove associations first.`);
      return;
    }
    if (!confirm(`Delete "${animal.name}"?`)) return;
    await remove(animal.id);
  };

  const filtered = wildlife.filter((a: any) => {
    const matchSearch = !search || a.name?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === 'All' || a.category === filterCategory;
    return matchSearch && matchCategory;
  });

  // Group by category for display
  const grouped = CATEGORIES.map(cat => ({
    category: cat,
    animals: filtered.filter((a: any) => a.category === cat),
  })).filter(g => g.animals.length > 0);

  // Add uncategorized
  const uncategorized = filtered.filter((a: any) => !a.category || !CATEGORIES.includes(a.category));
  if (uncategorized.length > 0) grouped.push({ category: 'Other', animals: uncategorized });

  if (isLoading) {
    return (
      <div>
        <AdminTopBar title="Wildlife" />
        <div className="p-8">
          <p className="font-sub font-normal text-[13px] text-warm-charcoal">Loading wildlife catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminTopBar title="Wildlife" />
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <p className="font-sub font-normal text-[13px] text-warm-charcoal/60">
              {wildlife.length} animals in catalog · Manage globally, assign per destination
            </p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-terracotta text-warm-canvas font-sub font-normal text-[13px] uppercase tracking-[0.1em] hover:opacity-90 shrink-0">
            <Plus size={14} /> Add Animal
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8 pb-6 border-b border-[#E8E0D5]">
          <div className="relative flex-1 max-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-charcoal/30" size={14} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search wildlife..."
              className="w-full h-[38px] pl-9 pr-3 border border-[#E8E0D5] outline-none focus:border-terracotta font-sub font-normal text-[13px] text-warm-charcoal"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterCategory('All')}
              className={`px-3 py-1.5 font-sub font-normal text-[11px] uppercase tracking-[0.1em] transition-colors ${
                filterCategory === 'All' ? 'bg-terracotta text-warm-canvas' : 'border border-[#E8E0D5] text-warm-charcoal/60 hover:border-terracotta'
              }`}
            >
              All
            </button>
            {CATEGORIES.map(cat => {
              const count = wildlife.filter((a: any) => a.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 font-sub font-normal text-[11px] uppercase tracking-[0.1em] transition-colors ${
                    filterCategory === cat ? 'bg-terracotta text-warm-canvas' : 'border border-[#E8E0D5] text-warm-charcoal/60 hover:border-terracotta'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Wildlife Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#E8E0D5]">
            <PawPrint size={36} className="mx-auto text-warm-charcoal/20 mb-4" />
            <p className="font-sub font-normal text-[14px] text-warm-charcoal/40">No wildlife found matching your criteria.</p>
          </div>
        ) : (
          grouped.map(group => (
            <div key={group.category} className="mb-10">
              <h3 className="font-sub font-normal text-[11px] text-gold uppercase tracking-[0.25em] mb-4">{group.category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {group.animals.map((animal: any) => (
                  <div key={animal.id} className="group bg-[#FFFFFF] border border-[#E8E0D5] overflow-hidden hover:border-terracotta/30 transition-colors">
                    {/* Image */}
                    <div className="aspect-[16/10] bg-faded-sand/30 relative overflow-hidden">
                      {animal.image ? (
                        <img src={animal.image} alt={animal.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <PawPrint size={32} className="text-warm-charcoal/10" />
                        </div>
                      )}
                      {/* Actions overlay */}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(animal)} className="p-1.5 bg-white/90 backdrop-blur-sm text-warm-charcoal hover:text-terracotta transition-colors" aria-label="Edit">
                          <Pencil size={12} />
                        </button>
                        <button onClick={() => handleDelete(animal)} className="p-1.5 bg-white/90 backdrop-blur-sm text-warm-charcoal hover:text-red-500 transition-colors" aria-label="Delete">
                          <Trash2 size={12} />
                        </button>
                      </div>
                      {/* Conservation badge */}
                      {animal.conservation_status && (
                        <span className={`absolute bottom-2 left-2 px-2 py-0.5 font-sub font-normal text-[9px] uppercase tracking-[0.1em] backdrop-blur-sm ${
                          animal.conservation_status === 'Endangered' || animal.conservation_status === 'Critically Endangered'
                            ? 'bg-red-500/90 text-white'
                            : animal.conservation_status === 'Vulnerable'
                            ? 'bg-amber-500/90 text-white'
                            : 'bg-sage/90 text-white'
                        }`}>
                          {animal.conservation_status}
                        </span>
                      )}
                    </div>
                    {/* Info */}
                    <div className="p-4">
                      <h4 className="font-sub font-normal text-[15px] text-warm-charcoal mb-1">{animal.name}</h4>
                      <p className="font-sub font-normal text-[11px] text-terracotta mb-2">{animal.category}</p>
                      {animal.fact && (
                        <p className="font-sub font-normal text-[12px] text-warm-charcoal/50 line-clamp-2 leading-relaxed">{animal.fact}</p>
                      )}
                      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#E8E0D5]/50">
                        <span className="font-sub font-normal text-[10px] text-warm-charcoal/40">
                          {animal.destinations_count ?? animal.destinationsCount ?? 0} destinations
                        </span>
                        <span className="font-sub font-normal text-[10px] text-warm-charcoal/40">
                          {animal.safaris_count ?? animal.safarisCount ?? 0} safaris
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] w-full max-w-[560px] p-6 border border-[#E8E0D5] max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display italic text-[20px] text-warm-charcoal">
                {editingId ? 'Edit Animal' : 'Add New Animal'}
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
                  placeholder="e.g. African Lion"
                  className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta font-sub font-normal text-[13px] text-warm-charcoal"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta font-sub font-normal text-[13px] text-warm-charcoal"
                >
                  <option value="">Select category...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Conservation Status */}
              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Conservation Status</label>
                <select
                  value={form.conservation_status}
                  onChange={e => setForm({ ...form, conservation_status: e.target.value })}
                  className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta font-sub font-normal text-[13px] text-warm-charcoal"
                >
                  <option value="">None</option>
                  {CONSERVATION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
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
                          const urls = await uploadImages([file], 'wildlife');
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

              {/* Fact */}
              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Interesting Fact</label>
                <textarea
                  value={form.fact}
                  onChange={e => setForm({ ...form, fact: e.target.value })}
                  placeholder="One-line fact about this animal..."
                  rows={2}
                  className="w-full border border-[#E8E0D5] outline-none focus:border-terracotta px-3 py-2 resize-none font-sub font-normal text-[13px] text-warm-charcoal"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Longer description for detail views..."
                  rows={4}
                  className="w-full border border-[#E8E0D5] outline-none focus:border-terracotta px-3 py-2 resize-none font-sub font-normal text-[13px] text-warm-charcoal"
                />
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
