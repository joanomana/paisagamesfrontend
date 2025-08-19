'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { productosAPI } from '@/lib/api';

export default function HomePage() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    useEffect(() => {
        productosAPI.list()
            .then(setProductos)
            .catch((e) => setErr(e.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-6">Cargando…</div>;
    if (err) return <div className="p-6 text-red-600">Error: {err}</div>;

    return (
        <main className="max-w-6xl mx-auto p-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {productos.map((p) => (
                <Link
                    key={p._id}
                    href={`/producto/${p._id}`}
                    className="rounded-2xl shadow p-3 bg-white hover:shadow-lg transition"
                >
                    <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 mb-3">
                        {p.portada ? (
                            <img
                                src={p.portada}
                                alt={p.nombre}
                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                        ) : null}
                    </div>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <h3 className="font-medium line-clamp-2">{p.nombre}</h3>
                            <p className="text-xs text-gray-500">
                                {p.plataforma} · {p.tipo}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="font-semibold">${p.precio.toLocaleString()}</div>
                            <div
                                className={`text-xs ${p.stock > 0 ? 'text-emerald-600' : 'text-red-600'
                                    }`}
                            >
                                {p.stock > 0 ? 'En stock' : 'Agotado'}
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </main>
    );
}
