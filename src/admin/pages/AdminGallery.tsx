import { useMemo, useState } from 'react';
import { Upload, Search, Pencil, Trash2, X, Grid, List, Plus } from 'lucide-react';
import AdminTopBar from '../components/AdminTopBar';
import { useAdminCrud } from '../hooks/useAdminCrud';
import { galleryImagesApi, uploadImages } from '../../services/adminApi';
import { Loader2 } from 'lucide-react';

interface GalleryImage {
  id: string | number;
  src: string;
  alt: string;
  caption: string;
  tags: string[];
  category: string;
  destination: string;
  safari: string;
  createdAt?: string;
}

const categories = ['All', 'Safaris', 'Destinations', 'Wildlife', 'Accommodation', 'Team'];

export default function AdminGallery() {
  const { items, isLoading, create, update, remove, refetch } = useAdminCrud('gallery-images', galleryImagesApi);
  const images = Array.isArray(items) ? items : ((items as any)?.data ?? []);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = async (files: File[]) => {
    if (!files.length) return;
    setIsUploading(true);
    try {
      // Step 1: Upload to storage
      const urls = await uploadImages(files, 'gallery');

      // Step 2: Create local gallery entries for each URL
      for (const url of urls) {
        await create({
          src: url,
          alt: '',
          caption: '',
          tags: [],
          category: 'All',
        } as any);
      }
      await refetch();
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<any>({
    src: '',
    alt: '',
    caption: '',
    tagsText: '',
    category: '',
    destination: '',
    safari: '',
  });

  const filtered = useMemo(() => {
    return (images as any[]).filter((img: any) => {
      const tags = Array.isArray(img.tags) ? img.tags : [];
      const matchSearch =
        !search ||
        (String(img.alt || '').toLowerCase().includes(search.toLowerCase())) ||
        tags.some((t: string) => String(t).toLowerCase().includes(search.toLowerCase()));
      const matchCat = catFilter === 'All' || img.category === catFilter;
      return matchSearch && matchCat;
    });
  }, [catFilter, images, search]);

  const toggleSelect = (id: string | number) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const bulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} images?`)) return;
    for (const id of selectedIds) {
      // best-effort; keep going
      try { await remove(id as any); } catch { /* ignore */ }
    }
    setSelectedIds([]);
    await refetch();
  };

  const deleteImage = async (id: string | number) => {
    if (!confirm('Delete this image?')) return;
    await remove(id as any);
    if (selectedImage?.id === id) setSelectedImage(null);
    await refetch();
  };

  const updateImage = async (updates: Partial<GalleryImage>) => {
    if (!selectedImage) return;
    const updated = { ...selectedImage, ...updates };
    setSelectedImage(updated);
    await update(updated.id as any, updated as any);
    await refetch();
  };

  return (
    <div>
      <AdminTopBar title="Gallery" />
      <div className="p-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {categories.map(c => (
              <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-1.5 font-sub font-normal text-[11px] uppercase tracking-[0.1em] border transition-colors ${catFilter === c ? 'bg-warm-charcoal text-warm-canvas border-warm-charcoal' : 'border-[#E8E0D5] text-warm-charcoal hover:border-terracotta'}`}>{c}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} className="p-2 border border-[#E8E0D5] text-warm-charcoal hover:text-warm-charcoal transition-colors">
              {viewMode === 'grid' ? <List size={14} /> : <Grid size={14} />}
            </button>
            <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-terracotta text-warm-canvas font-sub font-normal text-[13px] uppercase tracking-[0.1em] hover:opacity-90">
              <Plus size={14} /> Add Image
            </button>
            <label className={`flex items-center gap-2 px-4 py-2 ${isUploading ? 'bg-terracotta/50 cursor-wait' : 'bg-terracotta cursor-pointer hover:opacity-90'} text-warm-canvas font-sub font-normal text-[13px] uppercase tracking-[0.1em]`}>
              {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} 
              {isUploading ? 'Uploading...' : 'Upload Images'}
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                disabled={isUploading}
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  handleFiles(files);
                  e.target.value = ''; // Reset input
                }}
              />
            </label>
          </div>
        </div>

        {/* Search */}
        <div className="bg-[#FFFFFF] border border-[#E8E0D5] p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="relative max-w-[300px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-charcoal" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by tag or caption..." className="w-full h-9 pl-9 pr-4 font-sub font-normal text-[13px] text-warm-charcoal bg-transparent border border-[#E8E0D5] outline-none focus:border-terracotta placeholder:text-[#B5A998]" />
            </div>
            <p className="font-sub font-normal text-[12px] text-warm-charcoal">{filtered.length} images</p>
          </div>
        </div>

        {/* Bulk actions */}
        {selectedIds.length > 0 && (
          <div className="bg-warm-charcoal text-warm-canvas px-4 py-3 mb-4 flex items-center justify-between">
            <span className="font-sub font-normal text-[13px]">{selectedIds.length} selected</span>
            <div className="flex gap-2">
              <button onClick={bulkDelete} className="px-3 py-1.5 bg-terracotta text-warm-canvas font-sub font-normal text-[11px] uppercase tracking-[0.1em]">Delete Selected</button>
              <button onClick={() => setSelectedIds([])} className="px-3 py-1.5 border border-warm-canvas/30 text-warm-canvas font-sub font-normal text-[11px] uppercase tracking-[0.1em]">Deselect</button>
            </div>
          </div>
        )}

        <div className="flex gap-6">
          {/* Image Grid */}
          <div className="flex-1">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filtered.map(img => (
                  <div key={img.id} className="relative group cursor-pointer bg-[#FFFFFF] border border-[#E8E0D5]" onClick={() => setSelectedImage(img)}>
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute inset-0 bg-warm-charcoal/0 group-hover:bg-warm-charcoal/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Pencil size={18} className="text-warm-canvas" />
                    </div>
                    <div className="absolute top-2 left-2" onClick={e => { e.stopPropagation(); toggleSelect(img.id); }}>
                      <div className={`w-5 h-5 border-2 flex items-center justify-center ${selectedIds.includes(img.id) ? 'bg-terracotta border-terracotta' : 'border-warm-canvas/60 bg-warm-charcoal/20'}`}>
                        {selectedIds.includes(img.id) && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#F5EFE0" strokeWidth="1.5" /></svg>}
                      </div>
                    </div>
                    <div className="p-2">
                      <p className="font-sub font-normal text-[11px] text-warm-charcoal truncate">{img.alt}</p>
                      <span className="font-sub font-normal text-[10px] text-warm-charcoal">{img.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#FFFFFF] border border-[#E8E0D5]">
                {filtered.map(img => (
                  <div key={img.id} className="flex items-center gap-4 px-4 py-3 border-b border-[#E8E0D5]/50 hover:bg-[#FBF8F3] cursor-pointer transition-colors" onClick={() => setSelectedImage(img)}>
                    <div className="w-16 h-12 overflow-hidden flex-shrink-0"><img src={img.src} alt={img.alt} className="w-full h-full object-cover" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sub font-normal text-[13px] text-warm-charcoal truncate">{img.alt}</p>
                      <p className="font-sub font-normal text-[11px] text-warm-charcoal">{img.caption}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-faded-sand/50 font-sub font-normal text-[10px] text-warm-charcoal flex-shrink-0">{img.category}</span>
                    <span className="font-sub font-normal text-[11px] text-warm-charcoal flex-shrink-0">{img.size}</span>
                    <button onClick={e => { e.stopPropagation(); deleteImage(img.id); }} className="p-1.5 text-warm-charcoal hover:text-terracotta"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload drop zone */}
            <div 
              className={`mt-6 border-2 border-dashed ${isDragging ? 'border-terracotta bg-terracotta/5' : 'border-[#E8E0D5]'} p-12 text-center hover:border-terracotta transition-all cursor-pointer relative`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                handleFiles(files);
              }}
            >
              {isUploading && (
                <div className="absolute inset-0 bg-warm-canvas/60 z-10 flex flex-col items-center justify-center">
                  <Loader2 className="animate-spin text-terracotta mb-2" size={32} />
                  <p className="font-sub font-normal text-[12px] text-warm-charcoal uppercase tracking-widest">Processing Uploads...</p>
                </div>
              )}
              <Upload size={32} className={`mx-auto mb-3 transition-colors ${isDragging ? 'text-terracotta' : 'text-warm-charcoal'}`} />
              <p className="font-sub font-normal text-[14px] text-warm-charcoal">Drop images here to upload</p>
              <p className="font-sub font-normal text-[12px] text-warm-charcoal mt-1">JPG, PNG, WebP, max 5MB per file</p>
            </div>
          </div>

          {/* Detail Panel */}
          {selectedImage && (
            <div className="w-[320px] bg-[#FFFFFF] border border-[#E8E0D5] flex-shrink-0 self-start sticky top-[80px]">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8E0D5]">
                <h4 className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Image Details</h4>
                <button onClick={() => setSelectedImage(null)} className="text-warm-charcoal hover:text-warm-charcoal"><X size={16} /></button>
              </div>
              <div className="p-4">
                <img src={selectedImage.src} alt={selectedImage.alt} className="w-full aspect-[4/3] object-cover mb-4" />
                <div className="space-y-3">
                    <div className="flex justify-between text-[11px] font-sub font-normal text-warm-charcoal">
                      <span>{selectedImage.category || '—'}</span>
                      <span>{selectedImage.destination || '—'}</span>
                      <span>{selectedImage.createdAt ? new Date(selectedImage.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}</span>
                    </div>
                  <div>
                    <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Alt Text (SEO)</label>
                    <input value={selectedImage.alt} onChange={e => updateImage({ alt: e.target.value })} className="w-full h-[36px] px-3 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" />
                  </div>
                  <div>
                    <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Caption</label>
                    <textarea value={selectedImage.caption} onChange={e => updateImage({ caption: e.target.value })} rows={2} className="w-full px-3 py-2 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta resize-none" />
                  </div>
                  <div>
                    <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Category</label>
                    <select value={selectedImage.category} onChange={e => updateImage({ category: e.target.value })} className="w-full h-[36px] px-3 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta">
                      {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Tags</label>
                    <input value={selectedImage.tags.join(', ')} onChange={e => updateImage({ tags: e.target.value.split(',').map(t => t.trim()) })} className="w-full h-[36px] px-3 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="Comma-separated" />
                  </div>
                  <div>
                    <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Destination</label>
                    <input value={selectedImage.destination} onChange={e => updateImage({ destination: e.target.value })} className="w-full h-[36px] px-3 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" />
                  </div>
                  <div>
                    <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Safari</label>
                    <input value={selectedImage.safari} onChange={e => updateImage({ safari: e.target.value })} className="w-full h-[36px] px-3 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 py-2 border border-[#E8E0D5] text-warm-charcoal font-sub font-normal text-[11px] uppercase tracking-[0.1em] hover:border-warm-charcoal hover:text-warm-charcoal transition-colors">Replace</button>
                    <button onClick={() => deleteImage(selectedImage.id)} className="py-2 px-4 bg-terracotta text-warm-canvas font-sub font-normal text-[11px] uppercase tracking-[0.1em] hover:opacity-90">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] w-full max-w-[640px] p-6 border border-[#E8E0D5]">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-display italic text-[20px] text-warm-charcoal">Add Gallery Image</h4>
              <button onClick={() => setShowCreate(false)} className="text-warm-charcoal hover:text-warm-charcoal">
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Image URL *</label>
                <input value={createForm.src} onChange={e => setCreateForm({ ...createForm, src: e.target.value })} className="w-full h-[38px] px-3 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="https://..." />
              </div>
              <div className="col-span-2">
                <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Alt Text</label>
                <input value={createForm.alt} onChange={e => setCreateForm({ ...createForm, alt: e.target.value })} className="w-full h-[38px] px-3 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>
              <div className="col-span-2">
                <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Caption</label>
                <textarea value={createForm.caption} onChange={e => setCreateForm({ ...createForm, caption: e.target.value })} rows={2} className="w-full px-3 py-2 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta resize-none" />
              </div>
              <div className="col-span-2">
                <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Tags (comma-separated)</label>
                <input value={createForm.tagsText} onChange={e => setCreateForm({ ...createForm, tagsText: e.target.value })} className="w-full h-[38px] px-3 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>
              <div>
                <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Category</label>
                <input value={createForm.category} onChange={e => setCreateForm({ ...createForm, category: e.target.value })} className="w-full h-[38px] px-3 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>
              <div>
                <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Destination</label>
                <input value={createForm.destination} onChange={e => setCreateForm({ ...createForm, destination: e.target.value })} className="w-full h-[38px] px-3 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>
              <div className="col-span-2">
                <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Safari</label>
                <input value={createForm.safari} onChange={e => setCreateForm({ ...createForm, safari: e.target.value })} className="w-full h-[38px] px-3 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 border border-[#E8E0D5] text-warm-charcoal hover:text-warm-charcoal">
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!createForm.src?.trim()) return alert('Image URL is required');
                  const tags = String(createForm.tagsText || '')
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean);
                  await create({
                    src: createForm.src,
                    alt: createForm.alt || null,
                    caption: createForm.caption || null,
                    tags,
                    category: createForm.category || null,
                    destination: createForm.destination || null,
                    safari: createForm.safari || null,
                  } as any);
                  setShowCreate(false);
                  setCreateForm({ src: '', alt: '', caption: '', tagsText: '', category: '', destination: '', safari: '' });
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
