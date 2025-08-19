'use client';
import { useEffect, useState } from 'react';
import { productosAPI } from '@/lib/api';
import Swal from 'sweetalert2';

export const TIPOS = ['JUEGO_FISICO', 'LLAVE_DIGITAL', 'CONSOLA', 'ACCESORIO', 'COLECCIONABLE'];

export const PLATAFORMAS = ['XBOX', 'PLAYSTATION', 'NINTENDO', 'PC', 'STEAM', 'EPIC', 'VALORANT', 'MULTI'];

const COP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export const CATEGORIAS = [
  'Acción',
  'Almacenamiento',
  'Amiibo',
  'Aventura',
  'Carreras',
  'Consola',
  'Control',
  'Figura',
  'Moneda Virtual',
  'Roguelike',
];


export default function Stock() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [stockOpen, setStockOpen] = useState(false);

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const [stockTarget, setStockTarget] = useState(null);
  const [nextStock, setNextStock] = useState(0);


  useEffect(() => {
    productosAPI
      .list()
      .then(setProductos)
      .catch((e) => setErr(e.message || 'No se pudo cargar el stock'))
      .finally(() => setLoading(false));
  }, []);

  const imgSrc = (p) =>
    (p?.portada && String(p.portada)) ||
    (Array.isArray(p?.imagenes) && p.imagenes[0]) ||
    p?.imagen ||
    '/placeholder.png';

  const openEdit = (p) => {
    const imgs = Array.isArray(p.imagenes) ? p.imagenes : [];
    const md = p.metadata || {};

    setEditing(p);
    setForm({
      nombre: p.nombre ?? '',
      descripcion: p.descripcion ?? '',
      tipo: p.tipo ?? '',
      plataforma: p.plataforma ?? '',
      categoria: p.categoria ?? '',
      precio: Number(p.precio ?? 0),
      stock: Number(p.stock ?? 0),

      portada: p.portada ?? imgs[0] ?? '',
      imagen1: imgs[1] ?? '',
      imagen2: imgs[2] ?? '',

      mdEdicion: md.edicion ?? '',
      mdRegion: md.region ?? '',
    });
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditing(null);
    setForm({});
  };

  const openStock = (p) => {
    setStockTarget(p);
    setNextStock(Number(p.stock ?? 0));
    setStockOpen(true);
  };

  const closeStock = () => {
    setStockOpen(false);
    setStockTarget(null);
    setNextStock(0);
  };

  const saveEdit = async () => {
    if (!editing?._id) return;

    const { isConfirmed } = await Swal.fire({
      title: 'Guardar cambios',
      text: '¿Deseas actualizar este producto?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar',
    });
    if (!isConfirmed) return;

    setBusyId(editing._id);
    setErr(null);

    const imagenes = [form.portada, form.imagen1, form.imagen2]
      .map((s) => (s || '').trim())
      .filter(Boolean);

    const portada = (form.portada || '').trim() || imagenes[0] || '';

    const payload = {
      nombre: (form.nombre || '').trim(),
      descripcion: form.descripcion || '',
      tipo: (form.tipo || '').trim(),
      plataforma: (form.plataforma || '').trim(),
      categoria: (form.categoria || '').trim(),
      precio: Number(form.precio || 0),
      stock: Number(form.stock || 0),
      imagenes,
      portada,
      metadata: {
        edicion: (form.mdEdicion || '').trim(),
        region: (form.mdRegion || '').trim(),
      },
    };

    const prev = productos;
    setProductos((cur) =>
      cur.map((p) => (p._id === editing._id ? { ...p, ...payload } : p))
    );

    try {
      await productosAPI.update(editing._id, payload);
      closeEdit();
      Swal.fire({
        title: 'Actualizado',
        text: 'El producto se actualizó correctamente.',
        icon: 'success',
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (e) {
      setProductos(prev);
      const msg =
        e?.message ||
        e?.response?.data?.error ||
        'No se pudo guardar la edición';
      Swal.fire({
        title: 'Error al actualizar',
        text: msg,
        icon: 'error',
      });
      setErr(msg);
      console.error('productosAPI.update error:', e);
    } finally {
      setBusyId(null);
    }
  };

  const applyStock = async () => {
    if (!stockTarget?._id) return;
    if (Number(nextStock) === Number(stockTarget.stock)) {
      closeStock();
      return;
    }

    const { isConfirmed } = await Swal.fire({
      title: 'Actualizar stock',
      text: `¿Actualizar stock de "${stockTarget.nombre}" a ${nextStock}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar',
    });
    if (!isConfirmed) return;

    setBusyId(stockTarget._id);
    setErr(null);

    const prev = productos;
    setProductos((cur) =>
      cur.map((p) =>
        p._id === stockTarget._id ? { ...p, stock: Number(nextStock) } : p
      )
    );

    try {
      await productosAPI.update(stockTarget._id, { stock: Number(nextStock) });
      closeStock();
      Swal.fire({
        title: 'Stock actualizado',
        icon: 'success',
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (e) {
      setProductos(prev);
      const msg =
        e?.message ||
        e?.response?.data?.error ||
        'No se pudo actualizar el stock';
      Swal.fire({
        title: 'Error al actualizar stock',
        text: msg,
        icon: 'error',
      });
      setErr(msg);
      console.error('productosAPI.update stock error:', e);
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <div className="p-6 text-white/80">Cargando…</div>;
  if (err) return <div className="p-6 text-red-400">Error: {String(err)}</div>;

  return (
    <div className="space-y-5 text-white">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Stock</h2>
        <span className="text-sm text-white/60">
          {productos.length} productos ·{' '}
          {productos.reduce((acc, p) => acc + Number(p.stock || 0), 0)} en
          inventario
        </span>
      </div>


      <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
        {productos.map((p) => {
          const isBusy = busyId === p._id;
          return (
            <div
              key={p._id}
              className="rounded-2xl border border-white/10 bg-white/5 p-3 shadow-sm transition hover:border-white/20"
            >
              <div className="aspect-square w-full overflow-hidden rounded-xl bg-black/20 mb-2">
                <img
                  src={imgSrc(p)}
                  alt={p.nombre || 'Producto'}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{p.nombre || '—'}</div>
                <div className="mt-0.5 truncate text-[11px] text-white/50 font-mono">{p._id}</div>
              </div>

              <div className="mt-2 text-sm">
                <span className="text-white/60">Stock: </span>
                <span className="font-semibold">{Number(p.stock) || 0}</span>
              </div>
              <div className="mt-2 ">
                <span className="text-white/60">Precio: </span>
                <span className="font-semibold">{COP.format(p.precio) || 0}</span>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => openEdit(p)}
                  className="rounded-lg border border-white/20 px-2 py-1.5 text-sm hover:bg-white/10 disabled:opacity-50"
                >
                  Editar
                </button>
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => openStock(p)}
                  className="rounded-lg border border-white/20 px-2 py-1.5 text-sm hover:bg-white/10 disabled:opacity-50"
                >
                  Stock
                </button>
              </div>
            </div>
          );
        })}
      </div>


      {editOpen && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-2xl rounded-2xl border border-white/15 bg-[#0b1220] p-5 text-white shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Editar producto</h3>
              <button onClick={closeEdit} className="rounded-lg border border-white/20 px-2 py-1 text-sm hover:bg-white/10">
                Cerrar
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveEdit();
              }}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            >

              <div className="sm:col-span-2">
                <label className="block text-xs text-white/70">Nombre</label>
                <input
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-white/70">Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-xs text-white/70">Tipo</label>
                <select
                  value={form.tipo}
                  onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
                >
                  <option className='bg-black' value="">— Selecciona —</option>
                  {TIPOS.map((t) => (
                    <option className='bg-black' key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-white/70">Plataforma</label>
                <select
                  value={form.plataforma}
                  onChange={(e) => setForm((f) => ({ ...f, plataforma: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
                >
                  <option className='bg-black' value="">— Selecciona —</option>
                  {PLATAFORMAS.map((p) => (
                    <option className='bg-black' key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-white/70">Categoría</label>
                <select
                  value={form.categoria}
                  onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
                  required
                >
                  <option className='bg-black' value="">— Selecciona —</option>
                  {CATEGORIAS.map((c) => (
                    <option className='bg-black' key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-white/70">Precio (COP)</label>
                <input
                  type="number"
                  min={0}
                  value={form.precio}
                  onChange={(e) => setForm((f) => ({ ...f, precio: Number(e.target.value || 0) }))}
                  className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-white/70">Stock</label>
                <input
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, stock: Math.max(0, Number(e.target.value || 0)) }))
                  }
                  className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs text-white/70">Portada (URL)</label>
                  <input
                    value={form.portada}
                    onChange={(e) => setForm((f) => ({ ...f, portada: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/70">Imagen 2 (URL)</label>
                  <input
                    value={form.imagen1}
                    onChange={(e) => setForm((f) => ({ ...f, imagen1: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/70">Imagen 3 (URL)</label>
                  <input
                    value={form.imagen2}
                    onChange={(e) => setForm((f) => ({ ...f, imagen2: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>


              <div>
                <label className="block text-xs text-white/70">Edición (metadata)</label>
                <input
                  value={form.mdEdicion}
                  onChange={(e) => setForm((f) => ({ ...f, mdEdicion: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-white/70">Región (metadata)</label>
                <input
                  value={form.mdRegion}
                  onChange={(e) => setForm((f) => ({ ...f, mdRegion: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={busyId === editing._id}
                  className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-[#0b1220] hover:bg-gray-100 disabled:opacity-50"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {stockOpen && stockTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#0b1220] p-5 text-white shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Manejar stock</h3>
              <button onClick={closeStock} className="rounded-lg border border-white/20 px-2 py-1 text-sm hover:bg-white/10">Cerrar</button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="text-white/70">Producto</div>
              <div className="font-medium">{stockTarget.nombre}</div>

              <div className="mt-2 text-white/70">Stock actual</div>
              <div className="text-xl font-semibold">{Number(stockTarget.stock) || 0}</div>

              <div className="mt-3 text-white/70">Nuevo stock</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setNextStock((s) => Math.max(0, Number(s || 0) - 1))}
                  className="rounded-lg border border-white/20 px-3 py-2 text-lg hover:bg-white/10"
                >
                  –
                </button>
                <input
                  type="number"
                  min={0}
                  value={nextStock}
                  onChange={(e) => setNextStock(Math.max(0, Number(e.target.value || 0)))}
                  className="w-24 rounded-lg border border-white/20 bg-white/10 p-2 text-center text-lg focus:outline-none"
                />
                <button
                  onClick={() => setNextStock((s) => Number(s || 0) + 1)}
                  className="rounded-lg border border-white/20 px-3 py-2 text-lg hover:bg-white/10"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={closeStock} className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10">
                Cancelar
              </button>
              <button
                onClick={applyStock}
                disabled={busyId === stockTarget._id}
                className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-[#0b1220] hover:bg-gray-100 disabled:opacity-50"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
