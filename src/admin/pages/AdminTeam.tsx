import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import AdminTopBar from '../components/AdminTopBar';
import { useAdminCrud } from '../hooks/useAdminCrud';
import { teamApi } from '../../services/adminApi';

export default function AdminTeam() {
  const { items: team, isLoading, create, update, remove } = useAdminCrud('team', teamApi);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [form, setForm] = useState<any>({
    name: '',
    role: 'Guide',
    experience: 0,
    languagesText: '',
    specializationsText: '',
    showOnWebsite: true,
    photo: '',
    bio: '',
  });

  const openCreate = () => {
    setEditingId(null);
    setForm({
      name: '',
      role: 'Guide',
      experience: 0,
      languagesText: '',
      specializationsText: '',
      showOnWebsite: true,
      photo: '',
      bio: '',
    });
    setShowForm(true);
  };

  const openEdit = (member: any) => {
    const parsedExperience = Number(member.experience ?? 0);
    setEditingId(member.id);
    setForm({
      name: member.name ?? '',
      role: member.role ?? 'Guide',
      experience: Number.isFinite(parsedExperience) ? parsedExperience : 0,
      languagesText: Array.isArray(member.languages) ? member.languages.join(', ') : '',
      specializationsText: Array.isArray(member.specializations) ? member.specializations.join(', ') : '',
      showOnWebsite: !!member.showOnWebsite,
      photo: member.photo ?? '',
      bio: member.bio ?? '',
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    const languages = (form.languagesText ?? '')
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);
    const specializations = (form.specializationsText ?? '')
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);

    const payload = {
      name: form.name,
      role: form.role,
      experience: Number(form.experience ?? 0),
      languages,
      specializations,
      showOnWebsite: !!form.showOnWebsite,
      photo: form.photo,
      bio: form.bio,
    };

    if (editingId) await update(editingId, payload);
    else await create(payload);
    setShowForm(false);
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Delete this team member?')) return;
    await remove(id);
  };

  if (isLoading) {
    return (
      <div>
        <AdminTopBar title="Team &amp; Guides" />
        <div className="p-8">
          <p className="font-sub font-normal text-[13px] text-warm-charcoal">Loading team...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminTopBar title="Team &amp; Guides" />
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div />
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-terracotta text-warm-canvas font-sub font-normal text-[13px] uppercase tracking-[0.1em] hover:opacity-90">
            <Plus size={14} /> Add Team Member
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member: any) => (
            <div key={member.id} className="bg-[#FFFFFF] border border-[#E8E0D5] p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-terracotta/10 overflow-hidden flex items-center justify-center font-display italic text-[24px] text-terracotta">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    member.name.charAt(0)
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(member)} className="p-1.5 text-warm-charcoal hover:text-warm-charcoal transition-colors" aria-label="Edit team member">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(member.id)} className="p-1.5 text-red-500 hover:text-red-500 transition-colors" aria-label="Delete team member">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <h3 className="font-sub font-normal text-[16px] text-warm-charcoal">{member.name}</h3>
              <p className="font-sub font-normal text-[12px] text-terracotta mt-0.5">{member.role}</p>
              <p className="font-sub font-normal text-[12px] text-warm-charcoal mt-1">{member.experience} years experience</p>
              <div className="flex flex-wrap gap-1 mt-3">
                {(member.languages || []).map((l: string) => (
                  <span key={l} className="px-2 py-0.5 bg-faded-sand/50 font-sub font-normal text-[10px] text-warm-charcoal">{l}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {(member.specializations || []).map((s: string) => (
                  <span key={s} className="px-2 py-0.5 border border-gold/30 font-sub font-normal text-[10px] text-gold uppercase tracking-[0.1em]">{s}</span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div onClick={() => update(member.id, { showOnWebsite: !member.showOnWebsite })} className={`w-4 h-4 border cursor-pointer ${member.showOnWebsite ? 'bg-sage border-sage' : 'border-[#E8E0D5]'} flex items-center justify-center`}>
                  {member.showOnWebsite && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#F5EFE0" strokeWidth="1.5" /></svg>}
                </div>
                <span className="font-sub font-normal text-[11px] text-warm-charcoal">Show on website</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] w-full max-w-[520px] p-6 border border-[#E8E0D5] max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-20 pb-2">
              <h2 className="font-display italic text-[20px] text-warm-charcoal">
                {editingId ? 'Edit Team Member' : 'New Team Member'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-warm-charcoal hover:text-warm-charcoal" aria-label="Close">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Role *</label>
                <input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Experience (years) *</label>
                <input
                  type="number"
                  min={0}
                  value={Number.isFinite(Number(form.experience)) ? Number(form.experience) : 0}
                  onChange={e => {
                    const raw = e.target.value;
                    const next = raw === '' ? 0 : Number(raw);
                    setForm({ ...form, experience: Number.isFinite(next) ? next : 0 });
                  }}
                  className="w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta"
                />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Languages (comma-separated)</label>
                <textarea value={form.languagesText} onChange={e => setForm({ ...form, languagesText: e.target.value })} rows={3} className="w-full border border-[#E8E0D5] outline-none focus:border-terracotta px-3 py-2 resize-none" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Specializations (comma-separated)</label>
                <textarea value={form.specializationsText} onChange={e => setForm({ ...form, specializationsText: e.target.value })} rows={3} className="w-full border border-[#E8E0D5] outline-none focus:border-terracotta px-3 py-2 resize-none" />
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Photo URL</label>
                <div className="flex gap-2">
                  <input value={form.photo} onChange={e => setForm({ ...form, photo: e.target.value })} className="flex-1 h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
                  <label className="cursor-pointer h-[40px] px-4 bg-faded-sand text-warm-charcoal font-sub font-normal text-[11px] uppercase tracking-[0.1em] flex items-center justify-center hover:bg-gold/10 transition-colors">
                    Upload
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const { uploadImages } = await import('../../services/adminApi');
                          const urls = await uploadImages([file]);
                          if (urls && urls.length > 0) {
                            setForm({ ...form, photo: urls[0] });
                          }
                        } catch (err) {
                          console.error("Upload failed", err);
                          alert("Upload failed. Please try again.");
                        }
                      }}
                    />
                  </label>
                </div>
                {form.photo && (
                  <div className="mt-2 w-20 h-20 border border-[#E8E0D5] overflow-hidden">
                    <img src={form.photo} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Biography</label>
                <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={4} className="w-full border border-[#E8E0D5] outline-none focus:border-terracotta px-3 py-2 resize-none" />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={!!form.showOnWebsite}
                  onChange={e => setForm({ ...form, showOnWebsite: e.target.checked })}
                />
                <span className="font-sub font-normal text-[13px] text-warm-charcoal">Show on website</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-[#E8E0D5] text-warm-charcoal hover:text-warm-charcoal">
                  Cancel
                </button>
                <button onClick={handleSave} className="px-5 py-2 bg-terracotta text-warm-canvas font-sub font-normal text-[13px] uppercase tracking-[0.1em] hover:opacity-90">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
