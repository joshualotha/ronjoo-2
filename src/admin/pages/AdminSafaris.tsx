import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, GripVertical, Eye, Pencil, MoreHorizontal, X, Upload, Trash2, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import AdminTopBar from '../components/AdminTopBar';
import { useAdminCrud } from '../hooks/useAdminCrud';
import { safarisApi, uploadImages } from '../../services/adminApi';

const safariTypes = ['Wildlife Safari', 'Migration Safari', 'Mountain Trek', 'Family Safari', 'Honeymoon', 'Photography', 'Beach Extension', 'Southern Circuit'];
const difficulties = ['Easy', 'Moderate', 'Challenging', 'Extreme'];
const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const activityTags = ['Game Drive', 'Walking', 'Transfer', 'Fly', 'Beach', 'Cultural', 'Night Drive', 'Boat'];

function normalizeBestSeason(input: unknown): string[] {
  const arr = Array.isArray(input) ? input : (typeof input === 'string' ? input.split(',') : []);
  const tokens = arr
    .map((s: any) => String(s ?? '').trim())
    .filter(Boolean)
    .flatMap((t: string) => t.split(',').map((x) => x.trim()).filter(Boolean));

  const monthIndex = new Map(allMonths.map((m, i) => [m.toLowerCase(), i]));

  const expandRange = (raw: string): string[] => {
    const cleaned = raw.replace(/\s+/g, '');
    const parts = cleaned.split(/[-–—]/).map((p) => p.trim()).filter(Boolean);
    if (parts.length !== 2) return [raw];

    const a = parts[0].slice(0, 3).toLowerCase();
    const b = parts[1].slice(0, 3).toLowerCase();
    const ai = monthIndex.get(a);
    const bi = monthIndex.get(b);
    if (ai === undefined || bi === undefined) return [raw];

    const out: string[] = [];
    let i = ai;
    // allow wrapping ranges e.g. Nov–Feb
    for (let step = 0; step < 12; step++) {
      out.push(allMonths[i]);
      if (i === bi) break;
      i = (i + 1) % 12;
    }
    return out;
  };

  const normalized = tokens
    .flatMap((t) => (t.match(/[-–—]/) ? expandRange(t) : [t]))
    .map((t) => {
      const m = String(t ?? '').trim();
      // If it's already a month abbrev, keep it.
      const as3 = m.slice(0, 3);
      const monthMatch = allMonths.find((mm) => mm.toLowerCase() === as3.toLowerCase());
      return monthMatch ?? m;
    })
    .filter((t) => allMonths.includes(t))
    .filter((t, idx, self) => self.indexOf(t) === idx);

  return normalized;
}

interface ItineraryDay {
  dayNumber: number;
  title: string;
  location: string;
  description: string;
  activities: string[];
  meals: { breakfast: boolean; lunch: boolean; dinner: boolean };
  accommodation: string;
  notes: string;
}

interface AccommodationItem {
  name: string;
  nights: number;
  tier: string;
  image: string;
  rating: number;
  website: string;
}

interface SafariFormData {
  name: string;
  slug: string;
  type: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  bestSeason: string[];
  shortDescription: string;
  status: 'published' | 'draft';
  featured: boolean;
  overview: string;
  image: string;
  heroImages: string[];
  highlights: string[];
  itinerary: ItineraryDay[];
  accommodations: AccommodationItem[];
  inclusions: string[];
  exclusions: string[];
  priceTiers: { label: string; price: number }[];
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
}

const emptyDay: ItineraryDay = {
  dayNumber: 1, title: '', location: '', description: '', activities: [], meals: { breakfast: true, lunch: true, dinner: true }, accommodation: '', notes: ''
};

const emptyAccommodation: AccommodationItem = {
  name: '', nights: 1, tier: '', image: '', rating: 4, website: ''
};

const defaultForm: SafariFormData = {
  name: '', slug: '', type: 'Wildlife Safari', duration: 7, maxGroupSize: 6, difficulty: 'Easy',
  bestSeason: [], shortDescription: '', status: 'draft', featured: false, overview: '',
  image: '', heroImages: [],
  highlights: [''], itinerary: [{ ...emptyDay }], accommodations: [],
  inclusions: ['Accommodation as specified', 'All meals during safari', 'Professional English-speaking guide', 'Private 4WD safari vehicle', 'All national park fees', 'Airport transfers'], exclusions: ['International flights', 'Visa fees', 'Travel insurance', 'Personal gratuities', 'Alcoholic beverages'],
  priceTiers: [{ label: '1 person', price: 0 }, { label: '2 persons', price: 0 }, { label: '3-4 persons', price: 0 }],
  metaTitle: '', metaDescription: '', focusKeyword: ''
};

export default function AdminSafaris() {
  const { items: safaris, isLoading, create, update, remove } = useAdminCrud('safaris', safarisApi);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [form, setForm] = useState<SafariFormData>({ ...defaultForm });
  const [isHydrating, setIsHydrating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'content', label: 'Content' },
    { id: 'itinerary', label: 'Itinerary' },
    { id: 'accommodations', label: 'Stays' },
    { id: 'inclusions', label: 'Inclusions' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'seo', label: 'SEO' },
  ];

  const openEditor = async (safari?: any) => {
    if (safari) {
      setIsHydrating(true);
      try {
        const full = await safarisApi.show(safari.id);

        const bestSeasonArr = normalizeBestSeason((full as any).bestSeason);

        const tierList = Array.isArray((full as any).priceTiers) ? (full as any).priceTiers : [];
        const itineraryDays = Array.isArray((full as any).itineraryDays) ? (full as any).itineraryDays : [];
        const itineraryFallback = Array.isArray((full as any).itinerary) ? (full as any).itinerary : [];
        const itinerarySrc = itineraryDays.length > 0 ? itineraryDays : itineraryFallback;

        const parseMeals = (m: any) => {
          if (m && typeof m === 'object' && 'breakfast' in m) return m;
          const s = typeof m === 'string' ? m : '';
          return {
            breakfast: s.includes('B'),
            lunch: s.includes('L'),
            dinner: s.includes('D'),
          };
        };

        setForm({
          name: (full as any).name ?? '',
          slug: (full as any).slug ?? '',
          type: (full as any).type ?? 'Wildlife Safari',
          duration: Number((full as any).days ?? (full as any).duration ?? 7),
          maxGroupSize: Number((full as any).maxGroupSize ?? 6),
          difficulty: (full as any).difficulty ?? 'Easy',
          bestSeason: bestSeasonArr,
          shortDescription: (full as any).shortDescription ?? '',
          status: ((full as any).status ?? 'draft') as any,
          featured: !!(full as any).featured,
          overview: (full as any).overview ?? '',
          image: (full as any).image ?? '',
          heroImages: Array.isArray((full as any).heroImages) ? (full as any).heroImages : [],
          highlights: Array.isArray((full as any).highlights) && (full as any).highlights.length > 0 ? (full as any).highlights : [''],
          itinerary: itinerarySrc.length > 0
            ? itinerarySrc.map((d: any) => ({
              dayNumber: Number(d.dayNumber ?? d.day ?? 1),
              title: d.title ?? '',
              location: d.location ?? '',
              description: d.description ?? '',
              activities: (d.activities ?? d.activityTags ?? []) as string[],
              meals: parseMeals(d.mealsJson ?? d.meals),
              accommodation: d.accommodation ?? '',
              notes: d.notes ?? '',
            }))
            : [{ ...emptyDay }],
          inclusions: Array.isArray((full as any).inclusions) && (full as any).inclusions.length > 0 ? (full as any).inclusions : [''],
          exclusions: Array.isArray((full as any).exclusions) && (full as any).exclusions.length > 0 ? (full as any).exclusions : [''],
          accommodations: Array.isArray((full as any).accommodations)
            ? (full as any).accommodations.map((a: any) => ({
              name: a.name ?? '', nights: Number(a.nights ?? 1), tier: a.tier ?? '',
              image: a.image ?? '', rating: Number(a.rating ?? 4), website: a.website ?? ''
            }))
            : [],
          priceTiers: tierList.length > 0 ? tierList : defaultForm.priceTiers,
          metaTitle: (full as any).metaTitle ?? '',
          metaDescription: (full as any).metaDescription ?? '',
          focusKeyword: (full as any).focusKeyword ?? '',
        });
        setEditing(String((full as any).id ?? safari.id));
      } finally {
        setIsHydrating(false);
      }
    } else {
      setForm({ ...defaultForm });
      setCreating(true);
    }
    setActiveTab('basic');
  };

  const closeEditor = () => { setEditing(null); setCreating(false); };

  const updateForm = (key: keyof SafariFormData, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = async (statusOverride?: SafariFormData['status']) => {
    const mealsToString = (m: any) => {
      if (!m || typeof m !== 'object') return null;
      const parts: string[] = [];
      if (m.breakfast) parts.push('B');
      if (m.lunch) parts.push('L');
      if (m.dinner) parts.push('D');
      return parts.join('/');
    };

    const payload: any = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
      type: form.type,
      duration: Number(form.duration ?? 7),
      maxGroupSize: Number(form.maxGroupSize ?? 6),
      difficulty: form.difficulty,
      bestSeason: normalizeBestSeason(form.bestSeason),
      shortDescription: form.shortDescription,
      status: statusOverride ?? form.status,
      featured: !!form.featured,
      overview: form.overview,
      image: form.image || null,
      heroImages: form.heroImages,
      highlights: (form.highlights ?? []).filter((h) => String(h ?? '').trim() !== ''),
      itinerary: (form.itinerary ?? [])
        .filter((d) => String(d.title ?? '').trim() !== '')
        .map((d, idx) => ({
          dayNumber: Number(d.dayNumber ?? idx + 1),
          title: d.title,
          location: d.location || null,
          description: d.description || null,
          activities: Array.isArray(d.activities) ? d.activities : [],
          meals: mealsToString(d.meals),
          accommodation: d.accommodation || null,
          notes: d.notes || null,
        })),
      inclusions: (form.inclusions ?? []).filter((v) => String(v ?? '').trim() !== ''),
      exclusions: (form.exclusions ?? []).filter((v) => String(v ?? '').trim() !== ''),
      priceTiers: (form.priceTiers ?? []).filter((t) => String(t?.label ?? '').trim() !== ''),
      accommodations: (form.accommodations ?? []).filter((a) => String(a.name ?? '').trim() !== ''),
      metaTitle: form.metaTitle || null,
      metaDescription: form.metaDescription || null,
      focusKeyword: form.focusKeyword || null,
      priceFrom: Number(form.priceTiers?.[1]?.price ?? 0),
    };

    if (editing) {
      await update(editing, payload);
    } else {
      await create(payload as any);
    }
    closeEditor();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this safari?')) await remove(id);
  };

  if (isHydrating) {
    return (
      <div>
        <AdminTopBar title="Safaris" />
        <div className="p-8">
          <p className="font-sub font-normal text-[13px] text-warm-charcoal">Loading safari details…</p>
        </div>
      </div>
    );
  }

  if (editing || creating) {
    return (
      <div>
        <AdminTopBar title={editing ? `Edit: ${form.name}` : 'New Safari'} />
        <div className="p-8">
          {/* Tabs */}
          <div className="flex gap-0 border-b border-[#E8E0D5] mb-6">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-5 py-3 font-sub font-normal text-[12px] uppercase tracking-[0.1em] border-b-2 transition-colors ${activeTab === t.id ? 'border-terracotta text-terracotta' : 'border-transparent text-warm-charcoal hover:text-warm-charcoal'}`}>{t.label}</button>
            ))}
          </div>

          <div className="bg-[#FFFFFF] border border-[#E8E0D5] p-8 max-w-[900px]">
            {/* BASIC INFO */}
            {activeTab === 'basic' && (
              <div className="space-y-5">
                <div>
                  <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5 block">Safari Name *</label>
                  <input value={form.name} onChange={e => { updateForm('name', e.target.value); if (!editing) updateForm('slug', e.target.value.toLowerCase().replace(/\s+/g, '-')); }} className="w-full h-[44px] px-4 font-sub font-normal text-[14px] text-warm-charcoal bg-transparent border border-[#E8E0D5] outline-none focus:border-terracotta" />
                </div>
                <div>
                  <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5 block">Slug</label>
                  <input value={form.slug} onChange={e => updateForm('slug', e.target.value)} className="w-full h-[44px] px-4 font-sub font-normal text-[14px] text-warm-charcoal bg-transparent border border-[#E8E0D5] outline-none focus:border-terracotta font-mono" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5 block">Type</label>
                    <select value={form.type} onChange={e => updateForm('type', e.target.value)} className="w-full h-[44px] px-4 font-sub font-normal text-[14px] text-warm-charcoal bg-transparent border border-[#E8E0D5] outline-none focus:border-terracotta">
                      {safariTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5 block">Duration (days)</label>
                    <input type="number" value={form.duration} onChange={e => updateForm('duration', +e.target.value)} className="w-full h-[44px] px-4 font-sub font-normal text-[14px] text-warm-charcoal bg-transparent border border-[#E8E0D5] outline-none focus:border-terracotta" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5 block">Max Group Size</label>
                    <input type="number" value={form.maxGroupSize} onChange={e => updateForm('maxGroupSize', +e.target.value)} className="w-full h-[44px] px-4 font-sub font-normal text-[14px] text-warm-charcoal bg-transparent border border-[#E8E0D5] outline-none focus:border-terracotta" />
                  </div>
                  <div>
                    <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5 block">Difficulty</label>
                    <select value={form.difficulty} onChange={e => updateForm('difficulty', e.target.value)} className="w-full h-[44px] px-4 font-sub font-normal text-[14px] text-warm-charcoal bg-transparent border border-[#E8E0D5] outline-none focus:border-terracotta">
                      {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5 block">Best Season</label>
                  <div className="flex flex-wrap gap-2">
                    {allMonths.map(m => (
                      <button key={m} onClick={() => updateForm('bestSeason', form.bestSeason.includes(m) ? form.bestSeason.filter(x => x !== m) : [...form.bestSeason, m])} className={`px-3 py-1.5 font-sub font-normal text-[11px] uppercase tracking-[0.1em] border transition-colors ${form.bestSeason.includes(m) ? 'bg-terracotta text-warm-canvas border-terracotta' : 'border-[#E8E0D5] text-warm-charcoal hover:border-terracotta'}`}>{m}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5 block">Short Description</label>
                  <textarea value={form.shortDescription} onChange={e => updateForm('shortDescription', e.target.value)} maxLength={150} rows={3} className="w-full px-4 py-3 font-sub font-normal text-[14px] text-warm-charcoal bg-transparent border border-[#E8E0D5] outline-none focus:border-terracotta resize-none" />
                  <p className="font-sub font-normal text-[11px] text-warm-charcoal mt-1">{form.shortDescription.length}/150</p>
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div onClick={() => updateForm('status', form.status === 'published' ? 'draft' : 'published')} className={`w-10 h-5 relative cursor-pointer ${form.status === 'published' ? 'bg-sage' : 'bg-faded-sand'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-[#FFFFFF] transition-all ${form.status === 'published' ? 'left-[22px]' : 'left-0.5'}`} />
                    </div>
                    <span className="font-sub font-normal text-[12px] text-warm-charcoal">Published</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div onClick={() => updateForm('featured', !form.featured)} className={`w-4 h-4 border flex items-center justify-center ${form.featured ? 'bg-terracotta border-terracotta' : 'border-[#E8E0D5]'}`}>
                      {form.featured && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#F5EFE0" strokeWidth="1.5" /></svg>}
                    </div>
                    <span className="font-sub font-normal text-[12px] text-warm-charcoal">Featured on Homepage</span>
                  </label>
                </div>
              </div>
            )}

            {/* CONTENT */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5 block">Hero Images</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length === 0) return;
                      setIsUploading(true);
                      try {
                        const urls = await uploadImages(files, 'safaris');
                        updateForm('heroImages', [...form.heroImages, ...urls]);
                        if (!form.image && urls.length > 0) updateForm('image', urls[0]);
                      } catch (err) {
                        alert('Upload failed: ' + (err as Error).message);
                      } finally {
                        setIsUploading(false);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }
                    }}
                  />
                  {/* Thumbnail previews */}
                  {form.heroImages.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-4">
                      {form.heroImages.map((url, i) => (
                        <div key={i} className="relative group w-[120px] h-[80px] border border-[#E8E0D5] overflow-hidden">
                          <img src={url} alt={`Hero ${i + 1}`} className="w-full h-full object-cover" />
                          <button
                            onClick={() => {
                              const next = form.heroImages.filter((_, j) => j !== i);
                              updateForm('heroImages', next);
                              if (form.image === url) updateForm('image', next[0] || '');
                            }}
                            className="absolute top-1 right-1 bg-[#1C1812]/70 text-warm-canvas p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={12} />
                          </button>
                          {form.image === url && (
                            <span className="absolute bottom-0 left-0 right-0 bg-terracotta/90 text-warm-canvas text-center font-sub text-[9px] uppercase tracking-widest py-0.5">Cover</span>
                          )}
                          {form.image !== url && (
                            <button
                              onClick={() => updateForm('image', url)}
                              className="absolute bottom-0 left-0 right-0 bg-[#1C1812]/60 text-warm-canvas text-center font-sub text-[9px] uppercase tracking-widest py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              Set as Cover
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <div
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className={`border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
                      isUploading ? 'border-terracotta/50 bg-terracotta/5' : 'border-[#E8E0D5] hover:border-terracotta'
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 size={24} className="mx-auto text-terracotta mb-2 animate-spin" />
                        <p className="font-sub font-normal text-[13px] text-terracotta">Uploading…</p>
                      </>
                    ) : (
                      <>
                        <Upload size={24} className="mx-auto text-warm-charcoal mb-2" />
                        <p className="font-sub font-normal text-[13px] text-warm-charcoal">Click to select images</p>
                        <p className="font-sub font-normal text-[11px] text-warm-charcoal mt-1">JPG, PNG, WEBP — max 5 MB each</p>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5 block">Overview</label>
                  <textarea value={form.overview} onChange={e => updateForm('overview', e.target.value)} rows={8} className="w-full px-4 py-3 font-sub font-normal text-[14px] text-warm-charcoal bg-transparent border border-[#E8E0D5] outline-none focus:border-terracotta resize-none" placeholder="Write an evocative overview of this safari experience..." />
                </div>
                <div>
                  <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-2 block">Highlights (max 8)</label>
                  {form.highlights.map((h, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input value={h} onChange={e => { const hl = [...form.highlights]; hl[i] = e.target.value; updateForm('highlights', hl); }} className="flex-1 h-[40px] px-4 font-sub font-normal text-[14px] text-warm-charcoal bg-transparent border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder={`Highlight ${i + 1}`} />
                      {form.highlights.length > 1 && <button onClick={() => updateForm('highlights', form.highlights.filter((_, j) => j !== i))} className="p-2 text-warm-charcoal hover:text-terracotta"><Trash2 size={14} /></button>}
                    </div>
                  ))}
                  {form.highlights.length < 8 && <button onClick={() => updateForm('highlights', [...form.highlights, ''])} className="font-sub font-normal text-[12px] text-terracotta hover:underline">+ Add Highlight</button>}
                </div>
              </div>
            )}

            {/* ITINERARY */}
            {activeTab === 'itinerary' && (
              <div className="space-y-4">
                {form.itinerary.map((day, i) => (
                  <div key={i} className="border border-[#E8E0D5] p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-display italic text-[20px] text-warm-charcoal">Day {i + 1}</h4>
                      {form.itinerary.length > 1 && <button onClick={() => updateForm('itinerary', form.itinerary.filter((_, j) => j !== i))} className="text-warm-charcoal hover:text-terracotta"><Trash2 size={14} /></button>}
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Day Title</label>
                        <input value={day.title} onChange={e => { const it = [...form.itinerary]; it[i] = { ...it[i], title: e.target.value }; updateForm('itinerary', it); }} className="w-full h-[38px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="e.g. Arrival & Tarangire" />
                      </div>
                      <div>
                        <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Location / Parks</label>
                        <input value={day.location} onChange={e => { const it = [...form.itinerary]; it[i] = { ...it[i], location: e.target.value }; updateForm('itinerary', it); }} className="w-full h-[38px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="e.g. Tarangire National Park" />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Description</label>
                      <textarea value={day.description} onChange={e => { const it = [...form.itinerary]; it[i] = { ...it[i], description: e.target.value }; updateForm('itinerary', it); }} rows={3} className="w-full px-3 py-2 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta resize-none" />
                    </div>
                    <div className="mb-3">
                      <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Activities</label>
                      <div className="flex flex-wrap gap-1.5">
                        {activityTags.map(tag => (
                          <button key={tag} onClick={() => { const it = [...form.itinerary]; const acts = it[i].activities.includes(tag) ? it[i].activities.filter(a => a !== tag) : [...it[i].activities, tag]; it[i] = { ...it[i], activities: acts }; updateForm('itinerary', it); }} className={`px-2.5 py-1 font-sub font-normal text-[10px] uppercase tracking-[0.1em] border transition-colors ${day.activities.includes(tag) ? 'bg-terracotta text-warm-canvas border-terracotta' : 'border-[#E8E0D5] text-warm-charcoal'}`}>{tag}</button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Meals</label>
                        <div className="flex gap-3">
                          {(['breakfast', 'lunch', 'dinner'] as const).map(meal => (
                            <label key={meal} className="flex items-center gap-1.5 cursor-pointer">
                              <div onClick={() => { const it = [...form.itinerary]; it[i] = { ...it[i], meals: { ...it[i].meals, [meal]: !it[i].meals[meal] } }; updateForm('itinerary', it); }} className={`w-4 h-4 border flex items-center justify-center ${day.meals[meal] ? 'bg-sage border-sage' : 'border-[#E8E0D5]'}`}>
                                {day.meals[meal] && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#F5EFE0" strokeWidth="1.5" /></svg>}
                              </div>
                              <span className="font-sub font-normal text-[11px] text-warm-charcoal capitalize">{meal[0]}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Accommodation</label>
                        <input value={day.accommodation} onChange={e => { const it = [...form.itinerary]; it[i] = { ...it[i], accommodation: e.target.value }; updateForm('itinerary', it); }} className="w-full h-[38px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="Lodge / Camp name" />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => updateForm('itinerary', [...form.itinerary, { ...emptyDay, dayNumber: form.itinerary.length + 1 }])} className="w-full py-3 border-2 border-dashed border-[#E8E0D5] font-sub font-normal text-[12px] text-terracotta uppercase tracking-[0.1em] hover:border-terracotta transition-colors">+ Add Day</button>
              </div>
            )}

            {/* INCLUSIONS */}
            {activeTab === 'inclusions' && (
              <div className="space-y-6">
                <div>
                  <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-2 block">Inclusions</label>
                  {form.inclusions.map((inc, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <span className="w-5 h-[40px] flex items-center justify-center text-sage">✓</span>
                      <input value={inc} onChange={e => { const list = [...form.inclusions]; list[i] = e.target.value; updateForm('inclusions', list); }} className="flex-1 h-[40px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" />
                      <button onClick={() => updateForm('inclusions', form.inclusions.filter((_, j) => j !== i))} className="p-2 text-warm-charcoal hover:text-terracotta"><Trash2 size={14} /></button>
                    </div>
                  ))}
                  <button onClick={() => updateForm('inclusions', [...form.inclusions, ''])} className="font-sub font-normal text-[12px] text-terracotta hover:underline">+ Add Inclusion</button>
                </div>
                <div className="border-t border-[#E8E0D5] pt-6">
                  <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-2 block">Exclusions</label>
                  {form.exclusions.map((exc, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <span className="w-5 h-[40px] flex items-center justify-center text-terracotta">✗</span>
                      <input value={exc} onChange={e => { const list = [...form.exclusions]; list[i] = e.target.value; updateForm('exclusions', list); }} className="flex-1 h-[40px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" />
                      <button onClick={() => updateForm('exclusions', form.exclusions.filter((_, j) => j !== i))} className="p-2 text-warm-charcoal hover:text-terracotta"><Trash2 size={14} /></button>
                    </div>
                  ))}
                  <button onClick={() => updateForm('exclusions', [...form.exclusions, ''])} className="font-sub font-normal text-[12px] text-terracotta hover:underline">+ Add Exclusion</button>
                </div>
              </div>
            )}

            {/* PRICING */}
            {activeTab === 'pricing' && (
              <div className="space-y-6">
                <div>
                  <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-3 block">Price Tiers (USD per person)</label>
                  {form.priceTiers.map((tier, i) => (
                    <div key={i} className="flex gap-3 mb-3 items-center">
                      <input value={tier.label} onChange={e => { const t = [...form.priceTiers]; t[i] = { ...t[i], label: e.target.value }; updateForm('priceTiers', t); }} className="w-[180px] h-[40px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="e.g. 2 persons" />
                      <div className="flex items-center border border-[#E8E0D5] focus-within:border-terracotta">
                        <span className="px-3 font-display italic text-[16px] text-gold">$</span>
                        <input type="number" value={tier.price} onChange={e => { const t = [...form.priceTiers]; t[i] = { ...t[i], price: +e.target.value }; updateForm('priceTiers', t); }} className="w-[120px] h-[40px] pr-3 font-sub font-normal text-[14px] text-warm-charcoal outline-none" />
                      </div>
                      {form.priceTiers.length > 1 && <button onClick={() => updateForm('priceTiers', form.priceTiers.filter((_, j) => j !== i))} className="text-warm-charcoal hover:text-terracotta"><Trash2 size={14} /></button>}
                    </div>
                  ))}
                  <button onClick={() => updateForm('priceTiers', [...form.priceTiers, { label: '', price: 0 }])} className="font-sub font-normal text-[12px] text-terracotta hover:underline">+ Add Price Tier</button>
                </div>
              </div>
            )}

            {/* SEO */}
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
                <div>
                  <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5 block">Focus Keyword</label>
                  <input value={form.focusKeyword} onChange={e => updateForm('focusKeyword', e.target.value)} className="w-full h-[44px] px-4 font-sub font-normal text-[14px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" />
                </div>
                {form.metaTitle && (
                  <div className="border border-[#E8E0D5] p-4 mt-4">
                    <p className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-2">Google Preview</p>
                    <p className="font-sub text-[16px] text-[#1a0dab]">{form.metaTitle}</p>
                    <p className="font-sub text-[12px] text-[#006621]">ronjoosafaris.co.tz › safaris › {form.slug}</p>
                    <p className="font-sub font-normal text-[13px] text-[#545454] mt-0.5">{form.metaDescription}</p>
                  </div>
                )}
              </div>
            )}

            {/* ACCOMMODATIONS */}
            {activeTab === 'accommodations' && (
              <div className="space-y-4">
                {form.accommodations.map((acc, i) => (
                  <div key={i} className="border border-[#E8E0D5] p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-display italic text-[20px] text-warm-charcoal">Lodge {i + 1}</h4>
                      <button onClick={() => updateForm('accommodations', form.accommodations.filter((_, j) => j !== i))} className="text-warm-charcoal hover:text-terracotta"><Trash2 size={14} /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Name *</label>
                        <input value={acc.name} onChange={e => { const a = [...form.accommodations]; a[i] = { ...a[i], name: e.target.value }; updateForm('accommodations', a); }} className="w-full h-[38px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="e.g. Serengeti Serena Lodge" />
                      </div>
                      <div>
                        <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Tier / Category</label>
                        <input value={acc.tier} onChange={e => { const a = [...form.accommodations]; a[i] = { ...a[i], tier: e.target.value }; updateForm('accommodations', a); }} className="w-full h-[38px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="e.g. Premium, Superior" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Nights</label>
                        <input type="number" value={acc.nights} onChange={e => { const a = [...form.accommodations]; a[i] = { ...a[i], nights: +e.target.value }; updateForm('accommodations', a); }} className="w-full h-[38px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" min={1} />
                      </div>
                      <div>
                        <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Rating (1-5)</label>
                        <input type="number" value={acc.rating} onChange={e => { const a = [...form.accommodations]; a[i] = { ...a[i], rating: +e.target.value }; updateForm('accommodations', a); }} className="w-full h-[38px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" min={1} max={5} />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Image</label>
                      {acc.image ? (
                        <div className="relative group w-full h-[120px] border border-[#E8E0D5] overflow-hidden">
                          <img src={acc.image} alt={acc.name} className="w-full h-full object-cover" />
                          <button
                            onClick={() => { const a = [...form.accommodations]; a[i] = { ...a[i], image: '' }; updateForm('accommodations', a); }}
                            className="absolute top-2 right-2 bg-[#1C1812]/70 text-warm-canvas p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/jpeg,image/png,image/webp';
                            input.onchange = async (ev) => {
                              const file = (ev.target as HTMLInputElement).files?.[0];
                              if (!file) return;
                              try {
                                const urls = await uploadImages([file], 'accommodations');
                                if (urls.length > 0) {
                                  const a = [...form.accommodations]; a[i] = { ...a[i], image: urls[0] }; updateForm('accommodations', a);
                                }
                              } catch (err) { alert('Upload failed: ' + (err as Error).message); }
                            };
                            input.click();
                          }}
                          className="border-2 border-dashed border-[#E8E0D5] p-4 text-center cursor-pointer hover:border-terracotta transition-colors"
                        >
                          <Upload size={18} className="mx-auto text-warm-charcoal/50 mb-1" />
                          <p className="font-sub font-normal text-[11px] text-warm-charcoal/50">Click to upload</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Website URL</label>
                      <input value={acc.website} onChange={e => { const a = [...form.accommodations]; a[i] = { ...a[i], website: e.target.value }; updateForm('accommodations', a); }} className="w-full h-[38px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="https://www.lodge-website.com" />
                    </div>
                  </div>
                ))}
                <button onClick={() => updateForm('accommodations', [...form.accommodations, { ...emptyAccommodation }])} className="w-full py-3 border-2 border-dashed border-[#E8E0D5] font-sub font-normal text-[12px] text-terracotta uppercase tracking-[0.1em] hover:border-terracotta transition-colors">+ Add Accommodation</button>
              </div>
            )}
          </div>

          {/* Save Bar */}
          <div className="flex items-center justify-between mt-6 bg-[#FFFFFF] border border-[#E8E0D5] px-6 py-4">
            <button onClick={closeEditor} className="px-5 py-2.5 border border-[#E8E0D5] text-warm-charcoal font-sub font-normal text-[12px] uppercase tracking-[0.1em] hover:border-warm-charcoal hover:text-warm-charcoal transition-colors">Cancel</button>
            <div className="flex gap-3">
              <button onClick={() => handleSave('draft')} className="px-5 py-2.5 border border-warm-charcoal text-warm-charcoal font-sub font-normal text-[12px] uppercase tracking-[0.1em] hover:bg-warm-charcoal hover:text-warm-canvas transition-colors">Save Draft</button>
              <button onClick={() => handleSave('published')} className="px-5 py-2.5 bg-terracotta text-warm-canvas font-sub font-normal text-[12px] uppercase tracking-[0.1em] hover:opacity-90">Publish</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminTopBar title="Safaris" />
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <p className="font-sub font-normal text-[13px] text-warm-charcoal">{safaris.length} safaris</p>
          <button onClick={() => openEditor()} className="flex items-center gap-2 px-4 py-2.5 bg-terracotta text-warm-canvas font-sub font-normal text-[13px] uppercase tracking-[0.1em] hover:opacity-90">
            <Plus size={14} /> New Safari
          </button>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E8E0D5]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E0D5]">
                <th className="w-10" />
                {['Safari Name', 'Type', 'Duration', 'Price From', 'Status', 'Bookings', 'Featured', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.1em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {safaris.map(s => (
                <tr key={s.id} className="border-b border-[#E8E0D5]/50 hover:bg-[#FBF8F3] transition-colors">
                  <td className="px-2 text-center"><GripVertical size={14} className="text-warm-charcoal cursor-grab" /></td>
                  <td className="px-4 py-3 font-sub font-normal text-[14px] text-warm-charcoal">{s.name}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-faded-sand/50 font-sub font-normal text-[11px] text-warm-charcoal">{s.type}</span></td>
                  <td className="px-4 py-3 font-sub font-normal text-[13px] text-warm-charcoal">{s.duration} days</td>
                  <td className="px-4 py-3 font-display italic text-[16px] text-gold">${s.priceFrom.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => update(s.id, { status: s.status === 'published' ? 'draft' : 'published' })} className={`px-3 py-1 font-sub font-normal text-[11px] uppercase tracking-[0.1em] cursor-pointer ${s.status === 'published' ? 'bg-sage text-warm-canvas' : 'bg-muted text-warm-charcoal'}`}>
                      {s.status}
                    </button>
                  </td>
                  <td className="px-4 py-3 font-sub font-normal text-[13px] text-warm-charcoal">{s.bookings}</td>
                  <td className="px-4 py-3">
                    <div onClick={() => update(s.id, { featured: !s.featured })} className={`w-4 h-4 border cursor-pointer ${s.featured ? 'bg-terracotta border-terracotta' : 'border-[#E8E0D5]'} flex items-center justify-center`}>
                      {s.featured && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#F5EFE0" strokeWidth="1.5" /></svg>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEditor(s)} className="p-1.5 text-warm-charcoal hover:text-warm-charcoal transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 text-warm-charcoal hover:text-terracotta transition-colors"><Trash2 size={14} /></button>
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
