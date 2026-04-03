import { useEffect, useMemo, useState } from 'react';
import AdminTopBar from '../components/AdminTopBar';
import { useAdminCrud } from '../hooks/useAdminCrud';
import { settingsAppApi } from '../../services/adminApi';

type FieldType = 'text' | 'email' | 'url' | 'number' | 'toggle';
type SettingsField = {
  label: string;
  key: string;
  type: FieldType;
  placeholder?: string;
  defaultValue?: string;
};

const settingsTabs = ['General', 'Social Media', 'Homepage', 'Integrations', 'Maintenance'] as const;
type SettingsTab = (typeof settingsTabs)[number];

const fieldsByTab: Record<SettingsTab, SettingsField[]> = {
  General: [
    { label: 'Business Name', key: 'business_name', type: 'text', defaultValue: 'Ronjoo Safaris' },
    { label: 'Tagline', key: 'tagline', type: 'text', defaultValue: 'Where Africa Reveals Itself' },
    { label: 'WhatsApp Number', key: 'whatsapp_number', type: 'text', defaultValue: '+255 XXX XXX XXX' },
    { label: 'Email Address', key: 'email_address', type: 'email', defaultValue: 'info@ronjoosafaris.co.tz' },
    { label: 'Physical Address', key: 'physical_address', type: 'text', defaultValue: 'Arusha, Tanzania' },
  ],
  'Social Media': [
    { label: 'Instagram URL', key: 'instagram_url', type: 'url', placeholder: 'https://...' },
    { label: 'Facebook URL', key: 'facebook_url', type: 'url', placeholder: 'https://...' },
    { label: 'YouTube URL', key: 'youtube_url', type: 'url', placeholder: 'https://...' },
    { label: 'TripAdvisor URL', key: 'tripadvisor_url', type: 'url', placeholder: 'https://...' },
  ],
  Homepage: [
    { label: 'Years Operating', key: 'years_operating', type: 'number', defaultValue: '18' },
    { label: 'Travelers Hosted', key: 'travelers_hosted', type: 'number', defaultValue: '4200' },
    { label: 'TripAdvisor Rating', key: 'tripadvisor_rating', type: 'text', defaultValue: '4.9' },
    { label: 'Announcement Banner', key: 'announcement_banner', type: 'text', defaultValue: 'Early bird offer now live.' },
  ],
  Integrations: [
    { label: 'Google Analytics ID', key: 'google_analytics_id', type: 'text', placeholder: 'Enter key...' },
    { label: 'Facebook Pixel ID', key: 'facebook_pixel_id', type: 'text', placeholder: 'Enter key...' },
    { label: 'Stripe Publishable Key', key: 'stripe_publishable_key', type: 'text', placeholder: 'Enter key...' },
  ],
  Maintenance: [
    { label: 'Maintenance Mode', key: 'maintenance_mode', type: 'toggle', defaultValue: 'false' },
  ],
};

function groupKeyFromTab(tab: SettingsTab): string {
  if (tab === 'General') return 'general';
  if (tab === 'Social Media') return 'social';
  if (tab === 'Homepage') return 'homepage';
  if (tab === 'Integrations') return 'integrations';
  return 'maintenance';
}

export default function AdminSettings() {
  const { items, isLoading, error, create, update } = useAdminCrud('settings', settingsAppApi);
  const [tab, setTab] = useState<SettingsTab>('General');
  const [values, setValues] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const settingsByKey = useMemo(() => {
    const map: Record<string, any> = {};
    for (const item of items as any[]) {
      map[item.key] = item;
    }
    return map;
  }, [items]);

  useEffect(() => {
    const next: Record<string, string> = {};
    for (const t of settingsTabs) {
      for (const field of fieldsByTab[t]) {
        const existing = settingsByKey[field.key];
        next[field.key] = String(existing?.value ?? field.defaultValue ?? '');
      }
    }
    setValues(next);
  }, [settingsByKey]);

  const handleSaveTab = async () => {
    setIsSaving(true);
    try {
      const group = groupKeyFromTab(tab);
      for (const field of fieldsByTab[tab]) {
        const rawValue = values[field.key] ?? '';
        const value = field.type === 'toggle' ? (rawValue === 'true' ? 'true' : 'false') : rawValue;
        const existing = settingsByKey[field.key];
        const payload = { key: field.key, value, group };
        if (existing?.id) {
          await update(existing.id, payload as any);
        } else {
          await create(payload as any);
        }
      }
      alert('Settings saved.');
    } catch (e: any) {
      alert(e?.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <AdminTopBar title="Site Settings" />
      <div className="p-8">
        <div className="flex gap-0 border-b border-[#E8E0D5] mb-6">
          {settingsTabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 font-sub font-normal text-[13px] border-b-2 transition-colors ${tab === t ? 'border-terracotta text-terracotta' : 'border-transparent text-warm-charcoal hover:text-warm-charcoal'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 bg-[#FFFFFF] border border-[#E8E0D5] p-4">
            <p className="font-sub font-normal text-[13px] text-red-500">Failed to load settings. Please refresh and try again.</p>
          </div>
        )}

        <div className="bg-[#FFFFFF] border border-[#E8E0D5] p-8 max-w-[700px]">
          {isLoading ? (
            <p className="font-sub font-normal text-[13px] text-warm-charcoal">Loading settings...</p>
          ) : (
            <div className="space-y-6">
              {fieldsByTab[tab].map((field) => (
                <div key={field.key}>
                  <label className="font-sub text-[11px] text-warm-charcoal uppercase tracking-[0.15em] mb-1.5 block">{field.label}</label>
                  {field.type === 'toggle' ? (
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setValues((prev) => ({ ...prev, [field.key]: prev[field.key] === 'true' ? 'false' : 'true' }))}
                        className={`w-10 h-5 cursor-pointer relative ${values[field.key] === 'true' ? 'bg-sage' : 'bg-faded-sand'}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 bg-[#FFFFFF] ${values[field.key] === 'true' ? 'left-[22px]' : 'left-0.5'}`} />
                      </button>
                      <span className="font-sub font-normal text-[12px] text-warm-charcoal">
                        {values[field.key] === 'true' ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={values[field.key] ?? ''}
                      onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      className="w-full h-[44px] px-4 font-sub font-normal text-[14px] text-warm-charcoal bg-transparent border border-[#E8E0D5] outline-none focus:border-terracotta transition-colors"
                    />
                  )}
                </div>
              ))}
              <button
                onClick={handleSaveTab}
                disabled={isSaving}
                className="px-6 py-2.5 bg-terracotta text-warm-canvas font-sub font-normal text-[13px] uppercase tracking-[0.1em] hover:opacity-90 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
