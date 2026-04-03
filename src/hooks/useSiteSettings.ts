import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPublicSettings } from '@/services/publicApi';

const defaults: Record<string, string> = {
  business_name: 'Ronjoo Safaris',
  tagline: 'Where Africa Reveals Itself',
  whatsapp_number: '+255 747 394 631',
  email_address: 'info@ronjoosafaris.co.tz',
  physical_address: 'Arusha, Tanzania',
  instagram_url: '#',
  facebook_url: '#',
  youtube_url: '#',
  tripadvisor_url: '#',
  years_operating: '18',
  travelers_hosted: '4200',
  tripadvisor_rating: '4.9',
  announcement_banner: 'Early bird offer now live.',
};

export function useSiteSettings() {
  const query = useQuery({
    queryKey: ['public-settings'],
    queryFn: () => getPublicSettings(),
    staleTime: 60_000,
  });

  const map = useMemo(() => {
    const merged = { ...defaults };
    for (const item of query.data ?? []) {
      if (item?.key) merged[item.key] = String(item.value ?? '');
    }
    return merged;
  }, [query.data]);

  return {
    settings: map,
    isLoading: query.isLoading,
  };
}
