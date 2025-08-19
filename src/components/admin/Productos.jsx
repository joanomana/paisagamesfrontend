'use client';
import { useEffect, useState } from 'react';
import { productosAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';



const COP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});



export default function Stock() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const [stockOpen, setStockOpen] = useState(false);


  const [stockTarget, setStockTarget] = useState(null);
  const [nextStock, setNextStock] = useState(0);

  const router = useRouter();


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
                  onClick={() => router.push('/administrador/editar/' + p._id)}
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
              {stockOpen && stockTarget?._id === p._id &&(
                  <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#0b1220] p-5 mt-5 text-white shadow-xl">
                    <div className="space-y-2 text-sm">
                      <div className="mt-3 text-white/70">Nuevo stock</div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          value={nextStock}
                          onChange={(e) => setNextStock(Math.max(0, Number(e.target.value || 0)))}
                          className="w-20 rounded-lg border border-white/20 bg-white/10 p-2 text-center text-lg focus:outline-none"
                        />
                        <div className='flex flex-col gap-2'>
                          <button
                          onClick={() => setNextStock((s) => Number(s || 0) + 1)}
                          className="rounded-lg border border-white/20 px-3 py-2 text-lg hover:bg-white/10"
                        >
                          +
                        </button>
                          <button
                          onClick={() => setNextStock((s) => Math.max(0, Number(s || 0) - 1))}
                          className="rounded-lg border border-white/20 px-3 py-2 text-lg hover:bg-white/10"
                        >
                          –
                        </button>
                        </div>
                        
                      </div>
                    </div>

                    <div className="mt-4 flex  md:flex-col justify-end gap-2">
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
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
