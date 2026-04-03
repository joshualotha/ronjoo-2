import { useState } from 'react';
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff, X } from 'lucide-react';
import AdminTopBar from '../components/AdminTopBar';
import { useAdminCrud } from '../hooks/useAdminCrud';
import { faqsApi } from '../../services/adminApi';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  relatedGuide: string;
  relatedSafari: string;
  tags: string;
  status: 'published' | 'hidden';
}

interface FaqCategory {
  id: string;
  name: string;
  items: FaqItem[];
}

const initialCategories: FaqCategory[] = [
  { id: 'planning', name: 'Planning Your Safari', items: [
    { id: '1', question: 'When is the best time to visit Tanzania?', answer: 'Tanzania is a year-round destination...', relatedGuide: 'Best Time to Visit Tanzania', relatedSafari: '', tags: 'best time, season, weather', status: 'published' },
    { id: '2', question: 'How far in advance should I book?', answer: 'For peak season travel, we recommend 6–12 months...', relatedGuide: '', relatedSafari: '', tags: 'booking, advance, availability', status: 'published' },
    { id: '3', question: 'How long should my safari be?', answer: 'The minimum meaningful safari is 4 nights...', relatedGuide: '', relatedSafari: '', tags: 'duration, length, days', status: 'published' },
    { id: '4', question: 'What is the difference between a private safari and a group departure?', answer: 'A private safari means the vehicle, guide, and itinerary are exclusively yours...', relatedGuide: '', relatedSafari: '', tags: 'private, group, departure', status: 'published' },
    { id: '5', question: 'Which parks should I include in my first safari?', answer: 'For a first Tanzania safari, the Northern Circuit delivers...', relatedGuide: '', relatedSafari: 'Northern Circuit Classic', tags: 'parks, first safari, northern circuit', status: 'published' },
  ]},
  { id: 'booking', name: 'Booking & Payments', items: [
    { id: '6', question: 'How do I book a safari with Ronjoo?', answer: 'Submit an enquiry through the booking form...', relatedGuide: '', relatedSafari: '', tags: 'book, booking, enquiry', status: 'published' },
    { id: '7', question: 'How much deposit is required?', answer: 'A 30% deposit of the total safari cost...', relatedGuide: '', relatedSafari: '', tags: 'deposit, payment, 30%', status: 'published' },
    { id: '8', question: 'What is your cancellation policy?', answer: 'Our standard cancellation policy...', relatedGuide: '', relatedSafari: '', tags: 'cancellation, refund, cancel', status: 'published' },
  ]},
  { id: 'health', name: 'Health & Safety', items: [
    { id: '9', question: 'Do I need malaria tablets for Tanzania?', answer: 'Yes. Tanzania is a malaria-endemic country...', relatedGuide: 'Health & Vaccinations Tanzania', relatedSafari: '', tags: 'malaria, tablets, health', status: 'published' },
    { id: '10', question: 'What vaccinations do I need?', answer: 'Recommended vaccinations include Hepatitis A and B...', relatedGuide: 'Health & Vaccinations Tanzania', relatedSafari: '', tags: 'vaccinations, health, yellow fever', status: 'published' },
    { id: '11', question: 'Do I need travel insurance?', answer: 'Travel insurance with emergency medical evacuation coverage is non-negotiable...', relatedGuide: 'Travel Insurance for Safari', relatedSafari: '', tags: 'insurance, travel insurance, medical', status: 'published' },
  ]},
  { id: 'expect', name: 'What to Expect on Safari', items: [
    { id: '12', question: 'What does a typical safari day look like?', answer: 'Safari days are structured around animal activity cycles...', relatedGuide: '', relatedSafari: '', tags: 'typical day, schedule, routine', status: 'published' },
    { id: '13', question: 'What should I wear on a game drive?', answer: 'Neutral earth tones: khaki, olive, tan, brown, grey...', relatedGuide: 'Safari Packing Guide', relatedSafari: '', tags: 'clothes, wear, packing', status: 'published' },
  ]},
  { id: 'kilimanjaro', name: 'Kilimanjaro Questions', items: [
    { id: '14', question: 'Which Kilimanjaro route is best?', answer: 'The Lemosho Route is our top recommendation...', relatedGuide: '', relatedSafari: 'Kilimanjaro Lemosho Route', tags: 'route, lemosho, kilimanjaro', status: 'published' },
    { id: '15', question: 'What is altitude sickness and how do I prevent it?', answer: 'Acute Mountain Sickness (AMS) is caused by reduced oxygen...', relatedGuide: '', relatedSafari: '', tags: 'altitude, AMS, sickness', status: 'published' },
  ]},
  { id: 'zanzibar', name: 'Zanzibar Questions', items: [
    { id: '16', question: 'Is Zanzibar worth including in a Tanzania safari?', answer: 'Unequivocally yes...', relatedGuide: '', relatedSafari: '', tags: 'zanzibar, beach, island', status: 'published' },
    { id: '17', question: 'Do I need to dress modestly in Zanzibar?', answer: 'Yes, particularly in Stone Town...', relatedGuide: '', relatedSafari: '', tags: 'dress, modest, zanzibar', status: 'published' },
  ]},
  { id: 'responsible', name: 'Responsible Travel', items: [
    { id: '18', question: 'How does safari tourism help conservation?', answer: 'Well-managed wildlife tourism is the most powerful economic argument...', relatedGuide: '', relatedSafari: '', tags: 'conservation, responsible, tourism', status: 'published' },
  ]},
  { id: 'ronjoo', name: 'Working With Ronjoo', items: [
    { id: '19', question: 'How long has Ronjoo Safaris been operating?', answer: 'Ronjoo Safaris has been operating from Arusha since 2010...', relatedGuide: '', relatedSafari: '', tags: 'ronjoo, history, experience', status: 'published' },
    { id: '20', question: 'Are your guides licensed?', answer: 'All Ronjoo guides hold current TANAPA guide licenses...', relatedGuide: '', relatedSafari: '', tags: 'guides, licensed, TATO', status: 'published' },
  ]},
];

export default function AdminFaqs() {
  const { items: faqs, isLoading, create, update, remove } = useAdminCrud('faqs', faqsApi);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  
  // Group FAQs by category for display
  const categories = faqs.reduce((acc: FaqCategory[], faq: any) => {
    const catName = faq.category?.name || faq.categoryName || 'Uncategorized';
    const catId = faq.faqCategoryId || faq.categoryId || 'uncategorized';
    let cat = acc.find(c => c.id === String(catId));
    if (!cat) {
      cat = { id: String(catId), name: catName, items: [] };
      acc.push(cat);
    }
    cat.items.push({ id: String(faq.id), question: faq.question, answer: faq.answer, relatedGuide: faq.relatedGuide || '', relatedSafari: faq.relatedSafari || '', tags: (faq.tags || []).join?.(', ') || faq.tags || '', status: faq.status || 'published' });
    return acc;
  }, []);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const activeCatId = activeCategory || (categories[0]?.id ?? null);
  const activeCat = categories.find(c => c.id === activeCatId) || categories[0];

  const openEditor = (faq?: FaqItem) => {
    if (faq) {
      setEditingFaq({ ...faq });
      setIsNew(false);
    } else {
      setEditingFaq({ id: String(Date.now()), question: '', answer: '', relatedGuide: '', relatedSafari: '', tags: '', status: 'published' });
      setIsNew(true);
    }
  };

  const saveFaq = async () => {
    if (!editingFaq) return;
    if (isNew) {
      await create({ question: editingFaq.question, answer: editingFaq.answer, faqCategoryId: activeCatId, relatedGuide: editingFaq.relatedGuide, relatedSafari: editingFaq.relatedSafari, tags: editingFaq.tags.split(',').map((t: string) => t.trim()), status: editingFaq.status } as any);
    } else {
      await update(editingFaq.id, { question: editingFaq.question, answer: editingFaq.answer, relatedGuide: editingFaq.relatedGuide, relatedSafari: editingFaq.relatedSafari, tags: editingFaq.tags.split(',').map((t: string) => t.trim()), status: editingFaq.status } as any);
    }
    setEditingFaq(null);
  };

  const deleteFaq = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    await remove(id);
  };

  const toggleStatus = async (id: string) => {
    const faq = faqs.find((f: any) => String(f.id) === id);
    if (faq) await update(id, { status: faq.status === 'published' ? 'hidden' : 'published' });
  };


  if (isLoading || !activeCat) {
    return (
      <div>
        <AdminTopBar title="FAQ Management" />
        <div className="p-8">
          <p className="font-sub font-normal text-[13px] text-warm-charcoal">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminTopBar title="FAQ Management" />
      <div className="p-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-0 border-b border-[#E8E0D5] mb-6">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-4 py-2.5 font-sub font-normal text-[11px] uppercase tracking-[0.1em] border-b-2 transition-colors whitespace-nowrap ${activeCategory === cat.id ? 'border-terracotta text-terracotta' : 'border-transparent text-warm-charcoal hover:text-warm-charcoal'}`}>
              {cat.name} ({cat.items.length})
            </button>
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <p className="font-sub font-normal text-[13px] text-warm-charcoal">{activeCat.items.length} questions in {activeCat.name}</p>
          <button onClick={() => openEditor()} className="flex items-center gap-2 px-4 py-2.5 bg-terracotta text-warm-canvas font-sub font-normal text-[13px] uppercase tracking-[0.1em] hover:opacity-90">
            <Plus size={14} /> Add Question
          </button>
        </div>

        {/* FAQ List */}
        <div className="bg-[#FFFFFF] border border-[#E8E0D5]">
          {activeCat.items.map((faq, idx) => (
            <div key={faq.id} className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E8E0D5]/50 hover:bg-[#FBF8F3] transition-colors">
              <GripVertical size={14} className="text-warm-charcoal cursor-grab flex-shrink-0" />
              <span className="font-display italic text-[16px] text-gold/50 w-8 flex-shrink-0">{String(idx + 1).padStart(2, '0')}</span>
              <div className="flex-1 min-w-0">
                <p className="font-display italic text-[15px] text-warm-charcoal truncate">{faq.question}</p>
                <p className="font-sub font-normal text-[12px] text-warm-charcoal mt-0.5 truncate">{faq.answer.slice(0, 80)}...</p>
              </div>
              <button onClick={() => toggleStatus(faq.id)} className={`px-2 py-0.5 font-sub font-normal text-[10px] uppercase tracking-[0.1em] flex-shrink-0 ${faq.status === 'published' ? 'bg-sage text-warm-canvas' : 'bg-muted text-warm-charcoal'}`}>
                {faq.status}
              </button>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => openEditor(faq)} className="p-1.5 text-warm-charcoal hover:text-warm-charcoal transition-colors"><Pencil size={14} /></button>
                <button onClick={() => deleteFaq(faq.id)} className="p-1.5 text-warm-charcoal hover:text-terracotta transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
          {activeCat.items.length === 0 && (
            <div className="p-12 text-center">
              <p className="font-display italic text-[20px] text-warm-charcoal/40">No questions yet</p>
              <p className="font-sub font-normal text-[13px] text-warm-charcoal mt-1">Add your first question to this category</p>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingFaq && (
          <div className="fixed inset-0 bg-warm-charcoal/60 z-50 flex items-center justify-center p-4">
            <div className="bg-[#FFFFFF] w-full max-w-[700px] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E0D5]">
                <h3 className="font-display italic text-[20px] text-warm-charcoal">{isNew ? 'New Question' : 'Edit Question'}</h3>
                <button onClick={() => setEditingFaq(null)} className="text-warm-charcoal hover:text-warm-charcoal"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5 block">Question *</label>
                  <input value={editingFaq.question} onChange={e => setEditingFaq({ ...editingFaq, question: e.target.value })} className="w-full h-[44px] px-4 font-display italic text-[16px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="What question are guests asking?" />
                </div>
                <div>
                  <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5 block">Answer *</label>
                  <textarea value={editingFaq.answer} onChange={e => setEditingFaq({ ...editingFaq, answer: e.target.value })} rows={8} className="w-full px-4 py-3 font-sub font-normal text-[14px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta resize-none" placeholder="Write a clear, honest answer. Use **bold** for emphasis." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Related Guide (optional)</label>
                    <input value={editingFaq.relatedGuide} onChange={e => setEditingFaq({ ...editingFaq, relatedGuide: e.target.value })} className="w-full h-[38px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="Guide title" />
                  </div>
                  <div>
                    <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Related Safari (optional)</label>
                    <input value={editingFaq.relatedSafari} onChange={e => setEditingFaq({ ...editingFaq, relatedSafari: e.target.value })} className="w-full h-[38px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="Safari name" />
                  </div>
                </div>
                <div>
                  <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Search Tags</label>
                  <input value={editingFaq.tags} onChange={e => setEditingFaq({ ...editingFaq, tags: e.target.value })} className="w-full h-[38px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none focus:border-terracotta" placeholder="Comma-separated tags for search" />
                </div>
                <div>
                  <label className="font-sub text-[10px] text-warm-charcoal uppercase tracking-[0.15em] mb-1 block">Category</label>
                  <select value={activeCategory} disabled className="w-full h-[38px] px-3 font-sub font-normal text-[13px] text-warm-charcoal border border-[#E8E0D5] outline-none bg-faded-sand/20">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E8E0D5]">
                <button onClick={() => setEditingFaq(null)} className="px-5 py-2.5 border border-[#E8E0D5] text-warm-charcoal font-sub font-normal text-[12px] uppercase tracking-[0.1em] hover:border-warm-charcoal hover:text-warm-charcoal transition-colors">Cancel</button>
                <button onClick={saveFaq} className="px-5 py-2.5 bg-terracotta text-warm-canvas font-sub font-normal text-[12px] uppercase tracking-[0.1em] hover:opacity-90">Save Question</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
