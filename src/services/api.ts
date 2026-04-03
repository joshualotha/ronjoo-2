/**
 * Base API client for Ronjoo Safaris.
 * Uses native fetch with Sanctum CSRF cookie support.
 * Auto-converts snake_case ↔ camelCase.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// ─── Case Converters ────────────────────────────────
const snakeToCamel = (s: string): string =>
  s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

const camelToSnake = (s: string): string =>
  s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);

function convertKeys(obj: any, converter: (s: string) => string): any {
  if (Array.isArray(obj)) return obj.map((item) => convertKeys(item, converter));
  if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, val]) => [converter(key), convertKeys(val, converter)])
    );
  }
  return obj;
}

export const toCamelCase = (obj: any) => convertKeys(obj, snakeToCamel);
export const toSnakeCase = (obj: any) => convertKeys(obj, camelToSnake);

async function getCsrfCookie(): Promise<void> {
  await fetch(`${API_BASE}/sanctum/csrf-cookie`, {
    credentials: 'include',
  });
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  // Admin API uses token-based auth (Sanctum).
  // If we have a token in sessionStorage, attach it for kijani-desk endpoints.
  if (!headers.Authorization && typeof window !== 'undefined' && path.includes('kijani-desk')) {
    const token = window.sessionStorage.getItem('admin_token');
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  // Get XSRF token from cookie for state-changing requests
  const method = (rest.method || 'GET').toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const xsrfToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];

    if (xsrfToken) {
      headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
    }
  }

  // Auto-convert camelCase body → snake_case for Laravel
  const serializedBody = body ? JSON.stringify(toSnakeCase(body)) : undefined;

  const response = await fetch(`${API_BASE}/api${path}`, {
    ...rest,
    credentials: 'include',
    headers,
    body: serializedBody,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new ApiError(response.status, error.message || 'Request failed', error.errors);
  }

  if (response.status === 204) return {} as T;
  const json = await response.json();
  return toCamelCase(json);
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
  getCsrfCookie,
};

export default api;
