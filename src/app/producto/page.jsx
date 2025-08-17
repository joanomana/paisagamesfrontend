'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { productosAPI } from '@/lib/api/productos';

const TIPOS = ["JUEGO_FISICO","LLAVE_DIGITAL","CONSOLA","ACCESORIO","COLECCIONABLE"];
const PLATAFORMAS = ["XBOX","PLAYSTATION","NINTENDO","PC","STEAM","EPIC","VALORANT","MULTI"];

const fmt = (s) => s.replaceAll('_',' ');

export default function ProductoListPage() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);


    const [q, setQ] = useState("");
    const [tipo, setTipo] = useState("");
    const [plataforma, setPlataforma] = useState("");
    const [categoria, setCategoria] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [onlyStock, setOnlyStock] = useState(false);
    const [sort, setSort] = useState("recientes");


    useEffect(() => {
        setLoading(true);
        productosAPI
        .list() 
        .then((data) => setProductos(Array.isArray(data) ? data : []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }, []);


    useEffect(() => {
        if (typeof window === 'undefined') return;
        const sp = new URLSearchParams(window.location.search);

        const _q = sp.get('q') ?? '';
        const _tipo = sp.get('tipo') ?? '';
        const _plataforma = sp.get('plataforma') ?? '';
        const _categoria = sp.get('categoria') ?? '';
        const _min = sp.get('min') ?? '';
        const _max = sp.get('max') ?? '';
        const _stock = sp.get('stock') ?? '';           
        const _sort = sp.get('sort') ?? 'recientes';

        if (_q) setQ(_q);
        if (_tipo && TIPOS.includes(_tipo)) setTipo(_tipo);
        if (_plataforma && PLATAFORMAS.includes(_plataforma)) setPlataforma(_plataforma);
        if (_categoria) setCategoria(_categoria);
        if (_min && !Number.isNaN(Number(_min))) setMinPrice(_min);
        if (_max && !Number.isNaN(Number(_max))) setMaxPrice(_max);
        if (_stock === '1' || _stock === 'true') setOnlyStock(true);
        if (['recientes','precio_asc','precio_desc','nombre'].includes(_sort)) setSort(_sort);
    }, []);


    const categorias = useMemo(() => {
        const set = new Set();
        productos.forEach(p => p.categoria && set.add(p.categoria));
        return Array.from(set).sort((a,b)=>a.localeCompare(b));
    }, [productos]);

    const norm = (s) => (s || "").toString().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu,"");


    const filtered = useMemo(() => {
        let rows = [...productos];

        const nq = norm(q);
        if (nq) {
        rows = rows.filter(p => norm(p.nombre).includes(nq) || norm(p.categoria).includes(nq));
        }

        if (tipo) rows = rows.filter(p => p.tipo === tipo);
        if (plataforma) rows = rows.filter(p => p.plataforma === plataforma);
        if (categoria) rows = rows.filter(p => p.categoria === categoria);

        const min = minPrice !== "" ? Number(minPrice) : null;
        const max = maxPrice !== "" ? Number(maxPrice) : null;
        if (min !== null) rows = rows.filter(p => Number(p.precio) >= min);
        if (max !== null) rows = rows.filter(p => Number(p.precio) <= max);

        if (onlyStock) rows = rows.filter(p => Number(p.stock) > 0);

        switch (sort) {
        case "precio_asc":  rows.sort((a,b)=> Number(a.precio) - Number(b.precio)); break;
        case "precio_desc": rows.sort((a,b)=> Number(b.precio) - Number(a.precio)); break;
        case "nombre":      rows.sort((a,b)=> a.nombre.localeCompare(b.nombre));   break;
        default:            rows.sort((a,b)=> new Date(b.createdAt||0) - new Date(a.createdAt||0));
        }

        return rows;
    }, [productos, q, tipo, plataforma, categoria, minPrice, maxPrice, onlyStock, sort]);

    return (
        <div className="mx-auto max-w-7xl p-6 grid lg:grid-cols-[280px_1fr] gap-6">

        <aside className="lg:sticky lg:top-20 h-max rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
            <h2 className="text-sm font-semibold tracking-wide uppercase text-white/70">Filtros</h2>


            <div className="mt-3">
            <label className="text-xs text-white/60">Buscar</label>
            <div className="mt-1 relative">
                <input
                value={q}
                onChange={(e)=>setQ(e.target.value)}
                placeholder="Nombre o categoría…"
                className="w-full rounded-xl bg-white/5 px-3 py-2 text-sm text-white placeholder-white/50 outline-none border border-white/10 focus:border-cyan-400/60"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
                <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M10 4a6 6 0 1 1 0 12a6 6 0 0 1 0-12m8.32 13.91l-3.15-3.15A7.5 7.5 0 1 1 10 2.5a7.5 7.5 0 0 1 5.78 12.32l3.15 3.15l-1.41 1.41Z"/></svg>
                </span>
            </div>
            </div>


            <div className="mt-3">
            <label className="text-xs text-white/60">Tipo</label>
            <div className="mt-1 relative">
                <select
                value={tipo}
                onChange={(e)=>setTipo(e.target.value)}
                className="w-full appearance-none pr-9 rounded-xl bg-white/5 px-3 py-2 text-sm outline-none border border-white/10 focus:border-cyan-400/60 text-white"
                >
                <option value="" className="text-gray-900">Todos</option>
                {TIPOS.map(t => (
                    <option key={t} value={t} className="text-gray-900">
                    {fmt(t)}
                    </option>
                ))}
                </select>
                <Caret />
            </div>
            </div>


            <div className="mt-3">
            <label className="text-xs text-white/60">Plataforma</label>
            <div className="mt-1 relative">
                <select
                value={plataforma}
                onChange={(e)=>setPlataforma(e.target.value)}
                className="w-full appearance-none pr-9 rounded-xl bg-white/5 px-3 py-2 text-sm outline-none border border-white/10 focus:border-cyan-400/60 text-white"
                >
                <option value="" className="text-gray-900">Todas</option>
                {PLATAFORMAS.map(p => (
                    <option key={p} value={p} className="text-gray-900">
                    {p}
                    </option>
                ))}
                </select>
                <Caret />
            </div>
            </div>


            <div className="mt-3">
            <label className="text-xs text-white/60">Categoría</label>
            <div className="mt-1 relative">
                <select
                value={categoria}
                onChange={(e)=>setCategoria(e.target.value)}
                className="w-full appearance-none pr-9 rounded-xl bg-white/5 px-3 py-2 text-sm outline-none border border-white/10 focus:border-cyan-400/60 text-white"
                >
                <option value="" className="text-gray-900">Todas</option>
                {categorias.map(c => (
                    <option key={c} value={c} className="text-gray-900">
                    {c}
                    </option>
                ))}
                </select>
                <Caret />
            </div>
            </div>


            <div className="mt-3">
            <label className="text-xs text-white/60">Precio</label>
            <div className="mt-1 grid grid-cols-2 gap-2">
                <input
                type="number"
                min={0}
                value={minPrice}
                onChange={(e)=>setMinPrice(e.target.value)}
                placeholder="Mín"
                className="w-full rounded-xl bg-white/5 px-3 py-2 text-sm text-white placeholder-white/50 outline-none border border-white/10 focus:border-cyan-400/60"
                />
                <input
                type="number"
                min={0}
                value={maxPrice}
                onChange={(e)=>setMaxPrice(e.target.value)}
                placeholder="Máx"
                className="w-full rounded-xl bg-white/5 px-3 py-2 text-sm text-white placeholder-white/50 outline-none border border-white/10 focus:border-cyan-400/60"
                />
            </div>
            </div>


            <div className="mt-3 flex items-center gap-2">
            <input
                id="stock"
                type="checkbox"
                checked={onlyStock}
                onChange={(e)=>setOnlyStock(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/5"
            />
            <label htmlFor="stock" className="text-sm text-white/80">Solo disponibles</label>
            </div>


            <div className="mt-3">
            <label className="text-xs text-white/60">Ordenar por</label>
            <div className="mt-1 relative">
                <select
                value={sort}
                onChange={(e)=>setSort(e.target.value)}
                className="w-full appearance-none pr-9 rounded-xl bg-white/5 px-3 py-2 text-sm outline-none border border-white/10 focus:border-cyan-400/60 text-white"
                >
                <option value="recientes" className="text-gray-900">Más recientes</option>
                <option value="precio_asc" className="text-gray-900">Precio (menor a mayor)</option>
                <option value="precio_desc" className="text-gray-900">Precio (mayor a menor)</option>
                <option value="nombre" className="text-gray-900">Nombre (A–Z)</option>
                </select>
                <Caret />
            </div>
            </div>


            <button
            onClick={()=>{
                setQ(""); setTipo(""); setPlataforma(""); setCategoria("");
                setMinPrice(""); setMaxPrice(""); setOnlyStock(false); setSort("recientes");
            }}
            className="mt-4 w-full rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-2 text-sm"
            >
            Limpiar filtros
            </button>
        </aside>


        <main>
            {loading ? (
            <div className="p-6">Cargando…</div>
            ) : filtered.length === 0 ? (
            <div className="p-6 text-white/70">No se encontraron productos con esos filtros.</div>
            ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filtered.map((p) => (
                <Link
                    href={`/producto/${p._id}`}
                    key={p._id}
                    className="rounded-2xl shadow p-3 bg-white/5 hover:bg-white/10 hover:shadow-lg transition border border-white/10"
                >
                    <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-900 mb-3">
                    <img
                        src={p.portada || p.imagenes?.[0]}
                        alt={p.nombre}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                    </div>
                    <div className="flex items-start justify-between gap-2 text-white">
                    <div>
                        <h3 className="font-medium leading-tight line-clamp-2">{p.nombre}</h3>
                        <p className="text-xs text-white/60">{p.plataforma} · {p.tipo}</p>
                    </div>
                    <div className="text-right">
                        <div className="font-semibold">${Number(p.precio).toLocaleString()}</div>
                        <div className={`text-xs ${Number(p.stock)>0?'text-emerald-400':'text-red-400'}`}>
                        {Number(p.stock)>0 ? 'En stock' : 'Agotado'}
                        </div>
                    </div>
                    </div>
                </Link>
                ))}
            </div>
            )}
        </main>
        </div>
    );
}

function Caret() {
    return (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60">
        <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M7 10l5 5 5-5z"/>
        </svg>
        </span>
    );
}
