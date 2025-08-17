const RAW_PUBLIC = process.env.NEXT_PUBLIC_API_URL;   // público (solo si tu backend tiene HTTPS propio)
const RAW_SERVER = process.env.BACKEND_ORIGIN;        // server-only (ideal en Vercel: http://IP:PUERTO o https://api.tu.dom)

const IS_SERVER = typeof window === 'undefined';
const norm = (s) => (s && s.trim() ? s.replace(/\/+$/, '') : s);

// Base para navegador: relativa (usa rewrites / proxy)
const BASE_BROWSER = norm(RAW_PUBLIC) || '';

// Base para servidor:
// 1) BACKEND_ORIGIN (directo al backend)  2) dominio propio (VERCEL_URL / NEXT_PUBLIC_SITE_URL) para usar rewrites
// 3) fallback local
const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

const BASE_SERVER = norm(RAW_SERVER) || norm(SITE_ORIGIN) || 'http://127.0.0.1:4000';

const BASE_URL = IS_SERVER ? BASE_SERVER : BASE_BROWSER;

function isAbsolute(u) { return /^https?:\/\//i.test(u); }

function buildURL(path, query) {
  let url = isAbsolute(path)
    ? path
    : `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;

  if (query && typeof query === 'object' && Object.keys(query).length > 0) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === '') continue;
      Array.isArray(v) ? v.forEach(val => qs.append(k, String(val))) : qs.append(k, String(v));
    }
    url += (url.includes('?') ? '&' : '?') + qs.toString();
  }
  return url;
}

export async function request(
  path,
  { method = 'GET', body, headers, timeout = 15000, query, credentials } = {}
) {
  const url = buildURL(path, query);
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  // Evita forzar Content-Type en peticiones sin body
  const computedHeaders = { ...(headers || {}) };
  if (body && !computedHeaders['Content-Type']) {
    computedHeaders['Content-Type'] = 'application/json';
  }

  let res;
  try {
    res = await fetch(url, {
      method,
      headers: computedHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      cache: 'no-store',
      credentials,
    });
  } catch (err) {
    clearTimeout(id);
    throw new Error(`Fetch error: ${err.message} | url=${url}`);
  }
  clearTimeout(id);

  const text = await res.text();
  let data; try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `HTTP ${res.status}`;
    const e = new Error(msg);
    e.status = res.status;
    e.data = data;
    e.url = url;
    throw e;
  }
  return data;
}

export const http = {
  get: (p, o) => request(p, { ...o, method: 'GET' }),
  post: (p, b, o) => request(p, { ...o, method: 'POST', body: b }),
  put: (p, b, o) => request(p, { ...o, method: 'PUT', body: b }),
  del: (p, o) => request(p, { ...o, method: 'DELETE' }),
};

export function getApiBaseUrl() { return BASE_URL; }
