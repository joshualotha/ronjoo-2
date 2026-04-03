import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, Upload } from 'lucide-react';
import AdminTopBar from '../components/AdminTopBar';
import { useAdminCrud } from '../hooks/useAdminCrud';
import { travelGuidesApi } from '../../services/adminApi';

const resourceCategories = ['Planning', 'Practical', 'Before You Go', 'On Safari', 'People & Culture', 'Specialist Guides'];
const guideTypes = [
  { label: 'Standard', value: 'standard' },
  { label: 'Comprehensive', value: 'comprehensive' },
  { label: 'Checklist', value: 'checklist' },
  { label: 'Interactive', value: 'interactive' },
  { label: 'Comparison', value: 'comparison' },
];

interface Resource {
  id: string;
  title: string;
  slug: string;
  category: string;
  guideType: string;
  readTime: string;
  status: 'published' | 'draft';
  updatedDate: string;
}

interface ResourceForm {
  title: string;
  slug: string;
  category: string;
  guideType: string;
  readTime: string;
  status: 'published' | 'draft';
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  checklistItems: string[];
}

const mockResources: Resource[] = [
  { id: '1', title: 'Safari Packing Guide', slug: 'safari-packing-guide', category: 'Before You Go', guideType: 'Checklist', readTime: '8 min', status: 'published', updatedDate: '2026-03-01' },
  { id: '2', title: 'Best Time to Visit Tanzania', slug: 'best-time-to-visit', category: 'Before You Go', guideType: 'Standard Article', readTime: '12 min', status: 'published', updatedDate: '2026-02-15' },
  { id: '3', title: 'Health & Vaccinations', slug: 'health-vaccinations', category: 'Before You Go', guideType: 'Standard Article', readTime: '10 min', status: 'published', updatedDate: '2026-01-20' },
  { id: '4', title: 'Money, Currency & Tipping', slug: 'money-currency-tipping', category: 'On Safari', guideType: 'Standard Article', readTime: '6 min', status: 'published', updatedDate: '2026-02-10' },
  { id: '5', title: 'Swahili Phrases for Travelers', slug: 'swahili-phrases', category: 'People & Culture', guideType: 'Interactive', readTime: '5 min', status: 'published', updatedDate: '2026-01-05' },
  { id: '6', title: 'Photography on Safari', slug: 'photography-safari-guide', category: 'Specialist Guides', guideType: 'Standard Article', readTime: '15 min', status: 'draft', updatedDate: '2026-03-05' },
];

const emptyForm: ResourceForm = {
  title: '', slug: '', category: 'Before You Go', guideType: 'Standard Article', readTime: '',
  status: 'draft', content: '', excerpt: '', metaTitle: '', metaDescription: '', checklistItems: ['']
};

export default function AdminResources() {
  const { items: resources, isLoading, create, update, remove } = useAdminCrud('travel-guides', travelGuidesApi);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<ResourceForm>({ ...emptyForm });
  const [isHydrating, setIsHydrating] = useState(false);

  const filtered = resources.filter((r: any) => {
    const matchSearch = !search || (r.title || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'all' || r.category === catFilter;
    return matchSearch && matchCat;
  });

  const updateForm = (key: keyof ResourceForm, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const blocksToText = (content: any) => {
    if (!Array.isArray(content)) return '';
    return content
      .map((b) => (b?.text ?? b?.body ?? ''))
      .map((t: string) => String(t ?? '').trim())
      .filter(Boolean)
      .join('\n\n');
  };

  const textToBlocks = (text: string) => {
    const parts = String(text ?? '')
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    return parts.map((p) => ({ type: 'text', body: p }));
  };

  const openEditor = async (resource?: any) => {
    if (resource) {
      setIsHydrating(true);
      try {
        const full = await travelGuidesApi.show(resource.id);
        const gt = (full as any).guideType ?? (full as any).guide_type ?? emptyForm.guideType;
        setForm({
          ...emptyForm,
          title: (full as any).title ?? '',
          slug: (full as any).slug ?? '',
          category: (full as any).category ?? emptyForm.category,
          guideType: gt,
          readTime: (full as any).readTime ?? '',
          status: ((full as any).status ?? 'draft') as any,
          content: blocksToText((full as any).content),
          excerpt: (full as any).excerpt ?? '',
          metaTitle: (full as any).metaTitle ?? '',
          metaDescription: (full as any).metaDescription ?? '',
          checklistItems: Array.isArray((full as any).checklistItems) && (full as any).checklistItems.length ? (full as any).checklistItems : [''],
        });
        setEditing(String((full as any).id ?? resource.id));
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
      const payload: any = {
        title: form.title,
        slug: slugify(form.slug || form.title),
        category: form.category,
        guideType: form.guideType,
        readTime: form.readTime || '5 min read',
        status: form.status,
        content: textToBlocks(form.content),
        excerpt: form.excerpt,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        checklistItems: (form.checklistItems ?? []).filter((v) => String(v ?? '').trim() !== ''),
      };

      if (editing) await update(editing, payload);
      else await create(payload as any);

      closeEditor();
    } catch (e: any) {
      const msg = e?.message || 'Failed to save travel resource';
      const details =
        e?.errors ? '\n\n' + JSON.stringify(e.errors, null, 2) : '';
      alert(msg + details);
    }
  };

  if (isHydrating) {
    return (
      <div>
        <AdminTopBar title="Travel Resources" />
        <div className="p-8">
          <p className="font-sub font-normal text-[13px] text-warm-charcoal">Loading resource details…</p>
        </div>
      </div>
    );
  }

  if (editing || creating) {
    return (
      <div>
        <AdminTopBar title={editing ? 'Edit Resource' : 'New Resource'} />
        <div className="p-8">
          <div className="grid grid-cols-[1fr_300px] gap-6">
            <div className="space-y-5">
              <input value={form.title} onChange={e => { updateForm('title', e.target.value); if (!editing) updateForm('slug', e.target.value.toLowerCase().replace(/\s+/g, '-')); }} className="w-full h-[56px] px-4 font-display italic text-[28px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="Resource title..." />

              <div className="bg-[#FFFFFF] border border-[#E8E0D5]">
                <div className="flex items-center gap-1 px-3 py-2 border-b border-[#E8E0D5]">
                  {['H2', 'H3', 'B', 'I', 'Quote', 'UL', 'OL', 'Link', 'Image', 'Info Box', 'Checklist', 'Table'].map(btn => (
                    <button key={btn} className="px-2.5 py-1.5 font-sub font-normal text-[11px] text-warm-charcoal hover:bg-faded-sand/30 hover:text-warm-charcoal transition-colors">{btn}</button>
                  ))}
                </div>
                <textarea value={form.content} onChange={e => updateForm('content', e.target.value)} rows={18} className="w-full px-6 py-4 font-sub font-normal text-[15px] text-warm-charcoal outline-none resize-none leading-relaxed" placeholder="Write your resource content..." />
              </div>

              {form.guideType === 'Checklist' && (
                <div className="bg-[#FFFFFF] border border-[#E8E0D5] p-5">
                  <h4 className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-3">Checklist Items</h4>
                  {form.checklistItems.map((item, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <div className="w-4 h-4 border border-[#E8E0D5] mt-2.5 flex-shrink-0" />
                      <input value={item} onChange={e => { const items = [...form.checklistItems]; items[i] = e.target.value; updateForm('checklistItems', items); }} className="flex-1 h-[38px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="Checklist item" />
                      <button onClick={() => updateForm('checklistItems', form.checklistItems.filter((_, j) => j !== i))} className="p-2 text-warm-charcoal hover:text-terracotta"><Trash2 size={14} /></button>
                    </div>
                  ))}
                  <button onClick={() => updateForm('checklistItems', [...form.checklistItems, ''])} className="font-sub font-normal text-[12px] text-terracotta hover:underline">+ Add Item</button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-[#FFFFFF] border border-[#E8E0D5] p-5 space-y-4">
                <h4 className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Settings</h4>
                <div>
                  <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Slug</label>
                  <input value={form.slug} onChange={e => updateForm('slug', e.target.value)} className="w-full h-[36px] px-3 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta font-mono" />
                </div>
                <div>
                  <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Category</label>
                  <select value={form.category} onChange={e => updateForm('category', e.target.value)} className="w-full h-[36px] px-3 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta">
                    {resourceCategories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Guide Type</label>
                  <select value={form.guideType} onChange={e => updateForm('guideType', e.target.value)} className="w-full h-[36px] px-3 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta">
                    {guideTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Read Time</label>
                  <input value={form.readTime} onChange={e => updateForm('readTime', e.target.value)} className="w-full h-[36px] px-3 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="e.g. 8 min" />
                </div>
                <div>
                  <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Featured Image</label>
                  <div className="border-2 border-dashed border-[#E8E0D5] p-6 text-center hover:border-terracotta transition-colors cursor-pointer">
                    <Upload size={18} className="mx-auto text-warm-charcoal mb-1" />
                    <p className="font-sub font-normal text-[11px] text-warm-charcoal">Upload image</p>
                  </div>
                </div>
                <div>
                  <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Status</label>
                  <select value={form.status} onChange={e => updateForm('status', e.target.value as any)} className="w-full h-[36px] px-3 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
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
      <AdminTopBar title="Travel Resources" />
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {['all', ...resourceCategories].map(c => (
              <button key={c} onClick={() => setCatFilter(c)} className={`px-4 py-2 font-sub font-normal text-[12px] uppercase tracking-[0.1em] border transition-colors ${catFilter === c ? 'bg-warm-charcoal text-warm-canvas border-warm-charcoal' : 'border-[#E8E0D5] text-warm-charcoal hover:border-terracotta'}`}>{c === 'all' ? 'All' : c}</button>
            ))}
          </div>
          <button onClick={() => openEditor()} className="flex items-center gap-2 px-4 py-2.5 bg-terracotta text-warm-canvas font-sub font-normal text-[13px] uppercase tracking-[0.1em] hover:opacity-90">
            <Plus size={14} /> New Resource
          </button>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E8E0D5] p-4 mb-4">
          <div className="relative max-w-[300px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-charcoal" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search resources..." className="w-full h-9 pl-9 pr-4 font-sub font-normal text-[13px] text-warm-charcoal bg-transparent border border-[#E8E0D5] outline-none focus:border-terracotta placeholder:text-[#B5A998]" />
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E8E0D5]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E0D5]">
                {['Title', 'Category', 'Type', 'Read Time', 'Updated', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.1em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-[#E8E0D5]/50 hover:bg-[#FBF8F3] transition-colors">
                  <td className="px-4 py-3 font-sub font-normal text-[14px] text-warm-charcoal">{r.title}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-faded-sand/50 font-sub font-normal text-[11px] text-warm-charcoal">{r.category}</span></td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 border border-gold/30 font-sub font-normal text-[10px] text-gold uppercase tracking-[0.1em]">{r.guideType}</span></td>
                  <td className="px-4 py-3 font-sub font-normal text-[13px] text-warm-charcoal">{r.readTime}</td>
                  <td className="px-4 py-3 font-sub font-normal text-[13px] text-warm-charcoal">{new Date(r.updatedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 font-sub font-normal text-[10px] uppercase tracking-[0.1em] ${r.status === 'published' ? 'bg-sage text-warm-canvas' : 'bg-muted text-warm-charcoal'}`}>{r.status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEditor(r)} className="p-1.5 text-warm-charcoal hover:text-warm-charcoal transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => remove(r.id)} className="p-1.5 text-warm-charcoal hover:text-terracotta transition-colors"><Trash2 size={14} /></button>
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
