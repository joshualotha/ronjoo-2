import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import AdminTopBar from '../components/AdminTopBar';
import { useAdminCrud } from '../hooks/useAdminCrud';
import { promotionsApi } from '../../services/adminApi';

export default function AdminPromotions() {
  const { items, isLoading, create, update, remove } = useAdminCrud('promotions', promotionsApi);
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const openCreate = () => {
    setFormData({
      code: '', name: '', description: '', discount_type: 'percentage', discount_value: '',
      valid_from: '', valid_until: '', usage_limit: '', status: 'active'
    });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (item: any) => {
    setFormData({ ...item });
    setEditing(item.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (editing) await update(editing, formData);
    else await create(formData);
    setShowForm(false);
  };

  return (
    <div>
      <AdminTopBar title="Promotions" />
      <div className="p-8">
        <div className="flex justify-end mb-6">
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-terracotta text-warm-canvas font-sub text-[13px] hover:opacity-90">
            <Plus size={14} /> Add Promotion
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-[#FFFFFF] w-full max-w-[500px] p-6 border border-[#E8E0D5]">
              <div className="flex justify-between mb-4">
                <h2 className="font-display italic text-[20px] text-warm-charcoal">{editing ? 'Edit' : 'New'} Promotion</h2>
                <button onClick={() => setShowForm(false)}><X size={16} /></button>
              </div>
              <div className="space-y-4">
                <input placeholder="Promo Code" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full border p-2 text-[13px]" />
                <input placeholder="Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-2 text-[13px]" />
                <div className="flex gap-4">
                  <select value={formData.discount_type || 'percentage'} onChange={e => setFormData({...formData, discount_type: e.target.value})} className="flex-1 border p-2 text-[13px]">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                  <input type="number" placeholder="Value" value={formData.discount_value || ''} onChange={e => setFormData({...formData, discount_value: e.target.value})} className="flex-1 border p-2 text-[13px]" />
                </div>
                <button onClick={handleSave} className="w-full py-2 bg-terracotta text-white text-[13px]">Save</button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-[#FFFFFF] border border-[#E8E0D5]">
          <table className="w-full">
            <thead className="border-b border-[#E8E0D5]">
              <tr>
                <th className="text-left px-6 py-3 font-sub text-[11px] text-warm-charcoal uppercase">Code</th>
                <th className="text-left px-6 py-3 font-sub text-[11px] text-warm-charcoal uppercase">Name</th>
                <th className="text-left px-6 py-3 font-sub text-[11px] text-warm-charcoal uppercase">Discount</th>
                <th className="text-right px-6 py-3 font-sub text-[11px] text-warm-charcoal uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0D5]">
              {isLoading ? <tr><td colSpan={4} className="p-4">Loading...</td></tr> : 
               items.map((item: any) => (
                <tr key={item.id} className="hover:bg-[#FBF8F3]">
                  <td className="px-6 py-3 font-sub text-[14px]">{item.code}</td>
                  <td className="px-6 py-3 font-sub text-[14px]">{item.name}</td>
                  <td className="px-6 py-3 font-sub text-[14px]">{item.discount_value} {item.discount_type === 'percentage' ? '%' : '$'}</td>
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
