import { useState } from 'react';
import AdminTopBar from '../components/AdminTopBar';
import { useAdmin } from '../context/AdminContext';
import { updateAdminProfile } from '../../services/adminApi';

export default function AdminProfile() {
  const { user, refreshMe } = useAdmin();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    setSaving(true);
    try {
      await updateAdminProfile({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password.trim() || undefined,
      });
      await refreshMe();
      setForm((prev) => ({ ...prev, password: '' }));
      alert('Profile updated successfully.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminTopBar title="Profile" />
      <div className="p-8">
        <div className="max-w-[520px] bg-[#FFFFFF] border border-[#E8E0D5] p-6 space-y-4">
          <div>
            <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
          </div>
          <div>
            <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
          </div>
          <div>
            <label className="font-sub font-normal text-[11px] text-warm-charcoal uppercase tracking-[0.15em]">New Password (optional)</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1 w-full h-[40px] px-3 border border-[#E8E0D5] outline-none focus:border-terracotta" />
          </div>
          <button disabled={saving} onClick={onSave} className="px-5 py-2 bg-terracotta text-warm-canvas font-sub font-normal text-[13px] uppercase tracking-[0.1em] hover:opacity-90 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}
