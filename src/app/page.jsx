'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { productosAPI } from '@/lib/api/productos';

    const CATS = [
    { label: 'Juegos Físicos', q: 'JUEGO_FISICO', icon: '🎮' },
    { label: 'Llaves Digitales', q: 'LLAVE_DIGITAL', icon: '🔑' },
    { label: 'Consolas',        q: 'CONSOLA',       icon: '🕹️' },
    { label: 'Accesorios',      q: 'ACCESORIO',     icon: '🎧' },
    { label: 'Coleccionables',  q: 'COLECCIONABLE', icon: '🧸' },
];

export default function Home() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        productosAPI
        .list() // 👈 centralizado y con fallback a localhost si no hay env
        .then((data) => setProductos(Array.isArray(data) ? data.slice(0, 8) : [])) // top 8
        .catch(console.error)
        .finally(() => setLoading(false));
    }, []);

    return (
        <>

        <section className="relative z-10">
            <div className="mx-auto max-w-7xl px-6 pt-14 pb-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs glass">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Online
                <span className="text-white/60">·</span> Nuevos lanzamientos cada semana
            </div>

            <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
                Sube de nivel con{' '}
                <span className="bg-gradient-to-r from-fuchsia-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                PaisaGames
                </span>
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-white/70">
                Juegos, consolas, llaves digitales y coleccionables. Todo lo que necesitas para romper el ranking.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
                <Link href="/producto" className="btn-neon">
                Explorar tienda
                </Link>
                
            </div>
            </div>
        </section>


        <section className="relative z-10 mx-auto max-w-7xl px-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {CATS.map((c) => (
                <Link
                key={c.q}
                href={`/producto?tipo=${encodeURIComponent(c.q)}`} // 👈 llega con filtro aplicado
                className="glass rounded-2xl p-4 hover:scale-[1.02] transition-transform"
                >
                <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-xl">{c.icon}</div>
                    <div>
                    <div className="font-semibold">{c.label}</div>
                    <div className="text-xs text-white/60">Ver más</div>
                    </div>
                </div>
                </Link>
            ))}
            </div>
        </section>


        <section className="relative z-10 mx-auto max-w-7xl px-6 mt-10">
            <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Destacados</h2>
            <Link href="/producto" className="text-sm text-white/70 hover:text-white">
                Ver todo →
            </Link>
            </div>

            {loading ? (
            <div className="p-6 text-white/70">Cargando productos…</div>
            ) : (
            <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {productos.map((p) => (
                <Link
                    key={p._id}
                    href={`/producto/${p._id}`}
                    className="glass rounded-2xl p-3 border border-white/10 hover:border-white/20 transition"
                >
                    <div className="aspect-[4/3] overflow-hidden rounded-xl bg-black/40 mb-3">
                    <img
                        src={p.portada || p.imagenes?.[0]}
                        alt={p.nombre}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                    </div>
                    <div className="flex items-start justify-between gap-2">
                    <div>
                        <h3 className="font-medium leading-tight line-clamp-2">{p.nombre}</h3>
                        <p className="text-xs text-white/60">
                        {p.plataforma} · {p.tipo}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="font-semibold">${Number(p.precio).toLocaleString()}</div>
                        <div className={`text-[10px] ${Number(p.stock) > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {Number(p.stock) > 0 ? 'En stock' : 'Agotado'}
                        </div>
                    </div>
                    </div>
                </Link>
                ))}
            </div>
            )}
        </section>

        <section className="relative z-10 mx-auto max-w-7xl px-6 my-12">
            <div className="glass rounded-2xl p-6 md:p-8 grid md:grid-cols-[1fr_auto] items-center gap-6">
            <div>
                <h3 className="text-2xl font-semibold">¿Listo para el próximo boss?</h3>
                <p className="text-white/70 mt-1">Suscríbete para enterarte de lanzamientos y promos antes que todos.</p>
            </div>
            <Link href="/producto" className="btn-neon text-center">
                Quiero loot
            </Link>
            </div>
        </section>
        </>
    );
}
