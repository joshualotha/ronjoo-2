import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, Upload, Eye, GripVertical, Loader2 } from 'lucide-react';
import AdminTopBar from '../components/AdminTopBar';
import { useAdminCrud } from '../hooks/useAdminCrud';
import { destinationsApi, uploadImages } from '../../services/adminApi';

interface Destination {
  id: string;
  name: string;
  slug: string;
  region: string;
  tagline: string;
  status: 'published' | 'draft';
  safariCount: number;
}

interface DestinationForm {
  name: string;
  slug: string;
  region: string;
  tagline: string;
  status: 'published' | 'draft';
  overview: string;
  pullQuote: string;
  heroImage: string;
  portraitImage: string;
  quickFacts: { label: string; value: string; icon: string }[];
  wildlife: { name: string; likelihood: string; fact: string; image: string }[];
  experiences: { title: string; description: string; tags: string }[];
  faqs: { question: string; answer: string }[];
  accommodations: { name: string; tier: string; stars: number; description: string; amenities: string; image: string }[];
  metaTitle: string;
  metaDescription: string;
}

const regions = ['Northern Circuit', 'Southern Circuit', 'Coast & Islands'];

const mockDestinations: Destination[] = [
  { id: '1', name: 'Serengeti National Park', slug: 'serengeti', region: 'Northern Circuit', tagline: 'The endless plains where the Great Migration unfolds', status: 'published', safariCount: 5 },
  { id: '2', name: 'Ngorongoro Crater', slug: 'ngorongoro', region: 'Northern Circuit', tagline: 'The world\'s largest intact volcanic caldera', status: 'published', safariCount: 4 },
  { id: '3', name: 'Tarangire National Park', slug: 'tarangire', region: 'Northern Circuit', tagline: 'Ancient baobabs and the greatest elephant gatherings', status: 'published', safariCount: 3 },
  { id: '4', name: 'Zanzibar', slug: 'zanzibar', region: 'Coast & Islands', tagline: 'Spice island paradise in the Indian Ocean', status: 'published', safariCount: 2 },
  { id: '5', name: 'Ruaha National Park', slug: 'ruaha', region: 'Southern Circuit', tagline: 'Wild, remote, and untouched wilderness', status: 'draft', safariCount: 1 },
  { id: '6', name: 'Lake Manyara', slug: 'lake-manyara', region: 'Northern Circuit', tagline: 'Tree-climbing lions and flamingo-lined shores', status: 'published', safariCount: 2 },
  { id: '7', name: 'Selous / Nyerere', slug: 'selous', region: 'Southern Circuit', tagline: 'Africa\'s largest game reserve', status: 'draft', safariCount: 1 },
];

const emptyForm: DestinationForm = {
  name: '', slug: '', region: 'Northern Circuit', tagline: '', status: 'draft', overview: '', pullQuote: '',
  heroImage: '', portraitImage: '',
  quickFacts: [{ label: 'Wildlife', value: '', icon: 'paw' }, { label: 'Best Season', value: '', icon: 'calendar' }, { label: 'Avg Temp', value: '', icon: 'thermometer' }],
  wildlife: [{ name: '', likelihood: 'Common', fact: '', image: '' }],
  experiences: [{ title: '', description: '', tags: '' }],
  faqs: [{ question: '', answer: '' }],
  accommodations: [{ name: '', tier: 'Luxury', stars: 5, description: '', amenities: '', image: '' }],
  metaTitle: '', metaDescription: ''
};

export default function AdminDestinations() {
  const { items: destinations, isLoading, create, update, remove } = useAdminCrud('destinations', destinationsApi);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [form, setForm] = useState<DestinationForm>({ ...emptyForm });
  const [isHydrating, setIsHydrating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const portraitImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const wildlifeImageInputRef = useRef<HTMLInputElement>(null);
  const accommodationImageInputRef = useRef<HTMLInputElement>(null);
  const currentWildlifeIndex = useRef<number | null>(null);
  const currentAccommodationIndex = useRef<number | null>(null);

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'content', label: 'Content' },
    { id: 'wildlife', label: 'Wildlife' },
    { id: 'experiences', label: 'Experiences' },
    { id: 'accommodation', label: 'Accommodation' },
    { id: 'faq', label: 'FAQ' },
    { id: 'seo', label: 'SEO' },
  ];

  const openEditor = async (dest?: any) => {
    if (dest) {
      setIsHydrating(true);
      try {
        const full = await destinationsApi.show(dest.id);
        const overviewArr = Array.isArray((full as any).overview) ? (full as any).overview : [];
        const overviewText = overviewArr.join('\n\n');
        const experiences = Array.isArray((full as any).experiences) ? (full as any).experiences : [];
        setForm({
          ...emptyForm,
          name: (full as any).name ?? '',
          slug: (full as any).slug ?? '',
          region: (full as any).region ?? 'Northern Circuit',
          tagline: (full as any).tagline ?? '',
          status: ((full as any).status ?? 'draft') as any,
          heroImage: (full as any).heroImage ?? '',
          portraitImage: (full as any).portraitImage ?? '',
          overview: overviewText,
          pullQuote: (full as any).pullQuote ?? '',
          quickFacts: (full as any).quickFacts?.map((f: any) => ({
            label: f.label ?? '',
            value: f.value ?? '',
            icon: f.icon ?? 'map-pin',
          })) ?? emptyForm.quickFacts,
          wildlife: (full as any).wildlife?.map((w: any) => ({
            name: w.name ?? '',
            likelihood: w.likelihood ?? 'Common',
            fact: w.fact ?? '',
            image: w.image ?? '',
          })) ?? emptyForm.wildlife,
          experiences: experiences.length
            ? experiences.map((e: any) => ({
              title: e.title ?? '',
              description: e.description ?? '',
              tags: Array.isArray(e.tags) ? e.tags.join(', ') : (e.tags ?? ''),
            }))
            : emptyForm.experiences,
          faqs: (full as any).faqs?.map((f: any) => ({
            question: f.question ?? '',
            answer: f.answer ?? '',
          })) ?? emptyForm.faqs,
          accommodations: (full as any).accommodations?.map((a: any) => ({
            name: a.name ?? '',
            tier: a.tier ?? 'Luxury',
            stars: a.stars ?? 5,
            description: a.description ?? '',
            amenities: Array.isArray(a.amenities) ? a.amenities.join(', ') : (a.amenities ?? ''),
            image: a.image ?? '',
          })) ?? emptyForm.accommodations,
          metaTitle: (full as any).metaTitle ?? '',
          metaDescription: (full as any).metaDescription ?? '',
        });
        setEditing(String((full as any).id ?? dest.id));
      } finally {
        setIsHydrating(false);
      }
    } else {
      setForm({ ...emptyForm });
      setCreating(true);
    }
    setActiveTab('basic');
  };

  const closeEditor = () => { setEditing(null); setCreating(false); };
  const updateForm = (key: keyof DestinationForm, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    try {
      const cleanQuickFacts = (form.quickFacts ?? [])
        .filter((f) => (f.label || '').trim() && (f.value || '').trim())
        .map(f => ({ ...f, icon: f.icon || 'map-pin' }));
      
      const cleanWildlife = (form.wildlife ?? [])
        .filter((w) => (w.name || '').trim())
        .map(w => ({ ...w, likelihood: w.likelihood || 'Common' }));
      
      const cleanExperiences = (form.experiences ?? [])
        .filter((e) => (e.title || '').trim())
        .map(e => ({
          ...e,
          tags: typeof e.tags === 'string' ? e.tags.split(',').map(s => s.trim()).filter(Boolean) : e.tags
        }));
      
      const cleanFaqs = (form.faqs ?? [])
        .filter((f) => (f.question || '').trim() && (f.answer || '').trim());
      
      const cleanAccommodations = (form.accommodations ?? [])
        .filter((a) => (a.name || '').trim())
        .map(acc => ({
          name: acc.name,
          tier: acc.tier || 'Luxury',
          stars: acc.stars || 5,
          description: acc.description || '',
          amenities: typeof acc.amenities === 'string' ? acc.amenities.split(',').map(s => s.trim()).filter(Boolean) : acc.amenities,
          image: acc.image || '',
        }));

      const payload = {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
        region: form.region,
        tagline: form.tagline,
        status: form.status,
        heroImage: form.heroImage,
        portraitImage: form.portraitImage,
        overview: form.overview.split('\n\n').filter(p => p.trim()),
        pullQuote: form.pullQuote,
        quickFacts: cleanQuickFacts,
        wildlife: cleanWildlife,
        experiences: cleanExperiences,
        faqs: cleanFaqs,
        accommodations: cleanAccommodations,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
      };

      if (editing) {
        await update(editing, payload);
      } else {
        await create(payload);
      }
      closeEditor();
    } catch (error) {
      console.error(error);
      alert('Save failed: ' + (error as any).message);
    }
  };

  const handleWildlifeImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || currentWildlifeIndex.current === null) return;
    setIsUploading(true);
    try {
      const urls = await uploadImages(files, 'destinations');
      if (urls.length > 0) {
        const wl = [...form.wildlife];
        wl[currentWildlifeIndex.current] = { ...wl[currentWildlifeIndex.current], image: urls[0] };
        updateForm('wildlife', wl);
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      setIsUploading(false);
      if (wildlifeImageInputRef.current) wildlifeImageInputRef.current.value = '';
    }
  };

  const handleAccommodationImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || currentAccommodationIndex.current === null) return;
    setIsUploading(true);
    try {
      const urls = await uploadImages(files, 'destinations');
      if (urls.length > 0) {
        const acc = [...form.accommodations];
        acc[currentAccommodationIndex.current] = { ...acc[currentAccommodationIndex.current], image: urls[0] };
        updateForm('accommodations', acc);
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      setIsUploading(false);
      if (accommodationImageInputRef.current) accommodationImageInputRef.current.value = '';
    }
  };

  if (isHydrating) {
    return (
      <div>
        <AdminTopBar title="Destinations" />
        <div className="p-8">
          <p className="font-sub font-normal text-[13px] text-warm-charcoal">Loading destination details…</p>
        </div>
      </div>
    );
  }

  if (editing || creating) {
    return (
      <div>
        <AdminTopBar title={editing ? `Edit: ${form.name}` : 'New Destination'} />
        <div className="p-8">
          <div className="flex gap-0 border-b border-[#E8E0D5] mb-6">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-5 py-3 font-sub font-normal text-[12px] uppercase tracking-[0.1em] border-b-2 transition-colors ${activeTab === t.id ? 'border-terracotta text-terracotta' : 'border-transparent text-warm-charcoal hover:text-warm-charcoal'}`}>{t.label}</button>
            ))}
          </div>

          <div className="bg-[#FFFFFF] border border-[#E8E0D5] p-8 max-w-[900px]">
            {activeTab === 'basic' && (
              <div className="space-y-5">
                <div>
                  <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5 block">Destination Name *</label>
                  <input value={form.name} onChange={e => { updateForm('name', e.target.value); if (!editing) updateForm('slug', e.target.value.toLowerCase().replace(/\s+/g, '-')); }} className="w-full h-[44px] px-4 font-sub font-normal text-[14px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" />
                </div>
                <div>
                  <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5 block">Slug</label>
                  <input value={form.slug} onChange={e => updateForm('slug', e.target.value)} className="w-full h-[44px] px-4 font-sub font-normal text-[14px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta font-mono" />
                </div>
                <div>
                  <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5 block">Region</label>
                  <select value={form.region} onChange={e => updateForm('region', e.target.value)} className="w-full h-[44px] px-4 font-sub font-normal text-[14px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta">
                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5 block">Tagline</label>
                  <input value={form.tagline} onChange={e => updateForm('tagline', e.target.value)} className="w-full h-[44px] px-4 font-sub font-normal text-[14px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="Short poetic line..." />
                </div>
                <div>
                  <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5 block">Hero Image</label>
                  <input
                    ref={heroImageInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length === 0) return;
                      setIsUploading(true);
                      try {
                        const urls = await uploadImages(files, 'destinations');
                        if (urls.length > 0) {
                          updateForm('heroImage', urls[0]);
                        }
                      } catch (err) {
                        alert('Upload failed: ' + (err as Error).message);
                      } finally {
                        setIsUploading(false);
                        if (heroImageInputRef.current) heroImageInputRef.current.value = '';
                      }
                    }}
                  />
                  {form.heroImage && (
                    <div className="mb-3 relative group w-full h-48 border border-[#E8E0D5] overflow-hidden">
                      <img src={form.heroImage} alt="Hero" className="w-full h-full object-cover" />
                      <button
                        onClick={() => updateForm('heroImage', '')}
                        className="absolute top-2 right-2 bg-[#1C1812]/70 text-warm-canvas p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                  <div
                    onClick={() => !isUploading && heroImageInputRef.current?.click()}
                    className={`border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${isUploading ? 'border-terracotta/50 bg-terracotta/5' : 'border-[#E8E0D5] hover:border-terracotta'
                      }`}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 size={24} className="mx-auto text-terracotta mb-2 animate-spin" />
                        <p className="font-sub font-normal text-[13px] text-terracotta">Uploading…</p>
                      </>
                    ) : form.heroImage ? (
                      <>
                        <Upload size={24} className="mx-auto text-warm-charcoal mb-2" />
                        <p className="font-sub font-normal text-[13px] text-warm-charcoal">Click to replace</p>
                      </>
                    ) : (
                      <>
                        <Upload size={24} className="mx-auto text-warm-charcoal mb-2" />
                        <p className="font-sub font-normal text-[13px] text-warm-charcoal">Drop image or click to upload</p>
                        <p className="font-sub font-normal text-[11px] text-warm-charcoal mt-1">JPG, PNG, WEBP — max 5 MB each</p>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5 block">Portrait Image (Mobile/Sidebar)</label>
                  <input
                    ref={portraitImageInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length === 0) return;
                      setIsUploading(true);
                      try {
                        const urls = await uploadImages(files, 'destinations');
                        if (urls.length > 0) {
                          updateForm('portraitImage', urls[0]);
                        }
                      } catch (err) {
                        alert('Upload failed: ' + (err as Error).message);
                      } finally {
                        setIsUploading(false);
                        if (portraitImageInputRef.current) portraitImageInputRef.current.value = '';
                      }
                    }}
                  />
                  {form.portraitImage && (
                    <div className="mb-3 relative group w-[240px] h-[320px] border border-[#E8E0D5] overflow-hidden">
                      <img src={form.portraitImage} alt="Portrait" className="w-full h-full object-cover" />
                      <button
                        onClick={() => updateForm('portraitImage', '')}
                        className="absolute top-2 right-2 bg-[#1C1812]/70 text-warm-canvas p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                  <div
                    onClick={() => !isUploading && portraitImageInputRef.current?.click()}
                    className={`border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${isUploading ? 'border-terracotta/50 bg-terracotta/5' : 'border-[#E8E0D5] hover:border-terracotta'
                      }`}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 size={24} className="mx-auto text-terracotta mb-2 animate-spin" />
                        <p className="font-sub font-normal text-[13px] text-terracotta">Uploading…</p>
                      </>
                    ) : form.portraitImage ? (
                      <>
                        <Upload size={24} className="mx-auto text-warm-charcoal mb-2" />
                        <p className="font-sub font-normal text-[13px] text-warm-charcoal">Click to replace</p>
                      </>
                    ) : (
                      <>
                        <Upload size={24} className="mx-auto text-warm-charcoal mb-2" />
                        <p className="font-sub font-normal text-[13px] text-warm-charcoal">Drop portrait image or click to upload</p>
                        <p className="font-sub font-normal text-[11px] text-warm-charcoal mt-1">Best for mobile/sidebar views</p>
                      </>
                    )}
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div onClick={() => updateForm('status', form.status === 'published' ? 'draft' : 'published')} className={`w-10 h-5 relative cursor-pointer ${form.status === 'published' ? 'bg-sage' : 'bg-faded-sand'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-[#FFFFFF] transition-all ${form.status === 'published' ? 'left-[22px]' : 'left-0.5'}`} />
                  </div>
                  <span className="font-sub font-normal text-[12px] text-warm-charcoal">Published</span>
                </label>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-5">
                <div>
                  <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5 block">Overview</label>
                  <textarea value={form.overview} onChange={e => updateForm('overview', e.target.value)} rows={10} className="w-full px-4 py-3 font-sub font-normal text-[14px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta resize-none" placeholder="Rich description of this destination..." />
                </div>
                <div>
                  <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5 block">Pull Quote</label>
                  <input value={form.pullQuote} onChange={e => updateForm('pullQuote', e.target.value)} className="w-full h-[44px] px-4 font-display italic text-[16px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="A memorable quote..." />
                </div>
                <div>
                  <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-2 block">Quick Facts</label>
                  {form.quickFacts.map((f, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                       <select value={f.icon} onChange={e => { const qf = [...form.quickFacts]; qf[i] = { ...qf[i], icon: e.target.value }; updateForm('quickFacts', qf); }} className="w-[120px] h-[38px] px-2 font-sub font-normal text-[12px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta">
                        <option value="paw">Paw (Wildlife)</option>
                        <option value="calendar">Calendar</option>
                        <option value="thermometer">Temp</option>
                        <option value="map-pin">Map Pin</option>
                        <option value="camera">Camera</option>
                        <option value="sun">Sun</option>
                        <option value="map">Map</option>
                      </select>
                      <input value={f.label} onChange={e => { const qf = [...form.quickFacts]; qf[i] = { ...qf[i], label: e.target.value }; updateForm('quickFacts', qf); }} className="w-[140px] h-[38px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="Label" />
                      <input value={f.value} onChange={e => { const qf = [...form.quickFacts]; qf[i] = { ...qf[i], value: e.target.value }; updateForm('quickFacts', qf); }} className="flex-1 h-[38px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="Value" />
                      <button onClick={() => updateForm('quickFacts', form.quickFacts.filter((_, j) => j !== i))} className="p-2 text-warm-charcoal hover:text-terracotta"><Trash2 size={14} /></button>
                    </div>
                  ))}
                  <button onClick={() => updateForm('quickFacts', [...form.quickFacts, { label: '', value: '', icon: 'map-pin' }])} className="font-sub font-normal text-[12px] text-terracotta hover:underline">+ Add Fact</button>
                </div>
              </div>
            )}

            {activeTab === 'wildlife' && (
              <div className="space-y-4">
                <input ref={wildlifeImageInputRef} type="file" className="hidden" accept="image/*" onChange={handleWildlifeImageUpload} />
                <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-2 block">Wildlife</label>
                {form.wildlife.map((w, i) => (
                  <div key={i} className="border border-[#E8E0D5] p-5 bg-warm-canvas/30 group relative">
                    <button onClick={() => updateForm('wildlife', form.wildlife.filter((_, j) => j !== i))} className="absolute top-2 right-2 p-1 text-warm-charcoal/30 hover:text-terracotta opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                       <div className="space-y-2">
                        <div onClick={() => { currentWildlifeIndex.current = i; wildlifeImageInputRef.current?.click(); }} className="w-full aspect-square border-2 border-dashed border-[#E8E0D5] flex flex-col items-center justify-center cursor-pointer hover:border-terracotta transition-colors overflow-hidden">
                          {w.image ? <img src={w.image} className="w-full h-full object-cover" /> : <><Upload size={16} className="text-warm-charcoal/40 mb-1" /><span className="text-[10px] text-warm-charcoal/40">Upload Photo</span></>}
                        </div>
                      </div>
                      <div className="md:col-span-3 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input value={w.name} onChange={e => { const wl = [...form.wildlife]; wl[i] = { ...wl[i], name: e.target.value }; updateForm('wildlife', wl); }} className="h-[38px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="Animal name" />
                          <select value={w.likelihood} onChange={e => { const wl = [...form.wildlife]; wl[i] = { ...wl[i], likelihood: e.target.value }; updateForm('wildlife', wl); }} className="h-[38px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta">
                            {['Very Common', 'Common', 'Rare', 'Endangered'].map(l => <option key={l}>{l}</option>)}
                          </select>
                        </div>
                        <input value={w.fact} onChange={e => { const wl = [...form.wildlife]; wl[i] = { ...wl[i], fact: e.target.value }; updateForm('wildlife', wl); }} className="w-full h-[38px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="One-line interesting fact..." />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => updateForm('wildlife', [...form.wildlife, { name: '', likelihood: 'Common', fact: '', image: '' }])} className="font-sub font-normal text-[12px] text-terracotta hover:underline">+ Add Animal</button>
              </div>
            )}

            {activeTab === 'experiences' && (
              <div className="space-y-3">
                <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-2 block">Experiences</label>
                {form.experiences.map((exp, i) => (
                  <div key={i} className="border border-[#E8E0D5] p-4 space-y-2">
                    <div className="flex gap-2">
                      <input value={exp.title} onChange={e => { const ex = [...form.experiences]; ex[i] = { ...ex[i], title: e.target.value }; updateForm('experiences', ex); }} className="flex-1 h-[38px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="Experience title" />
                      <button onClick={() => updateForm('experiences', form.experiences.filter((_, j) => j !== i))} className="text-warm-charcoal hover:text-terracotta"><Trash2 size={14} /></button>
                    </div>
                    <textarea value={exp.description} onChange={e => { const ex = [...form.experiences]; ex[i] = { ...ex[i], description: e.target.value }; updateForm('experiences', ex); }} rows={2} className="w-full px-3 py-2 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta resize-none" placeholder="Description" />
                    <input value={exp.tags} onChange={e => { const ex = [...form.experiences]; ex[i] = { ...ex[i], tags: e.target.value }; updateForm('experiences', ex); }} className="w-full h-[38px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="Tags (comma separated)" />
                  </div>
                ))}
                <button onClick={() => updateForm('experiences', [...form.experiences, { title: '', description: '', tags: '' }])} className="font-sub font-normal text-[12px] text-terracotta hover:underline">+ Add Experience</button>
              </div>
            )}

            {activeTab === 'accommodation' && (
              <div className="space-y-4">
                <input ref={accommodationImageInputRef} type="file" className="hidden" accept="image/*" onChange={handleAccommodationImageUpload} />
                <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-2 block">Accommodations</label>
                {form.accommodations.map((acc, i) => (
                  <div key={i} className="border border-[#E8E0D5] p-5 bg-warm-canvas/30 group relative">
                    <button onClick={() => updateForm('accommodations', form.accommodations.filter((_, j) => j !== i))} className="absolute top-2 right-2 p-1 text-warm-charcoal/30 hover:text-terracotta opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <div onClick={() => { currentAccommodationIndex.current = i; accommodationImageInputRef.current?.click(); }} className="w-full aspect-video border-2 border-dashed border-[#E8E0D5] flex flex-col items-center justify-center cursor-pointer hover:border-terracotta transition-colors overflow-hidden">
                          {acc.image ? <img src={acc.image} className="w-full h-full object-cover" /> : <><Upload size={16} className="text-warm-charcoal/40 mb-1" /><span className="text-[10px] text-warm-charcoal/40">Lodge Image</span></>}
                        </div>
                      </div>
                      <div className="md:col-span-3 space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                          <input value={acc.name} onChange={e => { const a = [...form.accommodations]; a[i] = { ...a[i], name: e.target.value }; updateForm('accommodations', a); }} className="h-[38px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="Lodge name" />
                          <select value={acc.tier} onChange={e => { const a = [...form.accommodations]; a[i] = { ...a[i], tier: e.target.value }; updateForm('accommodations', a); }} className="h-[38px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta">
                            {['Budget', 'Classic', 'Luxury', 'Premium'].map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <select value={acc.stars} onChange={e => { const a = [...form.accommodations]; a[i] = { ...a[i], stars: parseInt(e.target.value) }; updateForm('accommodations', a); }} className="h-[38px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta">
                            {[1, 2, 3, 4, 5].map(s => <option key={s} value={s}>{s} Stars</option>)}
                          </select>
                        </div>
                        <input value={acc.amenities} onChange={e => { const a = [...form.accommodations]; a[i] = { ...a[i], amenities: e.target.value }; updateForm('accommodations', a); }} className="w-full h-[38px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="Amenities (Wifi, Pool, Spa...)" />
                        <textarea value={acc.description} onChange={e => { const a = [...form.accommodations]; a[i] = { ...a[i], description: e.target.value }; updateForm('accommodations', a); }} rows={2} className="w-full px-3 py-2 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta resize-none" placeholder="Short description of the lodge..." />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => updateForm('accommodations', [...form.accommodations, { name: '', tier: 'Luxury', stars: 5, description: '', amenities: '', image: '' }])} className="font-sub font-normal text-[12px] text-terracotta hover:underline">+ Add Accommodation</button>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="space-y-3">
                <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-2 block">Destination FAQs</label>
                {form.faqs.map((faq, i) => (
                  <div key={i} className="border border-[#E8E0D5] p-4 space-y-2">
                    <div className="flex gap-2">
                      <input value={faq.question} onChange={e => { const f = [...form.faqs]; f[i] = { ...f[i], question: e.target.value }; updateForm('faqs', f); }} className="flex-1 h-[38px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="Question" />
                      <button onClick={() => updateForm('faqs', form.faqs.filter((_, j) => j !== i))} className="text-warm-charcoal hover:text-terracotta"><Trash2 size={14} /></button>
                    </div>
                    <textarea value={faq.answer} onChange={e => { const f = [...form.faqs]; f[i] = { ...f[i], answer: e.target.value }; updateForm('faqs', f); }} rows={3} className="w-full px-3 py-2 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta resize-none" placeholder="Answer" />
                  </div>
                ))}
                <button onClick={() => updateForm('faqs', [...form.faqs, { question: '', answer: '' }])} className="font-sub font-normal text-[12px] text-terracotta hover:underline">+ Add FAQ</button>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-5">
                <div>
                  <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5 block">Meta Title</label>
                  <input value={form.metaTitle} onChange={e => updateForm('metaTitle', e.target.value)} maxLength={60} className="w-full h-[44px] px-4 font-sub font-normal text-[14px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" />
                  <p className="font-sub font-normal text-[11px] text-warm-charcoal mt-1">{form.metaTitle.length}/60</p>
                </div>
                <div>
                  <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5 block">Meta Description</label>
                  <textarea value={form.metaDescription} onChange={e => updateForm('metaDescription', e.target.value)} maxLength={160} rows={3} className="w-full px-4 py-3 font-sub font-normal text-[14px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta resize-none" />
                  <p className="font-sub font-normal text-[11px] text-warm-charcoal mt-1">{form.metaDescription.length}/160</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-6 bg-[#FFFFFF] border border-[#E8E0D5] px-6 py-4">
            <button onClick={closeEditor} className="px-5 py-2.5 border border-[#E8E0D5] text-warm-charcoal font-sub font-normal text-[12px] uppercase tracking-[0.1em] hover:border-warm-charcoal hover:text-warm-charcoal transition-colors">Cancel</button>
            <div className="flex gap-3">
              <button onClick={handleSave} className="px-5 py-2.5 border border-warm-charcoal text-warm-charcoal font-sub font-normal text-[12px] uppercase tracking-[0.1em] hover:bg-warm-charcoal hover:text-warm-canvas transition-colors">Save Draft</button>
              <button onClick={() => { updateForm('status', 'published'); handleSave(); }} className="px-5 py-2.5 bg-terracotta text-warm-canvas font-sub font-normal text-[12px] uppercase tracking-[0.1em] hover:opacity-90">Publish</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminTopBar title="Destinations" />
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <p className="font-sub font-normal text-[13px] text-warm-charcoal">{destinations.length} destinations</p>
          <button onClick={() => openEditor()} className="flex items-center gap-2 px-4 py-2.5 bg-terracotta text-warm-canvas font-sub font-normal text-[13px] uppercase tracking-[0.1em] hover:opacity-90">
            <Plus size={14} /> New Destination
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {destinations.map(d => (
            <div key={d.id} className="bg-[#FFFFFF] border border-[#E8E0D5] p-5">
              <div className="w-full h-32 bg-faded-sand/30 mb-4 flex items-center justify-center">
                <span className="font-display italic text-[28px] text-warm-charcoal/20">{d.name.charAt(0)}</span>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-sub font-normal text-[15px] text-warm-charcoal">{d.name}</h3>
                  <span className="inline-block px-2 py-0.5 bg-faded-sand/50 font-sub font-normal text-[10px] text-warm-charcoal mt-1">{d.region}</span>
                </div>
                <span className={`px-2 py-0.5 font-sub font-normal text-[10px] uppercase tracking-[0.1em] ${d.status === 'published' ? 'bg-sage text-warm-canvas' : 'bg-muted text-warm-charcoal'}`}>{d.status}</span>
              </div>
              <p className="font-sub font-normal text-[12px] text-warm-charcoal mt-2 line-clamp-2">{d.tagline}</p>
              <p className="font-sub font-normal text-[11px] text-gold mt-2">{d.safariCount} linked safaris</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => openEditor(d)} className="flex-1 py-2 text-center border border-[#E8E0D5] font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.1em] hover:border-terracotta hover:text-terracotta transition-colors">Edit</button>
                <button onClick={() => remove(d.id)} className="py-2 px-3 border border-[#E8E0D5] text-warm-charcoal hover:text-terracotta hover:border-terracotta transition-colors"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
