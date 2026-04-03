import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import AdminTopBar from '../components/AdminTopBar';
import { useAdminCrud } from '../hooks/useAdminCrud';
import { waitlistsApi } from '../../services/adminApi';

export default function AdminWaitlists() {
  const { items, isLoading, create, update, remove } = useAdminCrud('waitlists', waitlistsApi);
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const openCreate = () => { setFormData({ guest_name: '', email: '', phone: '', pax: 1, status: 'waiting', departure_id: '' }); setEditing(null); setShowForm(true); };
  const openEdit = (item: any) => { setFormData({ ...item }); setEditing(item.id); setShowForm(true); };
  const handleSave = async () => { if (editing) await update(editing, formData); else await create(formData); setShowForm(false); };

  return (
    <div>
      <AdminTopBar title="Waiting Lists" />
      <div className="p-8">
        <div className="flex justify-end mb-6">
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-terracotta text-warm-canvas font-sub text-[13px] hover:opacity-90">
            <Plus size={14} /> Add to Waitlist
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-[#FFFFFF] w-full max-w-[500px] p-6 border border-[#E8E0D5]">
              <div className="flex justify-between mb-4">
                <h2 className="font-display italic text-[20px] text-warm-charcoal">{editing ? 'Edit' : 'New'} Waitlist Entry</h2>
                <button onClick={() => setShowForm(false)}><X size={16} /></button>
              </div>
              <div className="space-y-4">
                <input placeholder="Guest Name" value={formData.guest_name || formData.guestName || ''} onChange={e => setFormData({...formData, guest_name: e.target.value})} className="w-full border p-2 text-[13px]" />
                <input placeholder="Email" type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border p-2 text-[13px]" />
                <input placeholder="Phone" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border p-2 text-[13px]" />
                <input placeholder="Departure ID (Numeric)" type="number" value={formData.departure_id || ''} onChange={e => setFormData({...formData, departure_id: e.target.value})} className="w-full border p-2 text-[13px]" />
                <input placeholder="Pax" type="number" value={formData.pax || 1} onChange={e => setFormData({...formData, pax: e.target.value})} className="w-full border p-2 text-[13px]" />
                <select value={formData.status || 'waiting'} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border p-2 text-[13px]">
                    <option value="waiting">Waiting</option>
                    <option value="notified">Notified</option>
                    <option value="converted">Converted</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <button onClick={handleSave} className="w-full py-2 bg-terracotta text-white text-[13px]">Save</button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-[#FFFFFF] border border-[#E8E0D5]">
          <table className="w-full">
            <thead className="border-b border-[#E8E0D5]">
              <tr>
                <th className="text-left px-6 py-3 font-sub text-[11px] text-warm-charcoal uppercase">Guest Name</th>
                <th className="text-left px-6 py-3 font-sub text-[11px] text-warm-charcoal uppercase">Email</th>
                <th className="text-left px-6 py-3 font-sub text-[11px] text-warm-charcoal uppercase">Status</th>
                <th className="text-right px-6 py-3 font-sub text-[11px] text-warm-charcoal uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0D5]">
              {isLoading ? <tr><td colSpan={4} className="p-4">Loading...</td></tr> : 
               items.map((item: any) => (
                <tr key={item.id} className="hover:bg-[#FBF8F3]">
                  <td className="px-6 py-3 font-sub text-[14px]">{item.guest_name || item.guestName}</td>
                  <td className="px-6 py-3 font-sub text-[14px]">{item.email}</td>
                  <td className="px-6 py-3 font-sub text-[14px] uppercase">{item.status}</td>
                  <td className="px-6 py-3 text-right">
                     <button onClick={() => openEdit(item)} className="mr-3 text-warm-charcoal"><Pencil size={14}/></button>
                     <button onClick={() => remove(item.id)} className="text-red-500"><Trash2 size={14} /></button>
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
