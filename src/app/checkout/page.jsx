'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { ventasAPI } from '@/lib/api/ventas';
import { toast } from 'sonner';

export default function CheckoutPage() {
    const router = useRouter();

    const items = useCartStore((s) => s.items);
    const clear = useCartStore((s) => s.clear);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (mounted && items.length === 0) {
            router.replace('/carrito');
        }
    }, [mounted, items.length, router]);

    const tot = useMemo(
        () => items.reduce((acc, i) => acc + i.cantidad * i.precio, 0),
        [items]
    );

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [metodo, setMetodo] = useState(null);
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (!mounted || items.length === 0) return;

        if (!metodo) {
            toast.error('Selecciona un método de pago', {
                description: 'Elige Tarjeta o PSE para continuar.',
            });
            return;
        }

        try {
            setLoading(true);
            const payload = {
                items: items.map((i) => ({ productoId: i.id, cantidad: i.cantidad })),
                cliente: { nombre, email },
                metadatos: { canal: 'web', moneda: 'COP', metodoPago: metodo },
            };

            const venta = await ventasAPI.checkout(payload);

            clear();
            toast.success('¡Gracias por tu compra!', {
                description: `Pedido #${venta._id?.slice(-6)} por $${venta.total?.toLocaleString()}`,
            });

            router.push(`/carrito?success=${venta._id || 'ok'}`);
        } catch (err) {
            toast.error('No se pudo completar el pago', {
                description: err?.message || 'Intenta de nuevo',
            });
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) {
        return (
            <main className="max-w-5xl mx-auto p-6">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">Cargando…</div>
            </main>
        );
    }

    if (items.length === 0) {
        return (
            <main className="max-w-5xl mx-auto p-6">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/80">
                    Tu carrito está vacío.{' '}
                    <Link href="/producto" className="text-cyan-300 hover:underline">
                        Empieza a comprar →
                    </Link>
                </div>
            </main>
        );
    }

    const baseBtn =
        'rounded-xl border px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-2';
    const unselected =
        'border-white/10 bg-white/5 hover:bg-white/10 focus-visible:ring-cyan-400/40';
    const selected =
        'border-cyan-400/60 bg-cyan-400/10 ring-2 ring-cyan-400/30';

    return (
        <main className="max-w-5xl mx-auto p-6">
            <div className="mb-4">
                <Link href="/carrito" className="text-sm text-white/70 hover:text-white">
                    ← Volver al carrito
                </Link>
            </div>

            <div className="grid md:grid-cols-[1fr_360px] gap-6">

                <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <h1 className="text-2xl font-semibold mb-4">Información de pago</h1>

                    <form onSubmit={submit} className="grid gap-4">
                        <div>
                            <label className="text-sm text-white/70">Nombre completo</label>
                            <input
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                                className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none border border-white/10 focus:border-cyan-400/60"
                                placeholder="Tu nombre"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-white/70">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none border border-white/10 focus:border-cyan-400/60"
                                placeholder="tunombre@correo.com"
                            />
                        </div>


                        <div>
                            <label className="text-sm text-white/70">Método de pago</label>
                            <div
                                className="mt-2 grid grid-cols-2 gap-2"
                                role="radiogroup"
                                aria-label="Selecciona un método de pago"
                            >
                                <button
                                    type="button"
                                    role="radio"
                                    aria-checked={metodo === 'tarjeta'}
                                    onClick={() => setMetodo('tarjeta')}
                                    className={`${baseBtn} ${metodo === 'tarjeta' ? selected : unselected}`}
                                >
                                    <span className="flex items-center justify-between gap-2">
                                        <span>Tarjeta</span>
                                        {metodo === 'tarjeta' && (
                                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-cyan-400/60">
                                                ✓
                                            </span>
                                        )}
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    role="radio"
                                    aria-checked={metodo === 'pse'}
                                    onClick={() => setMetodo('pse')}
                                    className={`${baseBtn} ${metodo === 'pse' ? selected : unselected}`}
                                >
                                    <span className="flex items-center justify-between gap-2">
                                        <span>PSE</span>
                                        {metodo === 'pse' && (
                                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-cyan-400/60">
                                                ✓
                                            </span>
                                        )}
                                    </span>
                                </button>
                            </div>

                            <div className="mt-2">
                                {metodo ? (
                                    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs">
                                        Método seleccionado: <strong className="font-semibold capitalize">{metodo}</strong>
                                    </span>
                                ) : (
                                    <p className="text-xs text-white/60">Elige un método para continuar.</p>
                                )}
                            </div>

                            <p className="text-xs text-white/50 mt-2">* Demo: confirmamos sin pasarela real.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || items.length === 0 || !metodo}
                            className="mt-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 px-4 py-2 font-semibold disabled:opacity-50"
                        >
                            {loading ? 'Procesando…' : `Confirmar pago ($${tot.toLocaleString()})`}
                        </button>
                    </form>
                </section>


                <aside className="rounded-2xl border border-white/10 bg-white/5 p-4 h-max">
                    <h2 className="font-semibold mb-3">Resumen del pedido</h2>

                    <ul className="divide-y divide-white/10">
                        {items.map((i) => (
                            <li key={i.id} className="py-3 flex items-center gap-3">
                                <div className="h-14 w-20 rounded-lg overflow-hidden bg-black/30 border border-white/10">
                                    {i.imagen ? (
                                        <img src={i.imagen} alt={i.nombre} className="w-full h-full object-cover" />
                                    ) : null}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium line-clamp-1">{i.nombre}</div>
                                    <div className="text-xs text-white/60">
                                        {i.plataforma} · {i.tipo}
                                    </div>
                                </div>
                                <div className="text-right text-sm">
                                    x{i.cantidad}
                                    <div className="font-semibold">${(i.precio * i.cantidad).toLocaleString()}</div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="border-t border-white/10 my-3" />
                    <div className="flex items-center justify-between text-sm">
                        <span>Subtotal</span>
                        <span>${tot.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                        <span>Envío</span>
                        <span>Se calcula al despachar</span>
                    </div>
                    <div className="border-t border-white/10 my-3" />
                    <div className="flex items-center justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>${tot.toLocaleString()}</span>
                    </div>

                    <div className="mt-3 text-sm text-white/80">
                        <span className="opacity-70">Método de pago: </span>
                        <span className="font-medium capitalize">{metodo ?? '—'}</span>
                    </div>
                </aside>
            </div>
        </main>
    );
}
