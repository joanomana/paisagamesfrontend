'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { productosAPI } from '@/lib/api/productos';
import { useCartStore } from '@/store/cart';
import { toast } from 'sonner';

export default function ProductoPage() {
    const router = useRouter();
    const { id } = useParams();

    const addItem = useCartStore(s => s.addItem);

    const [producto, setProducto] = useState(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState(null);
    const [imgIndex, setImgIndex] = useState(0);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        productosAPI.get(id)
            .then((p) => {
                setProducto(p);
                setImgIndex(0);
            })
            .catch((e) => setMsg(`Error: ${e.message}`))
            .finally(() => setLoading(false));
    }, [id]);

    const portada = useMemo(
        () => producto?.imagenes?.[imgIndex] ?? producto?.imagenes?.[0],
        [producto, imgIndex]
    );

    const enStock = Number(producto?.stock || 0) > 0;


    const agregarSolo = () => {
        if (!producto) return;
        addItem(producto, qty);
        toast.success('Producto agregado al carrito', {
            description: `${producto.nombre} · x${qty}`,
            action: {
                label: 'Ver carrito',
                onClick: () => router.push('/carrito'),
            },
        });
    };


    const agregarYIrCarrito = () => {
        if (!producto) return;
        addItem(producto, qty);
        toast.success('¡Listo! Lo llevamos al carrito', {
            description: `${producto.nombre} · x${qty}`,
        });
        router.push('/carrito');
    };

    if (loading) return <div className="p-6">Cargando…</div>;
    if (!producto) return <div className="p-6">No encontrado</div>;

    return (
        <main className="max-w-6xl mx-auto p-6">

            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <nav className="text-sm text-white/70">
                    <Link href="/" className="hover:text-white">Inicio</Link>
                    <span className="mx-2">/</span>
                    <Link href="/producto" className="hover:text-white">Productos</Link>
                    <span className="mx-2">/</span>
                    <span className="text-white/90 line-clamp-1">{producto.nombre}</span>
                </nav>

                <button
                    onClick={() => router.back()}
                    className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-sm"
                >
                    ← Volver
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">

                <div>
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-black/30 border border-white/10">
                        {portada ? (
                            <img src={portada} alt={producto.nombre} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full grid place-items-center text-white/40">Sin imagen</div>
                        )}
                    </div>

                    {producto.imagenes?.length > 1 && (
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-3">
                            {producto.imagenes.map((src, i) => (
                                <button
                                    key={i}
                                    onClick={() => setImgIndex(i)}
                                    className={`aspect-[4/3] rounded-lg overflow-hidden border transition
                        ${imgIndex === i ? 'border-cyan-400' : 'border-white/10 hover:border-white/20'}`}
                                    title={`Imagen ${i + 1}`}
                                >
                                    <img src={src} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>


                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold">{producto.nombre}</h1>
                    <p className="text-sm text-white/60 mt-1">
                        {producto.plataforma} · {producto.tipo} · {producto.categoria}
                    </p>


                    <div className="mt-4 flex items-center gap-4">
                        <div className="text-3xl font-bold">${Number(producto.precio).toLocaleString()}</div>
                        <span className={`text-sm ${enStock ? 'text-emerald-400' : 'text-red-400'}`}>
                            {enStock ? `En stock: ${producto.stock}` : 'Agotado'}
                        </span>
                    </div>


                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                        <Badge>Garantía 12 meses</Badge>
                        <Badge>Pago seguro</Badge>
                        <Badge>Devoluciones 7 días</Badge>
                    </div>


                    <p className="mt-4 text-white/80 leading-relaxed">{producto.descripcion}</p>


                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <QtyPicker
                            value={qty}
                            min={1}
                            max={Math.max(1, Number(producto.stock) || 1)}
                            onChange={setQty}
                            disabled={!enStock}
                        />


                        <button
                            onClick={agregarSolo}
                            disabled={!enStock}
                            className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold disabled:opacity-50"
                        >
                            Agregar al carrito
                        </button>


                        <button
                            onClick={agregarYIrCarrito}
                            disabled={!enStock}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white font-semibold disabled:opacity-50"
                        >
                            Comprar
                        </button>


                        <button
                            className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-sm"
                            onClick={() => {
                                const shareText = `${producto.nombre} — $${Number(producto.precio).toLocaleString()}`;
                                if (navigator.share) {
                                    navigator.share({ title: producto.nombre, text: shareText, url: window.location.href }).catch(() => { });
                                } else {
                                    navigator.clipboard.writeText(window.location.href);
                                    toast('Enlace copiado', { description: 'URL copiada al portapapeles' });
                                }
                            }}
                        >
                            Compartir
                        </button>
                    </div>

                    {msg && <div className="mt-3 text-sm">{msg}</div>}


                    <section className="mt-8 rounded-2xl p-4 border border-white/10 bg-white/5">
                        <h3 className="font-semibold mb-2">🚚 Envíos a nivel nacional (Colombia)</h3>
                        <ul className="text-sm text-white/80 space-y-1">
                            <li>• Ciudades principales: 1–3 días hábiles.</li>
                            <li>• Otras ciudades/municipios: 3–6 días hábiles.</li>
                            <li>• Costo: desde $10.000 COP (según destino y peso).</li>
                            <li>• Rastreo disponible una vez despachado.</li>
                        </ul>
                        <p className="text-xs text-white/50 mt-2">* Tiempos estimados sujetos a la transportadora.</p>
                    </section>


                    <section className="mt-4 grid sm:grid-cols-3 gap-3">
                        <InfoCard title="Pagos" desc="Tarjeta, PSE y pagos en efectivo vía convenios." />
                        <InfoCard title="Garantía" desc="Productos nuevos con garantía oficial." />
                        <InfoCard title="Devoluciones" desc="7 días para cambios por defectos de fábrica." />
                    </section>
                </div>
            </div>


            <section className="mt-10">
                <h3 className="text-lg font-semibold mb-3">Ficha técnica</h3>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                        <Row k="Tipo" v={producto.tipo} />
                        <Row k="Plataforma" v={producto.plataforma} />
                        <Row k="Categoría" v={producto.categoria} />
                        {'createdAt' in producto && <Row k="Creado" v={formatDate(producto.createdAt)} />}
                        {'updatedAt' in producto && <Row k="Actualizado" v={formatDate(producto.updatedAt)} />}


                        {producto.metadata && typeof producto.metadata === 'object' &&
                            Object.entries(producto.metadata).map(([k, v]) => (
                                <Row key={k} k={prettyKey(k)} v={String(v)} />
                            ))
                        }
                    </dl>
                </div>
            </section>


            <section className="mt-8 rounded-2xl p-5 border border-white/10 bg-white/5 flex flex-wrap items-center justify-between gap-3">
                <div className="text-white/80">
                    ¿Necesitas ayuda con {producto.nombre}? Nuestro equipo puede asesorarte en la compra.
                </div>
                <Link
                    href="/soporte"
                    className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-sm"
                >
                    Hablar con soporte
                </Link>
            </section>
        </main>
    );
}

/* ---------- subcomponentes ---------- */

function QtyPicker({ value, onChange, min = 1, max = 99, disabled }) {
    const dec = () => onChange(Math.max(min, Number(value) - 1));
    const inc = () => onChange(Math.min(max, Number(value) + 1));
    return (
        <div className="inline-flex items-center rounded-xl border border-white/10 bg-white/5">
            <button onClick={dec} disabled={disabled || value <= min} className="px-3 py-2 disabled:opacity-40">−</button>
            <input
                type="number"
                min={min}
                max={max}
                value={value}
                onChange={(e) => {
                    const n = Number(e.target.value || min);
                    onChange(Math.max(min, Math.min(max, n)));
                }}
                className="w-16 text-center bg-transparent outline-none py-2"
                disabled={disabled}
            />
            <button onClick={inc} disabled={disabled || value >= max} className="px-3 py-2 disabled:opacity-40">+</button>
        </div>
    );
}

function Badge({ children }) {
    return (
        <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1">{children}</span>
    );
}

function InfoCard({ title, desc }) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-sm font-semibold">{title}</div>
            <div className="text-xs text-white/70">{desc}</div>
        </div>
    );
}

function Row({ k, v }) {
    return (
        <>
            <dt className="text-white/60">{k}</dt>
            <dd className="text-white/90">{v}</dd>
        </>
    );
}

function prettyKey(s) {
    return String(s).replace(/[_-]+/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}

function formatDate(d) {
    try {
        return new Date(d).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
    } catch {
        return String(d);
    }
}
