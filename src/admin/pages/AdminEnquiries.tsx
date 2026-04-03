import { useState } from 'react';
import { Search, Send, Trash2 } from 'lucide-react';
import AdminTopBar from '../components/AdminTopBar';
import { useAdminCrud } from '../hooks/useAdminCrud';
import { enquiriesApi } from '../../services/adminApi';

const tabFilters = ['All', 'Unread', 'Replied', 'Converted', 'Archived'];

const statusColors: Record<string, string> = {
  'new': 'bg-terracotta text-warm-canvas',
  'in-progress': 'bg-gold text-warm-canvas',
  'awaiting-guest': 'bg-muted text-warm-charcoal',
  'converted': 'bg-sage text-warm-canvas',
  'archived': 'bg-warm-charcoal text-warm-canvas',
};

function normalizeTags(input: unknown): string[] {
  if (Array.isArray(input)) return input.filter((t): t is string => typeof t === 'string' && t.trim().length > 0);
  if (typeof input === 'string') {
    // Accept comma-separated tags (common storage pattern).
    return input.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
}

export default function AdminEnquiries() {
  const [activeTab, setActiveTab] = useState('All');
  const { items: allEnquiries, isLoading, update, remove, refetch } = useAdminCrud('enquiries', enquiriesApi);
  const enquiries = Array.isArray(allEnquiries) ? allEnquiries : ((allEnquiries as any)?.data ?? []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [reply, setReply] = useState('');

  const filtered = enquiries.filter((e: any) => {
    if (activeTab === 'Unread') return !e.isRead;
    if (activeTab === 'Replied') return (e.replies || []).length > 0 && e.status !== 'converted';
    if (activeTab === 'Converted') return e.status === 'converted';
    if (activeTab === 'Archived') return e.status === 'archived';
    return true;
  }).filter((e: any) => !search || (e.guestName || '').toLowerCase().includes(search.toLowerCase()) || (e.safariInterest || '').toLowerCase().includes(search.toLowerCase()));

  const selected = enquiries.find((e: any) => e.id === selectedId) || (enquiries.length > 0 ? enquiries[0] : null);
  const selectedTags = normalizeTags(selected?.tags);

  const handleDelete = async () => {
    if (!selected) return;
    if (!confirm('Delete this enquiry?')) return;
    await remove(selected.id);
    await refetch();
  };

  const handleSendReply = async () => {
    if (!selected) return;
    const message = reply.trim();
    if (!message) return alert('Reply message cannot be empty');
    await enquiriesApi.reply(selected.id, message, 'admin');
    setReply('');
    await refetch();
  };

  const handleWhatsAppReply = () => {
    if (!selected || !selected.whatsapp) return;
    const phone = String(selected.whatsapp).replace(/[^\d]/g, '');
    if (!phone) return;
    const prefilled = `Hello ${selected.guestName}, regarding your enquiry for ${selected.safariInterest} (${selected.country}).`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(prefilled)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleConvert = async () => {
    if (!selected) return;
    await enquiriesApi.convertToBooking(selected.id);
    await refetch();
  };

  const handleArchive = async () => {
    if (!selected) return;
    await update(selected.id, { status: 'archived', isRead: true } as any);
    await refetch();
  };

  return (
    <div>
      <AdminTopBar title="Enquiries" />
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Panel */}
        <div className="w-[380px] border-r border-[#E8E0D5] bg-[#FFFFFF] flex flex-col">
          <div className="p-4 border-b border-[#E8E0D5]">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-charcoal" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search enquiries..." className="w-full h-9 pl-9 pr-4 font-sub font-normal text-[13px] text-warm-charcoal bg-transparent border border-[#E8E0D5] outline-none focus:border-terracotta transition-colors placeholder:text-[#B5A998]" />
            </div>
          </div>
          <div className="flex border-b border-[#E8E0D5] overflow-x-auto">
            {tabFilters.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 font-sub font-normal text-[12px] whitespace-nowrap transition-colors border-b-2 ${activeTab === tab ? 'border-terracotta text-terracotta' : 'border-transparent text-warm-charcoal hover:text-warm-charcoal'}`}>{tab}</button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map(enq => (
              <div
                key={enq.id}
                onClick={() => setSelectedId(enq.id)}
                className={`px-4 py-3 border-b border-[#E8E0D5]/50 cursor-pointer transition-colors relative ${selectedId === enq.id ? 'bg-[#FBF8F3]' : 'hover:bg-[#FBF8F3]'} ${!enq.isRead ? 'border-l-[3px] border-l-terracotta' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <span>{enq.countryFlag}</span>
                  <span className={`font-sub text-[13px] text-warm-charcoal flex-1 ${!enq.isRead ? 'font-normal' : 'font-normal'}`}>{enq.guestName}</span>
                  {!enq.isRead && <span className="w-2 h-2 bg-gold rounded-full flex-shrink-0" />}
                </div>
                <p className="font-sub font-normal text-[12px] text-terracotta mt-0.5">{enq.safariInterest}</p>
                <p className="font-sub font-normal text-[12px] text-warm-charcoal mt-0.5 line-clamp-1">{enq.message}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="font-sub font-normal text-[10px] text-warm-charcoal">{new Date(enq.receivedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  <span className={`px-1.5 py-0.5 font-sub font-normal text-[9px] uppercase tracking-[0.1em] ${statusColors[enq.status]}`}>{enq.status.replace('-', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-[#E8E0D5] bg-[#FFFFFF]">
            <div className="flex justify-between font-sub font-normal text-[11px] text-warm-charcoal">
              <span>Total: {enquiries.length} enquiries</span>
              <span>Conv. rate: 12.5%</span>
              <span>Avg response: 2.4h</span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 bg-[#F5F0E8] flex flex-col">
          {selected ? (
            <>
              {/* Header */}
              <div className="bg-[#FFFFFF] border-b border-[#E8E0D5] px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{selected.countryFlag}</span>
                    <h3 className="font-sub font-normal text-[16px] text-warm-charcoal">{selected.guestName}</h3>
                    <span className={`px-2 py-0.5 font-sub font-normal text-[10px] uppercase tracking-[0.1em] ${statusColors[selected.status]}`}>{selected.status.replace('-', ' ')}</span>
                  </div>
                  <p className="font-sub font-normal text-[12px] text-warm-charcoal mt-0.5">{selected.email} · {selected.whatsapp} · {selected.country}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-4 py-2 bg-terracotta text-warm-canvas font-sub font-normal text-[12px] uppercase tracking-[0.1em] hover:opacity-90 transition-opacity"
                    onClick={handleConvert}
                  >
                    Convert to Booking
                  </button>
                  <button
                    className="px-4 py-2 border border-[#E8E0D5] text-warm-charcoal font-sub font-normal text-[12px] uppercase tracking-[0.1em] hover:border-warm-charcoal hover:text-warm-charcoal transition-colors"
                    onClick={handleArchive}
                  >
                    Archive
                  </button>
                  <button
                    className="px-3 py-2 border border-[#E8E0D5] text-warm-charcoal font-sub font-normal text-[12px] uppercase tracking-[0.1em] hover:border-red-500 hover:text-red-500 transition-colors"
                    onClick={handleDelete}
                    aria-label="Delete enquiry"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Enquiry Details */}
              <div className="px-6 py-4 bg-[#FFFFFF] border-b border-[#E8E0D5]">
                <div className="grid grid-cols-4 gap-4">
                  <div><p className="font-sub font-normal text-[10px] text-warm-charcoal uppercase tracking-[0.1em]">Safari Interest</p><p className="font-sub font-normal text-[13px] text-terracotta mt-0.5">{selected.safariInterest}</p></div>
                  <div><p className="font-sub font-normal text-[10px] text-warm-charcoal uppercase tracking-[0.1em]">Preferred Dates</p><p className="font-sub font-normal text-[13px] text-warm-charcoal mt-0.5">{selected.preferredDates}</p></div>
                  <div><p className="font-sub font-normal text-[10px] text-warm-charcoal uppercase tracking-[0.1em]">Travelers</p><p className="font-sub font-normal text-[13px] text-warm-charcoal mt-0.5">{selected.travelers}</p></div>
                  <div><p className="font-sub font-normal text-[10px] text-warm-charcoal uppercase tracking-[0.1em]">Budget</p><p className="font-sub font-normal text-[13px] text-warm-charcoal mt-0.5">{selected.budget}</p></div>
                </div>
                {selectedTags.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {selectedTags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 border border-gold/30 font-sub font-normal text-[10px] text-gold uppercase tracking-[0.1em]">{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {/* Initial message */}
                <div className="flex justify-start">
                  <div className="max-w-[70%] px-4 py-3 bg-faded-sand/50">
                    <p className="font-sub font-normal text-[13px] text-warm-charcoal leading-relaxed">{selected.message}</p>
                    <p className="font-sub font-normal text-[10px] text-warm-charcoal mt-2">{new Date(selected.receivedAt).toLocaleString('en-GB')}</p>
                  </div>
                </div>
                {/* Replies */}
                {(selected.replies ?? []).map((r, i) => (
                  <div key={i} className={`flex ${r.from === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-4 py-3 ${r.from === 'admin' ? 'bg-warm-charcoal text-warm-canvas' : 'bg-faded-sand/50'}`}>
                      <p className={`font-sub font-normal text-[13px] leading-relaxed ${r.from === 'admin' ? 'text-warm-canvas' : 'text-warm-charcoal'}`}>{r.message}</p>
                      <p className={`font-sub font-normal text-[10px] mt-2 ${r.from === 'admin' ? 'text-warm-canvas/80' : 'text-warm-charcoal'}`}>{new Date(r.timestamp).toLocaleString('en-GB')}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Composer */}
              <div className="bg-[#FFFFFF] border-t border-[#E8E0D5] px-6 py-4">
                <div className="flex gap-3">
                  <textarea
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 h-[80px] px-4 py-3 font-sub font-normal text-[13px] text-warm-charcoal bg-transparent border border-[#E8E0D5] outline-none focus:border-terracotta transition-colors placeholder:text-[#B5A998] resize-none"
                  />
                  <div className="flex flex-col gap-2">
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-terracotta text-warm-canvas font-sub font-normal text-[11px] uppercase tracking-[0.1em] hover:opacity-90 transition-opacity"
                      onClick={handleSendReply}
                    >
                      <Send size={12} /> Send Reply
                    </button>
                    <button onClick={handleWhatsAppReply} className="flex items-center gap-2 px-4 py-2 border border-warm-charcoal text-warm-charcoal font-sub font-normal text-[11px] uppercase tracking-[0.1em] hover:bg-warm-charcoal hover:text-warm-canvas transition-colors">
                      <Send size={12} /> WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="font-sub font-normal text-[14px] text-warm-charcoal">Select an enquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
