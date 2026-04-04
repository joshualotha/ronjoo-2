/**
 * Admin API client for Ronjoo Safaris.
 * Authenticated CRUD endpoints for the admin dashboard.
 */
import api from './api';

// ─── Auth ──────────────────────────────────────────
export const adminLogin = async (email: string, password: string) => {
  return api.post<{ token: string; user: any }>('/kijani-desk/login', { email, password });
};

export const adminLogout = () => api.post('/kijani-desk/logout');

export const adminMe = () => api.get<{ user: any }>('/kijani-desk/me');
export const updateAdminProfile = (data: { name?: string; email?: string; password?: string }) =>
  api.patch<{ user: any }>('/kijani-desk/profile', data);

// ─── Dashboard ─────────────────────────────────────
export const getDashboard = () => api.get<any>('/kijani-desk/dashboard');

// ─── Generic CRUD helper ───────────────────────────
function crudEndpoints<T = any>(basePath: string) {
  return {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return api.get<T[]>(`/kijani-desk/${basePath}${qs}`);
    },
    show: (id: number | string) =>
      api.get<T>(`/kijani-desk/${basePath}/${id}`),
    create: (data: Partial<T>) =>
      api.post<T>(`/kijani-desk/${basePath}`, data),
    update: (id: number | string, data: Partial<T>) =>
      api.put<T>(`/kijani-desk/${basePath}/${id}`, data),
    destroy: (id: number | string) =>
      api.delete(`/kijani-desk/${basePath}/${id}`),
  };
}

// ─── Entity endpoints ──────────────────────────────
export const bookingsApi = crudEndpoints('bookings');
export const enquiriesApi = {
  ...crudEndpoints('enquiries'),
  reply: (id: number | string, message: string, from: 'admin' | 'guest' = 'admin') =>
    api.post(`/kijani-desk/enquiries/${id}/reply`, { message, from }),
  convertToBooking: (id: number | string, ref?: string) =>
    api.post(`/kijani-desk/enquiries/${id}/convert`, ref ? { ref } : {}),
};
export const safarisApi = crudEndpoints('safaris');
export const destinationsApi = crudEndpoints('destinations');
export const departuresApi = crudEndpoints('departures');
export const reviewsApi = {
  ...crudEndpoints('reviews'),
  updateStatus: (id: number | string, status: string) =>
    api.patch(`/kijani-desk/reviews/${id}/status`, { status }),
  saveResponse: (id: number | string, owner_response: string) =>
    api.patch(`/kijani-desk/reviews/${id}/response`, { owner_response }),
};
export const blogPostsApi = crudEndpoints('blog-posts');
export const faqsApi = {
  ...crudEndpoints('faqs'),
  createCategory: (name: string) =>
    api.post('/kijani-desk/faq-categories', { name }),
};
export const teamApi = crudEndpoints('team');
export const subscribersApi = crudEndpoints('subscribers');
export const addOnsApi = crudEndpoints('add-ons');
export const galleryImagesApi = crudEndpoints('gallery-images');

export const waitlistsApi = crudEndpoints('waitlists');
export const promotionsApi = crudEndpoints('promotions');
export const seoApi = crudEndpoints('seo');
export const emailTemplatesApi = crudEndpoints('email-templates');
export const settingsAppApi = crudEndpoints('settings');
export const usersApi = crudEndpoints('users');

export const notificationsApi = {
  list: () => api.get<{ unreadCount: number; notifications: any[] }>('/kijani-desk/notifications'),
  read: (id: number | string) => api.patch('/kijani-desk/notifications/' + id + '/read'),
  readAll: () => api.patch('/kijani-desk/notifications/read-all'),
};

/**
 * Upload images via multipart/form-data.
 * Returns an array of public URLs for the uploaded files.
 */
export const uploadImages = async (files: File[], folder = 'safaris'): Promise<string[]> => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const formData = new FormData();
  files.forEach((file) => formData.append('images[]', file));
  formData.append('folder', folder);

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  const token = window.sessionStorage.getItem('admin_token');
  if (token) headers.Authorization = `Bearer ${token}`;

  const xsrfToken = document.cookie
    .split('; ')
    .find((row) => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];
  if (xsrfToken) headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);

  const res = await fetch(`${API_BASE}/api/kijani-desk/upload`, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(err.message || 'Upload failed');
  }

  const json = await res.json();
  return json.urls;
};
