/**
 * Public API client for Ronjoo Safaris.
 * Read-only endpoints for the public-facing website.
 *
 * NOTE: The API client (api.ts) uses fetch and returns parsed JSON directly.
 * Laravel ResourceCollections without pagination return flat arrays (no { data } wrapper).
 * Single resources also return flat objects.
 */
import api from './api';

// ─── Safaris ───────────────────────────────────────
export const getSafaris = () =>
  api.get<any[]>('/safaris');

export const getSafariBySlug = (slug: string) =>
  api.get<any>(`/safaris/${slug}`);

// ─── Destinations ──────────────────────────────────
export const getDestinations = () =>
  api.get<any[]>('/destinations');

export const getDestinationBySlug = (slug: string) =>
  api.get<any>(`/destinations/${slug}`);

// ─── Add-Ons ───────────────────────────────────────
export const getAddOns = () =>
  api.get<any[]>('/add-ons');

export const getAddOnBySlug = (slug: string) =>
  api.get<any>(`/add-ons/${slug}`);

// ─── FAQs ──────────────────────────────────────────
export const getFaqs = () =>
  api.get<any[]>('/faqs');

// ─── Travel Guides ─────────────────────────────────
export const getTravelGuides = () =>
  api.get<any[]>('/travel-guides');

export const getTravelGuideBySlug = (slug: string) =>
  api.get<any>(`/travel-guides/${slug}`);

// ─── Reviews ───────────────────────────────────────
export const getReviews = () =>
  api.get<any[]>('/reviews');

export const submitReview = (data: Record<string, unknown>) =>
  api.post('/reviews', data);

// ─── Blog Posts ────────────────────────────────────
export const getBlogPosts = () =>
  api.get<any[]>('/blog-posts');

export const getBlogPostBySlug = (slug: string) =>
  api.get<any>(`/blog-posts/${slug}`);

// ─── Departures ────────────────────────────────────
export const getDepartures = () =>
  api.get<any[]>('/departures');

export const getPublicSettings = (groups = 'general,social,homepage,integrations,maintenance') =>
  api.get<Array<{ key: string; value: string; group: string | null }>>(
    `/settings?group=${encodeURIComponent(groups)}`
  );

// ─── Public Form Submissions ───────────────────────
export const submitEnquiry = (data: Record<string, unknown>) =>
  api.post('/enquiries', data);

export const subscribeNewsletter = (data: { email: string; name?: string }) =>
  api.post('/subscribers', data);
