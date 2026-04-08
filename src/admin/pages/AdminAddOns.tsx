import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Check, DollarSign, Clock, MapPin, Upload } from 'lucide-react';
import AdminTopBar from '../components/AdminTopBar';
import { useAdminCrud } from '../hooks/useAdminCrud';
import { addOnsApi, uploadImages } from '../../services/adminApi';

export default function AdminAddOns() {
  const { items: addOns, isLoading, create, update, remove } = useAdminCrud('add-ons', addOnsApi);
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openCreate = () => {
    setFormData({
      name: '', slug: '', category: 'In The Air', price: '', price_numeric: 0,
      price_suffix: 'per person', duration: '', location: '', best_season: '',
      group_size: '', start_time: '', tagline: '', hero_images: [''],
      overview_prose: [''], pull_quote: '', included: [''], not_included: [''],
      timeline: [], faqs: [], practical_info: [], related_slugs: [],
    });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (addon: any) => {
    setFormData({
      name: addon.name || '',
      slug: addon.slug || '',
      category: addon.category || '',
      price: addon.price || '',
      price_numeric: addon.priceNumeric || 0,
      price_suffix: addon.priceSuffix || '',
      duration: addon.duration || '',
      location: addon.location || '',
      best_season: addon.bestSeason || '',
      group_size: addon.groupSize || '',
      start_time: addon.startTime || '',
      tagline: addon.tagline || '',
      hero_images: addon.heroImages?.length ? addon.heroImages : [''],
      overview_prose: addon.overviewProse?.length ? addon.overviewProse : [''],
      pull_quote: addon.pullQuote || '',
      included: addon.included?.length ? addon.included : [''],
      not_included: addon.notIncluded?.length ? addon.notIncluded : [''],
      timeline: addon.timeline || [],
      faqs: addon.faqs || [],
      practical_info: addon.practicalInfo || [],
      related_slugs: addon.relatedSlugs || [],
    });
    setEditing(addon.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    const payload = {
      ...formData,
      hero_images: formData.hero_images.filter((v: string) => v),
      overview_prose: formData.overview_prose.filter((v: string) => v),
      included: formData.included.filter((v: string) => v),
      not_included: formData.not_included.filter((v: string) => v),
      timeline: formData.timeline || [],
      faqs: formData.faqs || [],
      practical_info: formData.practical_info || [],
      related_slugs: formData.related_slugs || [],
    };
    if (editing) {
      await update(editing, payload);
    } else {
      await create(payload);
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async (id: number) => {
    await remove(id);
    setDeleteConfirm(null);
  };

  const updateArrayField = (field: string, index: number, value: string) => {
    const arr = [...(formData[field] || [])];
    arr[index] = value;
    setFormData({ ...formData, [field]: arr });
  };

  const addArrayItem = (field: string) => {
    setFormData({ ...formData, [field]: [...(formData[field] || []), ''] });
  };

  const removeArrayItem = (field: string, index: number) => {
    const arr = [...(formData[field] || [])];
    arr.splice(index, 1);
    setFormData({ ...formData, [field]: arr });
  };

  if (isLoading) {
    return (
      <div>
        <AdminTopBar title="Add-On Experiences" />
        <div className="p-8">
          <p className="font-sub font-normal text-[13px] text-warm-charcoal">Loading add-ons...</p>
        </div>
      </div>
    );
  }

  const categories = ['In The Air', 'On The Ground', 'On The Water', 'Cultural', 'Wellness'];

  return (
    <div>
      <AdminTopBar title="Add-On Experiences" />
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="font-sub font-normal text-[13px] text-warm-charcoal">
            {addOns.length} add-on{addOns.length !== 1 ? 's' : ''} available
          </p>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-terracotta text-warm-canvas font-sub font-normal text-[13px] uppercase tracking-[0.1em] hover:opacity-90">
            <Plus size={14} /> Add New
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-12 overflow-y-auto">
            <div className="bg-[#FFFFFF] w-full max-w-[700px] p-8 mx-4 mb-12 border border-[#E8E0D5]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display italic text-[22px] text-warm-charcoal">
                  {editing ? 'Edit Add-On' : 'New Add-On'}
                </h2>
                <button onClick={() => setShowForm(false)} className="p-2 text-warm-charcoal hover:text-warm-charcoal"><X size={16} /></button>
              </div>

              <div className="space-y-5">
                {/* Name & Slug */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5">Name</label>
                    <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/g, '') })} className="w-full border border-[#E8E0D5] bg-[#FEFCF9] px-3 py-2 font-sub font-normal text-[13px] text-warm-charcoal focus:outline-none focus:border-terracotta" />
                  </div>
                  <div>
                    <label className="block font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5">Slug</label>
                    <input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="w-full border border-[#E8E0D5] bg-[#FEFCF9] px-3 py-2 font-sub font-normal text-[13px] text-warm-charcoal focus:outline-none focus:border-terracotta" />
                  </div>
                </div>

                {/* Category & Price */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5">Category</label>
                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full border border-[#E8E0D5] bg-[#FEFCF9] px-3 py-2 font-sub font-normal text-[13px] text-warm-charcoal focus:outline-none focus:border-terracotta">
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5">Price Display</label>
                    <input value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="+$550" className="w-full border border-[#E8E0D5] bg-[#FEFCF9] px-3 py-2 font-sub font-normal text-[13px] text-warm-charcoal focus:outline-none focus:border-terracotta" />
                  </div>
                  <div>
                    <label className="block font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5">Price (numeric)</label>
                    <input type="number" value={formData.price_numeric} onChange={e => setFormData({ ...formData, price_numeric: Number(e.target.value) })} className="w-full border border-[#E8E0D5] bg-[#FEFCF9] px-3 py-2 font-sub font-normal text-[13px] text-warm-charcoal focus:outline-none focus:border-terracotta" />
                  </div>
                </div>

                {/* Duration, Location, Group Size, Best Season, Start Time */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5">Duration</label>
                    <input value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} placeholder="3-4 hours" className="w-full border border-[#E8E0D5] bg-[#FEFCF9] px-3 py-2 font-sub font-normal text-[13px] text-warm-charcoal focus:outline-none focus:border-terracotta" />
                  </div>
                  <div>
                    <label className="block font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5">Location</label>
                    <input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full border border-[#E8E0D5] bg-[#FEFCF9] px-3 py-2 font-sub font-normal text-[13px] text-warm-charcoal focus:outline-none focus:border-terracotta" />
                  </div>
                  <div>
                    <label className="block font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5">Group Size</label>
                    <input value={formData.group_size} onChange={e => setFormData({ ...formData, group_size: e.target.value })} className="w-full border border-[#E8E0D5] bg-[#FEFCF9] px-3 py-2 font-sub font-normal text-[13px] text-warm-charcoal focus:outline-none focus:border-terracotta" />
                  </div>
                </div>

                {/* Best Season, Start Time, Price Suffix */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5">Best Season</label>
                    <input value={formData.best_season} onChange={e => setFormData({ ...formData, best_season: e.target.value })} placeholder="Year-round" className="w-full border border-[#E8E0D5] bg-[#FEFCF9] px-3 py-2 font-sub font-normal text-[13px] text-warm-charcoal focus:outline-none focus:border-terracotta" />
                  </div>
                  <div>
                    <label className="block font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5">Start Time</label>
                    <input value={formData.start_time} onChange={e => setFormData({ ...formData, start_time: e.target.value })} placeholder="5:30 AM" className="w-full border border-[#E8E0D5] bg-[#FEFCF9] px-3 py-2 font-sub font-normal text-[13px] text-warm-charcoal focus:outline-none focus:border-terracotta" />
                  </div>
                  <div>
                    <label className="block font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5">Price Suffix</label>
                    <input value={formData.price_suffix} onChange={e => setFormData({ ...formData, price_suffix: e.target.value })} placeholder="per person" className="w-full border border-[#E8E0D5] bg-[#FEFCF9] px-3 py-2 font-sub font-normal text-[13px] text-warm-charcoal focus:outline-none focus:border-terracotta" />
                  </div>
                </div>

                {/* Tagline */}
                <div>
                  <label className="block font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5">Tagline</label>
                  <textarea value={formData.tagline} onChange={e => setFormData({ ...formData, tagline: e.target.value })} rows={2} className="w-full border border-[#E8E0D5] bg-[#FEFCF9] px-3 py-2 font-sub font-normal text-[13px] text-warm-charcoal focus:outline-none focus:border-terracotta resize-none" />
                </div>

                {/* Pull Quote */}
                <div>
                  <label className="block font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5">Pull Quote</label>
                  <textarea value={formData.pull_quote} onChange={e => setFormData({ ...formData, pull_quote: e.target.value })} rows={2} className="w-full border border-[#E8E0D5] bg-[#FEFCF9] px-3 py-2 font-sub font-normal text-[13px] text-warm-charcoal focus:outline-none focus:border-terracotta resize-none" />
                </div>

                {/* Hero Images */}
                <div>
                  <label className="block font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5">Hero Images</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length === 0) return;
                      setIsUploading(true);
                      try {
                        const urls = await uploadImages(files, 'add-ons');
                        setFormData({ ...formData, hero_images: [...(formData.hero_images || []), ...urls] });
                      } catch (err) {
                        alert('Upload failed: ' + (err as Error).message);
                      } finally {
                        setIsUploading(false);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }
                    }}
                  />
                  {(formData.hero_images || []).map((url: string, i: number) => (
                    <div key={i} className="flex gap-2 mb-2">
                      {url.startsWith('http') ? (
                        <div className="flex-1 relative group">
                          <img src={url} alt={`Hero ${i + 1}`} className="w-full h-20 object-cover border border-[#E8E0D5] rounded" />
                          <button
                            type="button"
                            onClick={() => removeArrayItem('hero_images', i)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ) : (
                        <input value={url} onChange={e => updateArrayField('hero_images', i, e.target.value)} placeholder="https://..." className="flex-1 border border-[#E8E0D5] bg-[#FEFCF9] px-3 py-1.5 font-sub font-normal text-[12px] text-warm-charcoal focus:outline-none focus:border-terracotta" />
                      )}
                      <button onClick={() => removeArrayItem('hero_images', i)} className="text-warm-charcoal hover:text-terracotta"><X size={12} /></button>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex items-center gap-2 px-3 py-1.5 bg-terracotta text-warm-canvas font-sub font-normal text-[11px] uppercase tracking-[0.1em] hover:opacity-90 disabled:opacity-50"
                    >
                      {isUploading ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b border-warm-canvas"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload size={12} />
                          Upload Image
                        </>
                      )}
                    </button>
                    <button onClick={() => addArrayItem('hero_images')} className="font-sub font-normal text-[11px] text-terracotta hover:underline">+ Add URL</button>
                  </div>
                </div>

                {/* Overview Prose */}
                <div>
                  <label className="block font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5">Overview Paragraphs</label>
                  {(formData.overview_prose || []).map((p: string, i: number) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <textarea value={p} onChange={e => updateArrayField('overview_prose', i, e.target.value)} rows={2} className="flex-1 border border-[#E8E0D5] bg-[#FEFCF9] px-3 py-1.5 font-sub font-normal text-[12px] text-warm-charcoal focus:outline-none focus:border-terracotta resize-none" />
                      <button onClick={() => removeArrayItem('overview_prose', i)} className="text-warm-charcoal hover:text-terracotta"><X size={12} /></button>
                    </div>
                  ))}
                  <button onClick={() => addArrayItem('overview_prose')} className="font-sub font-normal text-[11px] text-terracotta hover:underline">+ Add Paragraph</button>
                </div>

                {/* Included / Not Included */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5">Included</label>
                    {(formData.included || []).map((item: string, i: number) => (
                      <div key={i} className="flex gap-2 mb-1.5">
                        <input value={item} onChange={e => updateArrayField('included', i, e.target.value)} className="flex-1 border border-[#E8E0D5] bg-[#FEFCF9] px-3 py-1 font-sub font-normal text-[12px] text-warm-charcoal focus:outline-none focus:border-terracotta" />
                        <button onClick={() => removeArrayItem('included', i)} className="text-warm-charcoal hover:text-terracotta"><X size={12} /></button>
                      </div>
                    ))}
                    <button onClick={() => addArrayItem('included')} className="font-sub font-normal text-[11px] text-terracotta hover:underline">+ Add</button>
                  </div>
                  <div>
                    <label className="block font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5">Not Included</label>
                    {(formData.not_included || []).map((item: string, i: number) => (
                      <div key={i} className="flex gap-2 mb-1.5">
                        <input value={item} onChange={e => updateArrayField('not_included', i, e.target.value)} className="flex-1 border border-[#E8E0D5] bg-[#FEFCF9] px-3 py-1 font-sub font-normal text-[12px] text-warm-charcoal focus:outline-none focus:border-terracotta" />
                        <button onClick={() => removeArrayItem('not_included', i)} className="text-warm-charcoal hover:text-terracotta"><X size={12} /></button>
                      </div>
                    ))}
                    <button onClick={() => addArrayItem('not_included')} className="font-sub font-normal text-[11px] text-terracotta hover:underline">+ Add</button>
                  </div>
                </div>

                {/* Related Slugs */}
                <div>
                  <label className="block font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5">Related Add-On Slugs</label>
                  <p className="font-sub font-normal text-[11px] text-warm-charcoal/60 mb-2">Enter slugs of related add-ons (comma separated or one per line)</p>
                  <textarea
                    value={Array.isArray(formData.related_slugs) ? formData.related_slugs.join(', ') : formData.related_slugs || ''}
                    onChange={e => {
                      const value = e.target.value;
                      const slugs = value.split(/[,\n]/)
                        .map(s => s.trim())
                        .filter(s => s.length > 0);
                      setFormData({ ...formData, related_slugs: slugs });
                    }}
                    rows={3}
                    placeholder="hot-air-balloon, private-bush-dinner, photography-upgrade"
                    className="w-full border border-[#E8E0D5] bg-[#FEFCF9] px-3 py-2 font-sub font-normal text-[13px] text-warm-charcoal focus:outline-none focus:border-terracotta resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-[#E8E0D5]">
                  <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-terracotta text-warm-canvas font-sub font-normal text-[13px] uppercase tracking-[0.1em] hover:opacity-90">
                    <Check size={14} /> {editing ? 'Update' : 'Create'}
                  </button>
                  <button onClick={() => setShowForm(false)} className="px-6 py-2.5 border border-[#E8E0D5] font-sub font-normal text-[13px] text-warm-charcoal hover:bg-faded-sand/30">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addOns.map((addon: any) => (
            <div key={addon.id} className="bg-[#FFFFFF] border border-[#E8E0D5] overflow-hidden group">
              {/* Image Header */}
              <div className="relative h-[160px] bg-faded-sand/30 overflow-hidden">
                {addon.heroImages?.[0] && (
                  <img src={addon.heroImages[0]} alt={addon.name} className="w-full h-full object-cover" />
                )}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-0.5 bg-warm-charcoal/80 font-sub font-normal text-[10px] text-warm-canvas uppercase tracking-[0.1em]">
                    {addon.category}
                  </span>
                </div>
              </div>
              {/* Body */}
              <div className="p-5">
                <h3 className="font-display italic text-[18px] text-warm-charcoal">{addon.name}</h3>
                <p className="font-sub font-normal text-[12px] text-warm-charcoal mt-1 line-clamp-2">{addon.tagline}</p>

                <div className="flex flex-wrap gap-3 mt-3">
                  {addon.price && (
                    <div className="flex items-center gap-1">
                      <DollarSign size={12} className="text-gold" />
                      <span className="font-sub font-normal text-[12px] text-warm-charcoal">{addon.price}</span>
                    </div>
                  )}
                  {addon.duration && (
                    <div className="flex items-center gap-1">
                      <Clock size={12} className="text-gold" />
                      <span className="font-sub font-normal text-[12px] text-warm-charcoal">{addon.duration}</span>
                    </div>
                  )}
                  {addon.location && (
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="text-gold" />
                      <span className="font-sub font-normal text-[12px] text-warm-charcoal">{addon.location}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4 pt-3 border-t border-[#E8E0D5]">
                  <button onClick={() => openEdit(addon)} className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E8E0D5] font-sub font-normal text-[11px] text-warm-charcoal hover:bg-faded-sand/30">
                    <Pencil size={12} /> Edit
                  </button>
                  {deleteConfirm === addon.id ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleDelete(addon.id)} className="px-3 py-1.5 bg-red-600 text-white font-sub font-normal text-[11px] hover:opacity-90">Confirm</button>
                      <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1.5 border border-[#E8E0D5] font-sub font-normal text-[11px] text-warm-charcoal">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(addon.id)} className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E8E0D5] font-sub font-normal text-[11px] text-red-600 hover:bg-red-50">
                      <Trash2 size={12} /> Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {addOns.length === 0 && (
          <div className="text-center py-16">
            <p className="font-sub font-normal text-[14px] text-warm-charcoal">No add-ons yet.</p>
            <button onClick={openCreate} className="mt-4 px-6 py-2.5 bg-terracotta text-warm-canvas font-sub font-normal text-[13px] uppercase tracking-[0.1em] hover:opacity-90">
              Create First Add-On
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
