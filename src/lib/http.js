const RAW_PUBLIC = process.env.NEXT_PUBLIC_API_URL;   
const RAW_SERVER = process.env.BACKEND_ORIGIN;        


const IS_SERVER = typeof window === 'undefined';


const norm = (s) => (s && s.trim() ? s.replace(/\/+$/, '') : s);


const BASE_BROWSER = norm(RAW_PUBLIC) || '';                         
const BASE_SERVER  = norm(RAW_SERVER) || 'http://127.0.0.1:4000';    

const BASE_URL = IS_SERVER ? BASE_SERVER : BASE_BROWSER;

function isAbsolute(u) { return /^https?:\/\//i.test(u); }

function buildURL(path, query) {
    let url = isAbsolute(path) ? path : `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
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

export async function request(path, { method='GET', body, headers, timeout=15000, query, credentials } = {}) {
    const url = buildURL(path, query);
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    let res;
    try {
        res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...(headers || {}) },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        cache: 'no-store',
        credentials,
        });
    } catch (err) {
        clearTimeout(id);
        throw new Error(`Fetch error: ${err.message}`);
    }
    clearTimeout(id);
    const text = await res.text();
    let data; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!res.ok) {
        const msg = (data && (data.error || data.message)) || `HTTP ${res.status}`;
        const e = new Error(msg); e.status = res.status; e.data = data; throw e;
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
