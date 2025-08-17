'use client';

import { useEffect, useMemo, useState } from 'react';
import { ventasAPI, productosAPI } from '@/lib/api'; 

const COP = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
});


function normalizeProductoId(producto) {
    if (!producto) return '';
    if (typeof producto === 'string') return producto;
    if (typeof producto === 'object') {
        return String(producto._id || producto.$oid || producto.id || producto.toString?.() || '');
    }
    return String(producto);
}


const productCache = new Map();
async function getProduct(productId) {
    if (!productId) return { _id: '', nombre: 'Producto', imagen: '/placeholder.png' };
    if (productCache.has(productId)) return productCache.get(productId);

    try {
        
        const p = await productosAPI.get(productId);
        productCache.set(productId, p);
        return p;
    } catch {
        const fallback = {
        _id: productId,
        nombre: `Producto ${String(productId).slice(-4)}`,
        imagen: '/placeholder.png',
        };
        productCache.set(productId, fallback);
        return fallback;
    }
}

export default function Ventas() {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');
    const [editing, setEditing] = useState(null);
    const [nuevoEstado, setNuevoEstado] = useState('PENDIENTE');

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setErr('');

        ventasAPI
        .getAll()
        .then(async (data) => {
            const withDetails = await Promise.all(
            (data || []).map(async (venta) => {
                const items = await Promise.all(
                (venta.items || []).map(async (it) => {
                    const productoId = normalizeProductoId(it.producto);
                    const p = await getProduct(productoId); 
                    return { ...it, _producto: p, _productoId: productoId };
                })
                );
                return { ...venta, items };
            })
            );
            if (mounted) setVentas(withDetails);
        })
        .catch((e) => mounted && setErr(e.message || 'Error cargando ventas'))
        .finally(() => mounted && setLoading(false));

        return () => {
        mounted = false;
        };
    }, []);

    const totalCOP = useMemo(
        () => ventas
            .filter((v) => v.estado === 'PAGADA')
            .reduce((acc, v) => acc + (v.total || 0), 0),
        [ventas]
    );

    const totalCOPPendientes = useMemo(
        () => ventas
            .filter((v) => v.estado === 'PENDIENTE')
            .reduce((acc, v) => acc + (v.total || 0), 0),
        [ventas]
    );

    const totalCanceladas = useMemo(
        () => ventas.filter((v) => v.estado === 'CANCELADA').length,
        [ventas]
    );


    const totalPendientes = useMemo(
        () => ventas.filter((v) => v.estado === 'PENDIENTE').length,
        [ventas]
    );



    const abrirCambiarEstado = (venta) => {
        setEditing(venta);
        setNuevoEstado(venta?.estado || 'PENDIENTE');
    };

    const guardarEstado = async () => {
        if (!editing) return;
        try {
        const updated = await ventasAPI.update(editing._id, { estado: nuevoEstado });
        setVentas((prev) =>
            prev.map((v) => (v._id === editing._id ? { ...v, estado: updated.estado } : v))
        );
        setEditing(null);
        } catch (e) {
        setErr(e.message || 'No se pudo actualizar');
        }
    };

    return (
        <div className="space-y-5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
                <h2 className="text-xl font-semibold tracking-tight">Ventas</h2>
                <p className="text-sm text-white/60">Resumen de ventas recientes</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm">
                Total pagos:{' '}
                <span className="font-semibold text-white">{COP.format(totalCOP)}</span>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm">
                Total pendientes:{' '}
                <span className="font-semibold text-white">{COP.format(totalCOPPendientes)}</span>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm">
                Total de ventas pagadas: <span className="font-semibold text-white">{ventas.filter((v) => v.estado === 'PAGADA').length}</span>
                <br />
                Total de ventas pendientes: <span className="font-semibold text-white">{totalPendientes}</span>
                <br />
                Total de ventas canceladas:{' '}
                <span className="font-semibold text-white">{totalCanceladas}</span>
            </div>
        </div>

        {err && (
            <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
            {err}
            </div>
        )}
        {loading && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-white/70">
            Cargando ventas…
            </div>
        )}
        {!loading && ventas.length === 0 && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-white/70">
            No hay ventas
            </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {ventas.map((v) => (
            <VentaCard key={v._id} venta={v} onCambiarEstado={() => abrirCambiarEstado(v)} />
            ))}
        </div>

        {editing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
            <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0b1220] p-5 text-white shadow-xl">
                <h3 className="mb-3 text-lg font-semibold">Cambiar estado</h3>
                <div className="space-y-2 text-sm">
                <div className="text-white/70">
                    Venta #{String(editing._id).slice(-6)} — {editing.cliente?.nombre}
                </div>
                <label className="block text-white/80" htmlFor="estado-select">Estado</label>
                <select
                    id="estado-select"
                    value={nuevoEstado}
                    onChange={(e) => setNuevoEstado(e.target.value)}
                    className="w-full rounded-lg border border-white bg-black p-2 focus:outline-none"
                >
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="PAGADA">PAGADA</option>
                    <option value="CANCELADA">CANCELADA</option>
                </select>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setEditing(null)} className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10">Cancelar</button>
                <button onClick={guardarEstado} className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-[#0b1220] hover:bg-gray-100">Guardar</button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
}

function VentaCard({ venta, onCambiarEstado }) {
    const created = venta?.createdAt ? new Date(venta.createdAt) : null;
    const fecha = created ? created.toLocaleString('es-CO') : '';

    return (
        <article className="group rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm transition-colors hover:border-white/20">
        <header className="mb-4 flex flex-col items-start justify-between gap-3">
            <div className="min-w-0">
                <div className="text-xs text-white/50">#{String(venta._id).slice(-8)} • {fecha}</div>
                <div className="mt-0.5 line-clamp-1 text-base font-medium">
                    {venta.cliente?.nombre}{' '}
                </div>
                <span className="text-white/60">({venta.cliente?.email})</span>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                    {venta.metadatos?.metodoPago && <Chip>{venta.metadatos.metodoPago}</Chip>}
                </div>
            </div>

            <div className="flex  flex-col items-start gap-2">
                <EstadoBadge estado={venta.estado} />
                <div className="rounded-xl border border-white/15 bg-white/10 px-2.5 py-1 text-sm">
                    {COP.format(venta.total || 0)}
                </div>
                <button
                    onClick={onCambiarEstado}
                    className="rounded-lg border border-white/20 bg-white px-2.5 py-1 text-xs font-medium text-[#0b1220] hover:bg-gray-100"
                >
                    Cambiar estado
                </button>
            </div>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
            {(venta.items || []).map((it, idx) => {
            const productoId = normalizeProductoId(it.producto);
            const key = `${venta._id}-${productoId || idx}`;
            return (
                <div key={key} className="rounded-xl border border-white/10 bg-[#0b1220]/60 p-3">
                <div className="aspect-square w-full overflow-hidden rounded-lg bg-black/20 ring-1 ring-white/10">
                    <img
                    src={it._producto?.imagenes[0] || '/placeholder.png'}
                    alt={it._producto?.imagenes[0] || 'Producto'}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    />
                </div>
                <div className="mt-2">
                    <div className="truncate text-sm font-medium">{it._producto?.nombre || 'Producto'}</div>
                    <div className="mt-1 flex flex-col items-center gap-0.5 text-xs text-white/70">
                    <span>{it.cantidad} × {COP.format(it.precioUnitario || 0)}</span>
                    <span className="font-semibold text-white">{COP.format(it.subtotal || 0)}</span>
                    </div>
                </div>
                </div>
            );
            })}
        </div>
        </article>
    );
}

function Chip({ children }) {
    return (
        <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5">
        {children}
        </span>
    );
}

function EstadoBadge({ estado }) {
    const styles = {
        PAGADA: 'bg-emerald-400 text-[#0b1220] border-emerald-300',
        PENDIENTE: 'bg-yellow-400 text-[#0b1220] border-yellow-300',
        CANCELADA: 'bg-rose-400 text-[#0b1220] border-rose-300',
    };
    const cls = styles[estado] || 'bg-black text-[#0b1220] border-white';
    return (
        <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${cls}`}>
        {estado || '—'}
        </span>
    );
}
