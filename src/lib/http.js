


const RAW = process.env.NEXT_PUBLIC_API_URL;
const BASE_URL = (RAW && RAW.trim()) ? RAW.replace(/\/+$/, '') : '';

function isAbsolute(u) {
    return /^https?:\/\//i.test(u);
}

function buildURL(path, query) {
    let url = isAbsolute(path)
        ? path
        : `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;

    if (query && typeof query === 'object' && Object.keys(query).length > 0) {
        const qs = new URLSearchParams();
            for (const [k, v] of Object.entries(query)) {
            if (v === undefined || v === null || v === '') continue;

            if (Array.isArray(v)) v.forEach(val => qs.append(k, String(val)));
            else qs.append(k, String(v));
        }
        const sep = url.includes('?') ? '&' : '?';
        url += `${sep}${qs.toString()}`;
    }
    return url;
}


export async function request(path, {
    method = 'GET',
    body,
    headers,
    timeout = 15000,
    query,
    credentials, 
} = {}) {
    const url = buildURL(path, query);
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    let res;
    try {
        res = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(headers || {}),
        },
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
    let data;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }

    if (!res.ok) {
        const msg = (data && (data.error || data.message)) || `HTTP ${res.status}`;
        const e = new Error(msg);
        e.status = res.status;
        e.data = data;
        throw e;
    }

    return data;
}

export const http = {
    get: (path, opts) => request(path, { ...opts, method: 'GET' }),
    post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
    put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
    del: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
};

export function getApiBaseUrl() {
    return BASE_URL;
}
