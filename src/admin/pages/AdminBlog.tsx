import { useState, useRef } from 'react';
import { Plus, Search, Eye, Pencil, Trash2, Upload, X } from 'lucide-react';
import AdminTopBar from '../components/AdminTopBar';
import ModernRichTextEditor from '../components/ModernRichTextEditor';
import { useAdminCrud } from '../hooks/useAdminCrud';
import { blogPostsApi, uploadImages } from '../../services/adminApi';

const statusColors: Record<string, string> = {
  published: 'bg-sage text-warm-canvas',
  draft: 'bg-muted text-warm-charcoal',
  scheduled: 'bg-gold text-warm-canvas',
};

const categories = ['Wildlife & Nature', 'Safari Planning', 'Destination Guide', 'Kilimanjaro', 'Culture & People', 'Sustainability', 'Photo Journal'];

interface PostForm {
  title: string;
  slug: string;
  category: string;
  author: string;
  status: 'published' | 'draft' | 'scheduled';
  content: string;
  excerpt: string;
  tags: string;
  metaTitle: string;
  metaDescription: string;
  relatedSafari: string;
  relatedDestination: string;
  showCta: boolean;
  featuredImage: string;
}

const emptyForm: PostForm = {
  title: '', slug: '', category: 'Safari Planning', author: 'Safari Team', status: 'draft',
  content: '', excerpt: '', tags: '', metaTitle: '', metaDescription: '',
  relatedSafari: '', relatedDestination: '', showCta: true,
  featuredImage: ''
};

export default function AdminBlog() {
  const { items: posts, isLoading, create, update, remove } = useAdminCrud('blog-posts', blogPostsApi);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<PostForm>({ ...emptyForm });
  const [isHydrating, setIsHydrating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = posts.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateForm = (key: keyof PostForm, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const openEditor = async (post?: any) => {
    if (post) {
      setIsHydrating(true);
      try {
        const full = await blogPostsApi.show(post.id);
        const tagsValue = (full as any).tags;
        const tagsString = Array.isArray(tagsValue) ? tagsValue.join(', ') : (tagsValue ?? '');
        setForm({
          ...emptyForm,
          title: (full as any).title ?? '',
          slug: (full as any).slug ?? '',
          category: (full as any).category ?? emptyForm.category,
          author: (full as any).author ?? emptyForm.author,
          status: ((full as any).status ?? 'draft') as any,
          content: (full as any).content ?? '',
          excerpt: (full as any).excerpt ?? '',
          tags: tagsString,
          metaTitle: (full as any).metaTitle ?? '',
          metaDescription: (full as any).metaDescription ?? '',
          relatedSafari: (full as any).relatedSafari ?? '',
          relatedDestination: (full as any).relatedDestination ?? '',
          showCta: !!(full as any).showCta,
          featuredImage: (full as any).featured_image ?? '',
        });
        setEditing(String((full as any).id ?? post.id));
      } finally {
        setIsHydrating(false);
      }
    } else {
      setForm({ ...emptyForm });
      setCreating(true);
    }
  };

  const closeEditor = () => { setEditing(null); setCreating(false); };

  const slugify = (input: string) =>
    String(input ?? '')
      .trim()
      .toLowerCase()
      .replace(/['"]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const handleSave = async () => {
    try {
      // Ensure tags is a comma-separated string, not an array
      const tagsValue = form.tags;
      const tagsString = Array.isArray(tagsValue) ? tagsValue.join(', ') : (typeof tagsValue === 'string' ? tagsValue : '');
      
      const payload: any = {
        title: form.title,
        slug: slugify(form.slug || form.title),
        category: form.category,
        author: form.author,
        status: form.status,
        content: form.content,
        excerpt: form.excerpt,
        tags: tagsString,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        relatedSafari: form.relatedSafari,
        relatedDestination: form.relatedDestination,
        showCta: form.showCta,
        featured_image: form.featuredImage,
      };

      if (form.status === 'published') {
        payload.publishedDate = new Date().toISOString().split('T')[0];
      }

      if (editing) await update(editing, payload);
      else await create(payload);

      closeEditor();
    } catch (e: any) {
      const msg = e?.message || 'Failed to save blog post';
      const details =
        e?.errors ? '\n\n' + JSON.stringify(e.errors, null, 2) : '';
      alert(msg + details);
    }
  };

  if (isHydrating) {
    return (
      <div>
        <AdminTopBar title="Blog & Guides" />
        <div className="p-8">
          <p className="font-sub font-normal text-[13px] text-warm-charcoal">Loading post details…</p>
        </div>
      </div>
    );
  }

  if (editing || creating) {
    return (
      <div>
        <AdminTopBar title={editing ? 'Edit Post' : 'New Post'} />
        <div className="p-8">
          <div className="grid grid-cols-[1fr_320px] gap-6">
            {/* Main editor */}
            <div className="space-y-5">
              <input value={form.title} onChange={e => { updateForm('title', e.target.value); if (!editing) updateForm('slug', e.target.value.toLowerCase().replace(/\s+/g, '-')); }} className="w-full h-[56px] px-4 font-display italic text-[28px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="Post title..." />

              <div className="bg-[#FFFFFF]">
                <ModernRichTextEditor 
                  value={form.content} 
                  onChange={val => updateForm('content', val)} 
                  placeholder="Share your stories..."
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-[#FFFFFF] border border-[#E8E0D5] p-5 space-y-4">
                <h4 className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Document Settings</h4>
                <div>
                  <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Slug</label>
                  <input value={form.slug} onChange={e => updateForm('slug', e.target.value)} className="w-full h-[36px] px-3 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta font-mono" />
                </div>
                <div>
                  <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Category</label>
                  <select value={form.category} onChange={e => updateForm('category', e.target.value)} className="w-full h-[36px] px-3 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta">
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Author</label>
                  <input value={form.author} onChange={e => updateForm('author', e.target.value)} className="w-full h-[36px] px-3 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" />
                </div>
                <div>
                  <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Tags</label>
                  <input value={form.tags} onChange={e => updateForm('tags', e.target.value)} className="w-full h-[36px] px-3 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="Comma separated" />
                </div>
                <div>
                  <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Featured Image</label>
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
                        const urls = await uploadImages(files, 'blog');
                        if (urls.length > 0) {
                          updateForm('featuredImage', urls[0]);
                        }
                      } catch (err) {
                        alert('Upload failed: ' + (err as Error).message);
                      } finally {
                        setIsUploading(false);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }
                    }}
                  />
                  {form.featuredImage ? (
                    <div className="relative group">
                      <img src={form.featuredImage} alt="Featured" className="w-full h-48 object-cover border border-[#E8E0D5]" />
                      <button
                        type="button"
                        onClick={() => updateForm('featuredImage', '')}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#E8E0D5] p-6 text-center hover:border-terracotta transition-colors cursor-pointer"
                    >
                      {isUploading ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-terracotta mb-1"></div>
                          <p className="font-sub font-normal text-[11px] text-warm-charcoal">Uploading...</p>
                        </div>
                      ) : (
                        <>
                          <Upload size={18} className="mx-auto text-warm-charcoal mb-1" />
                          <p className="font-sub font-normal text-[11px] text-warm-charcoal">Upload image</p>
                        </>
                      )}
                    </div>
                  )}
                  {form.featuredImage && (
                    <p className="font-sub font-normal text-[10px] text-warm-charcoal mt-1 truncate">
                      {form.featuredImage.split('/').pop()}
                    </p>
                  )}
                </div>
                <div>
                  <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Status</label>
                  <select value={form.status} onChange={e => updateForm('status', e.target.value)} className="w-full h-[36px] px-3 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E8E0D5] p-5 space-y-4">
                <h4 className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">SEO</h4>
                <div>
                  <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Meta Title</label>
                  <input value={form.metaTitle} onChange={e => updateForm('metaTitle', e.target.value)} maxLength={60} className="w-full h-[36px] px-3 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" />
                  <p className="font-sub font-normal text-[10px] text-warm-charcoal mt-0.5">{form.metaTitle.length}/60</p>
                </div>
                <div>
                  <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Meta Description</label>
                  <textarea value={form.metaDescription} onChange={e => updateForm('metaDescription', e.target.value)} maxLength={160} rows={3} className="w-full px-3 py-2 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta resize-none" />
                  <p className="font-sub font-normal text-[10px] text-warm-charcoal mt-0.5">{form.metaDescription.length}/160</p>
                </div>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E8E0D5] p-5 space-y-4">
                <h4 className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Related Content</h4>
                <div>
                  <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Related Safari</label>
                  <input value={form.relatedSafari} onChange={e => updateForm('relatedSafari', e.target.value)} className="w-full h-[36px] px-3 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="Safari name" />
                </div>
                <div>
                  <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Related Destination</label>
                  <input value={form.relatedDestination} onChange={e => updateForm('relatedDestination', e.target.value)} className="w-full h-[36px] px-3 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="Destination name" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div onClick={() => updateForm('showCta', !form.showCta)} className={`w-4 h-4 border flex items-center justify-center ${form.showCta ? 'bg-terracotta border-terracotta' : 'border-[#E8E0D5]'}`}>
                    {form.showCta && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#F5EFE0" strokeWidth="1.5" /></svg>}
                  </div>
                  <span className="font-sub font-normal text-[11px] text-warm-charcoal">Show booking CTA in article</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button onClick={closeEditor} className="flex-1 py-2.5 border border-[#E8E0D5] text-warm-charcoal font-sub font-normal text-[12px] uppercase tracking-[0.1em] hover:border-warm-charcoal hover:text-warm-charcoal transition-colors">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-2.5 bg-terracotta text-warm-canvas font-sub font-normal text-[12px] uppercase tracking-[0.1em] hover:opacity-90">{form.status === 'published' ? 'Publish' : 'Save Draft'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminTopBar title="Blog & Guides" />
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {['all', 'published', 'draft', 'scheduled'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 font-sub font-normal text-[12px] uppercase tracking-[0.1em] border transition-colors ${statusFilter === s ? 'bg-warm-charcoal text-warm-canvas border-warm-charcoal' : 'border-[#E8E0D5] text-warm-charcoal hover:border-terracotta'}`}>{s}</button>
            ))}
          </div>
          <button onClick={() => openEditor()} className="flex items-center gap-2 px-4 py-2.5 bg-terracotta text-warm-canvas font-sub font-normal text-[13px] uppercase tracking-[0.1em] hover:opacity-90">
            <Plus size={14} /> New Post
          </button>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E8E0D5] p-4 mb-4">
          <div className="relative max-w-[300px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-charcoal" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts..." className="w-full h-9 pl-9 pr-4 font-sub font-normal text-[13px] text-warm-charcoal bg-transparent border border-[#E8E0D5] outline-none focus:border-terracotta placeholder:text-[#B5A998]" />
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E8E0D5]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E0D5]">
                {['Title', 'Category', 'Author', 'Published', 'Status', 'Views', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.1em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-[#E8E0D5]/50 hover:bg-[#FBF8F3] transition-colors">
                  <td className="px-4 py-3 font-sub font-normal text-[14px] text-warm-charcoal">{p.title}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-faded-sand/50 font-sub font-normal text-[11px] text-warm-charcoal">{p.category}</span></td>
                  <td className="px-4 py-3 font-sub font-normal text-[13px] text-warm-charcoal">{p.author}</td>
                  <td className="px-4 py-3 font-sub font-normal text-[13px] text-warm-charcoal">{p.publishedDate ? new Date(p.publishedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 font-sub font-normal text-[10px] uppercase tracking-[0.1em] ${statusColors[p.status]}`}>{p.status}</span></td>
                  <td className="px-4 py-3 font-sub font-normal text-[13px] text-warm-charcoal">{p.views.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEditor(p)} className="p-1.5 text-warm-charcoal hover:text-warm-charcoal transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => remove(p.id)} className="p-1.5 text-warm-charcoal hover:text-terracotta transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
