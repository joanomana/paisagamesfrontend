'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { productosAPI } from '@/lib/api';

const TIPOS = ['JUEGO_FISICO','LLAVE_DIGITAL','CONSOLA','ACCESORIO','COLECCIONABLE'];
const PLATAFORMAS = ['XBOX','PLAYSTATION','NINTENDO','PC','STEAM','EPIC','VALORANT','MULTI'];

export default function ProductoCrear() {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    tipo: '',
    plataforma: '',
    categoria: '',
    precio: 0,
    stock: 0,
    // imágenes como entradas separadas en el form
    portada: '',
    imagen1: '',
    imagen2: '',
    // metadata opcional
    mdEdicion: '',
    mdRegion: '',
  });

  // categorías dinámicas (desde productos existentes) + modo "nueva categoría"
  const [categorias, setCategorias] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [newCatMode, setNewCatMode] = useState(false);

  useEffect(() => {
    productosAPI
      .list()
      .then((rows) => {
        const cats = Array.from(
          new Set((rows || []).map((p) => p.categoria).filter(Boolean))
        ).sort((a, b) => a.localeCompare(b, 'es'));
        setCategorias(cats);
      })
      .catch(() => setCategorias([]))
      .finally(() => setCatLoading(false));
  }, []);

  const portadaPreview = form.portada?.trim() || '/placeholder.png';

  const resetForm = () =>
    setForm({
      nombre: '',
      descripcion: '',
      tipo: '',
      plataforma: '',
      categoria: '',
      precio: 0,
      stock: 0,
      portada: '',
      imagen1: '',
      imagen2: '',
      mdEdicion: '',
      mdRegion: '',
    });

  const isUrl = (s) => {
    try { new URL(s); return true; } catch { return false; }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validaciones mínimas
    if (!form.nombre.trim()) {
      return Swal.fire({ icon: 'warning', title: 'Falta el nombre' });
    }
    if (!form.tipo || !TIPOS.includes(form.tipo)) {
      return Swal.fire({ icon: 'warning', title: 'Selecciona un tipo válido' });
    }
    if (!form.plataforma || !PLATAFORMAS.includes(form.plataforma)) {
      return Swal.fire({ icon: 'warning', title: 'Selecciona una plataforma válida' });
    }

    if (newCatMode) {
      if (!form.categoria || !form.categoria.trim()) {
        return Swal.fire({ icon: 'warning', title: 'Escribe la nueva categoría' });
      }
    } else {
      if (!form.categoria) {
        return Swal.fire({ icon: 'warning', title: 'Selecciona una categoría' });
      }
    }

    // Imágenes: tu schema requiere 3 (min) — portada, imagen1, imagen2
    const imagenes = [form.portada, form.imagen1, form.imagen2]
      .map((s) => (s || '').trim());

    if (imagenes.some((s) => s.length === 0)) {
      return Swal.fire({
        icon: 'warning',
        title: 'Faltan imágenes',
        text: 'Debes proporcionar 3 URLs (portada, imagen 2 e imagen 3).',
      });
    }
    if (!imagenes.every(isUrl)) {
      return Swal.fire({
        icon: 'warning',
        title: 'URLs inválidas',
        text: 'Revisa que las 3 imágenes sean URLs válidas.',
      });
    }

    const { isConfirmed } = await Swal.fire({
      title: 'Crear producto',
      text: '¿Confirmas crear este producto?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'Cancelar',
    });
    if (!isConfirmed) return;

    setBusy(true);

    // Normaliza categoría (permite nuevas)
    const categoria = (form.categoria || '').trim();

    // Payload para tu schema:
    //  - NO incluimos "portada" porque es virtual (imagenes[0])
    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion || '',
      tipo: form.tipo,
      plataforma: form.plataforma,
      categoria,
      precio: Number(form.precio || 0),
      stock: Number(form.stock || 0),
      imagenes, // 👈 array de 3 strings
      metadata: {
        edicion: (form.mdEdicion || '').trim(),
        region: (form.mdRegion || '').trim(),
      },
    };
    console.log('[crear producto] payload:', payload);
    console.log('[crear producto] imagenes:', payload.imagenes, 'isArray?', Array.isArray(payload.imagenes));


    try {
      const created = await productosAPI.create(payload);

      // si se creó una categoría nueva, añádela al selector
      if (categoria && !categorias.includes(categoria)) {
        setCategorias((prev) => [...prev, categoria].sort((a, b) => a.localeCompare(b, 'es')));
      }

      await Swal.fire({
        icon: 'success',
        title: 'Producto creado',
        text: created?.nombre || 'Se creó correctamente',
        timer: 1600,
        showConfirmButton: false,
      });

      resetForm();
      setNewCatMode(false);
    } catch (e) {
      const msg = e?.message || e?.response?.data?.error || 'No se pudo crear el producto';
      Swal.fire({ icon: 'error', title: 'Error', text: msg });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3 text-white">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Crear producto</h2>
      </div>
      <p className="text-white/70">Completa la información y guarda para crear el producto.</p>

      <form
        onSubmit={onSubmit}
        className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 rounded-2xl border border-white/10 bg-white/5 p-4"
      >
        {/* Nombre */}
        <div className="sm:col-span-2">
          <label className="block text-xs text-white/70">Nombre</label>
          <input
            value={form.nombre}
            onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
            placeholder="Ej: God of War Ragnarök (PS5)"
            required
          />
        </div>

        {/* Descripción */}
        <div className="sm:col-span-2">
          <label className="block text-xs text-white/70">Descripción</label>
          <textarea
            value={form.descripcion}
            onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
            rows={3}
            placeholder="Resumen del producto…"
          />
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-xs text-white/70">Tipo</label>
          <select
            value={form.tipo}
            onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
            required
          >
            <option value="">— Selecciona —</option>
            {TIPOS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Plataforma */}
        <div>
          <label className="block text-xs text-white/70">Plataforma</label>
          <select
            value={form.plataforma}
            onChange={(e) => setForm((f) => ({ ...f, plataforma: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
            required
          >
            <option value="">— Selecciona —</option>
            {PLATAFORMAS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Categoría con lista + nueva */}
        <div className={newCatMode ? 'sm:col-span-2' : ''}>
          <label className="block text-xs text-white/70">Categoría</label>

          <select
            value={newCatMode ? '__new__' : (form.categoria || '')}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '__new__') {
                setNewCatMode(true);
                setForm((f) => ({ ...f, categoria: '' }));
              } else {
                setNewCatMode(false);
                setForm((f) => ({ ...f, categoria: val }));
              }
            }}
            className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
            disabled={catLoading}
            required={!newCatMode}
          >
            <option value="">
              {catLoading ? 'Cargando categorías…' : '— Selecciona —'}
            </option>
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
            <option value="__new__">➕ Nueva categoría…</option>
          </select>

          {newCatMode && (
            <div className="mt-2">
              <label className="block text-xs text-white/70">Nueva categoría</label>
              <input
                value={form.categoria}
                onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
                placeholder="Escribe el nombre de la nueva categoría"
                required
              />
              <p className="mt-1 text-[11px] text-white/50">
                Se creará con este nombre al guardar.
              </p>
            </div>
          )}
        </div>

        {/* Precio */}
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

        {/* Stock */}
        <div>
          <label className="block text-xs text-white/70">Stock</label>
          <input
            type="number"
            min={0}
            value={form.stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: Math.max(0, Number(e.target.value || 0)) }))}
            className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
          />
        </div>

        {/* Portada */}
        <div className="sm:col-span-2">
          <label className="block text-xs text-white/70">Portada (URL)</label>
          <input
            value={form.portada}
            onChange={(e) => setForm((f) => ({ ...f, portada: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
            placeholder="https://..."
            required
          />
          <div className="mt-2 flex items-center gap-3">
            <div className="text-xs text-white/60">Preview</div>
            <div className="h-20 w-28 overflow-hidden rounded-lg border border-white/10 bg-black/20">
              <img src={portadaPreview} alt="portada" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>

        {/* Imagen 2 / 3 */}
        <div>
          <label className="block text-xs text-white/70">Imagen 2 (URL)</label>
          <input
            value={form.imagen1}
            onChange={(e) => setForm((f) => ({ ...f, imagen1: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
            placeholder="https://..."
            required
          />
        </div>
        <div>
          <label className="block text-xs text-white/70">Imagen 3 (URL)</label>
          <input
            value={form.imagen2}
            onChange={(e) => setForm((f) => ({ ...f, imagen2: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
            placeholder="https://..."
            required
          />
        </div>

        {/* Metadata */}
        <div>
          <label className="block text-xs text-white/70">Edición (metadata)</label>
          <input
            value={form.mdEdicion}
            onChange={(e) => setForm((f) => ({ ...f, mdEdicion: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
            placeholder="Estándar, Deluxe…"
          />
        </div>
        <div>
          <label className="block text-xs text-white/70">Región (metadata)</label>
          <input
            value={form.mdRegion}
            onChange={(e) => setForm((f) => ({ ...f, mdRegion: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
            placeholder="US, EU, LATAM…"
          />
        </div>

        {/* Acciones */}
        <div className="sm:col-span-2 mt-2 flex justify-end gap-2">
          <button
            type="reset"
            onClick={() => { resetForm(); setNewCatMode(false); }}
            className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
            disabled={busy}
          >
            Limpiar
          </button>
          <button
            type="submit"
            className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-[#0b1220] hover:bg-gray-100 disabled:opacity-50"
            disabled={busy}
          >
            {busy ? 'Creando…' : 'Crear producto'}
          </button>
        </div>
      </form>
    </div>
  );
}
