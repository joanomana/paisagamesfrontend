'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { toast } from 'sonner';

export default function CarritoPage() {
    const router = useRouter();


    const items = useCartStore(s => s.items);
    const updateQty = useCartStore(s => s.updateQty);
    const removeItem = useCartStore(s => s.removeItem);
    const clear = useCartStore(s => s.clear);
    const tot = useCartStore(s => s.total());

    return (
        <main className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">Tu carrito</h1>

            {items.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/80">
                    Tu carrito está vacío.{' '}
                    <Link href="/producto" className="text-cyan-300 hover:underline">
                        Empieza a comprar →
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-[1fr_320px] gap-6">
                    <section className="rounded-2xl border border-white/10 bg-white/5">
                        <ul className="divide-y divide-white/10">
                            {items.map((it) => (
                                <li key={it.id} className="p-4 flex gap-4">
                                    <div className="h-20 w-28 rounded-lg overflow-hidden bg-black/30 border border-white/10">
                                        {it.imagen ? (
                                            <img src={it.imagen} alt={it.nombre} className="w-full h-full object-cover" />
                                        ) : null}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className="font-medium leading-tight line-clamp-2">{it.nombre}</div>
                                                <div className="text-xs text-white/60">
                                                    {it.plataforma} · {it.tipo}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    removeItem(it.id);
                                                    toast('Producto eliminado');
                                                }}
                                                className="text-sm rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-2 py-1"
                                            >
                                                Quitar
                                            </button>
                                        </div>

                                        <div className="mt-2 flex items-center justify-between">
                                            <QtyPicker
                                                value={it.cantidad}
                                                max={it.stock}
                                                onChange={(v) => updateQty(it.id, v)}
                                            />
                                            <div className="text-right">
                                                <div className="text-sm text-white/70">c/u ${it.precio.toLocaleString()}</div>
                                                <div className="text-lg font-semibold">
                                                    ${(it.precio * it.cantidad).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="p-4 flex items-center justify-between">
                            <button
                                onClick={() => {
                                    clear();
                                    toast('Carrito vaciado', { description: 'Puedes seguir explorando juegos.' });
                                }}
                                className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-sm"
                            >
                                Vaciar carrito
                            </button>
                            <Link href="/producto" className="text-sm text-white/70 hover:text-white">
                                ← Seguir comprando
                            </Link>
                        </div>
                    </section>

                    <aside className="rounded-2xl border border-white/10 bg-white/5 p-4 h-max">
                        <h2 className="font-semibold mb-3">Resumen</h2>
                        <div className="flex items-center justify-between text-sm">
                            <span>Subtotal</span>
                            <span>${tot.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                            <span>Envío</span>
                            <span>Se calcula en checkout</span>
                        </div>
                        <div className="border-t border-white/10 my-3" />
                        <div className="flex items-center justify-between text-lg font-semibold">
                            <span>Total</span>
                            <span>${tot.toLocaleString()}</span>
                        </div>

                        <button
                            onClick={() => router.push('/checkout')}
                            className="mt-4 w-full rounded-xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 px-4 py-2 font-semibold"
                        >
                            Ir a pagar
                        </button>

                        <p className="text-xs text-white/50 mt-2">
                            Pagos seguros · PSE · Tarjeta · Efectivo en puntos aliados
                        </p>
                    </aside>
                </div>
            )}
        </main>
    );
}

function QtyPicker({ value, onChange, min = 1, max = 99 }) {
    const dec = () => onChange(Math.max(min, Number(value) - 1));
    const inc = () => onChange(Math.min(max, Number(value) + 1));
    return (
        <div className="inline-flex items-center rounded-xl border border-white/10 bg-white/5">
            <button onClick={dec} disabled={value <= min} className="px-3 py-2 disabled:opacity-40">−</button>
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
            />
            <button onClick={inc} disabled={value >= max} className="px-3 py-2 disabled:opacity-40">+</button>
        </div>
    );
}
