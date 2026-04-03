import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import AdminTopBar from '../components/AdminTopBar';
import { useAdminCrud } from '../hooks/useAdminCrud';
import { seoApi } from '../../services/adminApi';

export default function AdminSeo() {
  const { items, isLoading, create, update, remove } = useAdminCrud('seo', seoApi);
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const openCreate = () => { setFormData({ path: '', title: '', description: '', keywords: '' }); setEditing(null); setShowForm(true); };
  const openEdit = (item: any) => { setFormData({ ...item }); setEditing(item.id); setShowForm(true); };
  const handleSave = async () => { if (editing) await update(editing, formData); else await create(formData); setShowForm(false); };

  return (
    <div>
      <AdminTopBar title="SEO Manager" />
      <div className="p-8">
        <div className="flex justify-end mb-6">
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-terracotta text-warm-canvas font-sub text-[13px] hover:opacity-90">
            <Plus size={14} /> Add Route
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-[#FFFFFF] w-full max-w-[500px] p-6 border border-[#E8E0D5]">
              <div className="flex justify-between mb-4">
                <h2 className="font-display italic text-[20px] text-warm-charcoal">{editing ? 'Edit' : 'New'} SEO Route</h2>
                <button onClick={() => setShowForm(false)}><X size={16} /></button>
              </div>
              <div className="space-y-4">
                <input placeholder="Path (e.g. /about)" value={formData.path || ''} onChange={e => setFormData({...formData, path: e.target.value})} className="w-full border p-2 text-[13px]" />
                <input placeholder="Title" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border p-2 text-[13px]" />
                <textarea placeholder="Description" rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border p-2 text-[13px]" />
                <button onClick={handleSave} className="w-full py-2 bg-terracotta text-white text-[13px]">Save</button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-[#FFFFFF] border border-[#E8E0D5]">
          <table className="w-full">
            <thead className="border-b border-[#E8E0D5]">
              <tr>
                <th className="text-left px-6 py-3 font-sub text-[11px] text-warm-charcoal uppercase">Path</th>
                <th className="text-left px-6 py-3 font-sub text-[11px] text-warm-charcoal uppercase">Title</th>
                <th className="text-right px-6 py-3 font-sub text-[11px] text-warm-charcoal uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0D5]">
              {isLoading ? <tr><td colSpan={3} className="p-4">Loading...</td></tr> : 
               items.map((item: any) => (
                <tr key={item.id} className="hover:bg-[#FBF8F3]">
                  <td className="px-6 py-3 font-sub text-[14px]">{item.path}</td>
                  <td className="px-6 py-3 font-sub text-[14px] truncate max-w-[200px]">{item.title}</td>
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
