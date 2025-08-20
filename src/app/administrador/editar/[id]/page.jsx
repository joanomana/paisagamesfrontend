'use client';
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { productosAPI } from '@/lib/api/productos';
import Swal from 'sweetalert2';

export const TIPOS = ['JUEGO_FISICO', 'LLAVE_DIGITAL', 'CONSOLA', 'ACCESORIO', 'COLECCIONABLE'];
export const PLATAFORMAS = ['XBOX', 'PLAYSTATION', 'NINTENDO', 'PC', 'STEAM', 'EPIC', 'VALORANT', 'MULTI'];
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

export default function EditarProducto() {
    const router = useRouter();
    const { id } = useParams();
    const [producto, setProducto] = useState(null);

    const [msg, setMsg] = useState(null);

    const [form, setForm] = useState({
        nombre: "",
        descripcion: "",
        tipo: "",
        plataforma: "",
        categoria: "",
        precio: 0,
        stock: 0,
        portada: "",
        imagen1: "",
        imagen2: "",
        mdEdicion: "",
        mdRegion: "",
    });

    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        productosAPI.get(id)
            .then((p) => {
                setProducto(p);
                setForm({
                    nombre: p.nombre || "",
                    descripcion: p.descripcion || "",
                    tipo: p.tipo || "",
                    plataforma: p.plataforma || "",
                    categoria: p.categoria || "",
                    precio: p.precio || 0,
                    stock: p.stock || 0,
                    portada: p.imagenes[0] || "",
                    imagen1: p.imagenes[1] || "",
                    imagen2: p.imagenes[2] || "",
                    mdEdicion: p.mdEdicion || "",
                    mdRegion: p.mdRegion || "",
                });
            })
            .catch((e) => setMsg(`Error: ${e.message}`))
            .finally(() => setLoading(false));
    }, [id]);

    const saveEdit = async () => {
        setBusyId(id);
        try {
            const updatedProducto = await productosAPI.update(id, form);
            if (!updatedProducto) throw new Error("Error al guardar cambios");
            Swal.fire("Guardado", "Producto actualizado correctamente", "success");
            router.push("/administrador");
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        } finally {
            setBusyId(null);
        }
    };

    if (loading) return <div className="p-5 text-white">Cargando...</div>;
    if (msg) return <div className="p-5 text-red-500">{msg}</div>;

    return (
        <div className="min-h-screen bg-[#0b1220] p-5 text-white">
            <button
                onClick={() => router.back()}
                className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-sm mb-5"
            >
                ← Volver
            </button>
            <div className="max-w-3xl mx-auto rounded-2xl border border-white/15 bg-[#0b1220] p-6 shadow-xl">
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
                            <option className="bg-black" value="">-- Seleccionar --</option>
                            {TIPOS.map((t) => (
                                <option className="bg-black" key={t} value={t}>{t}</option>
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
                            <option className="bg-black" value="">-- Seleccionar --</option>
                            {PLATAFORMAS.map((p) => (
                                <option className="bg-black" key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs text-white/70">Categoría</label>
                        <select
                            value={form.categoria}
                            onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
                            className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
                        >
                            <option className="bg-black" value="">-- Seleccionar --</option>
                            {CATEGORIAS.map((c) => (
                                <option className="bg-black" key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs text-white/70">Precio</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.precio}
                            onChange={(e) => setForm((f) => ({ ...f, precio: parseFloat(e.target.value) || 0 }))}
                            className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-white/70">Stock</label>
                        <input
                            type="number"
                            min="0"
                            value={form.stock}
                            onChange={(e) => setForm((f) => ({ ...f, stock: parseInt(e.target.value) || 0 }))}
                            className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
                            required
                        />
                    </div>
                    {form.portada && (
                        <div className="mb-4">
                            <p className="text-xs text-white/70 mb-2">Vista previa de portada:</p>
                            <img
                                src={form.portada}
                                alt="Vista previa"
                                className="w-50 h-32 object-cover rounded-lg border border-white/20"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                    )}

                    <div className="sm:col-span-2">
                        <label className="block text-xs text-white/70">URL Portada</label>
                        <input
                            type="url"
                            value={form.portada}
                            onChange={(e) => setForm((f) => ({ ...f, portada: e.target.value }))}
                            className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-white/70">URL Imagen 1</label>
                        <input
                            type="url"
                            value={form.imagen1}
                            onChange={(e) => setForm((f) => ({ ...f, imagen1: e.target.value }))}
                            className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-white/70">URL Imagen 2</label>
                        <input
                            type="url"
                            value={form.imagen2}
                            onChange={(e) => setForm((f) => ({ ...f, imagen2: e.target.value }))}
                            className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-white/70">Edición</label>
                        <input
                            value={form.mdEdicion}
                            onChange={(e) => setForm((f) => ({ ...f, mdEdicion: e.target.value }))}
                            className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
                            placeholder="Ej: Estándar, Deluxe, Collector"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-white/70">Región</label>
                        <input
                            value={form.mdRegion}
                            onChange={(e) => setForm((f) => ({ ...f, mdRegion: e.target.value }))}
                            className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
                            placeholder="Ej: NTSC, PAL, Global"
                        />
                    </div>

                    {/* 🔹 Repite para plataforma, categoría, etc. */}

                    <div className="sm:col-span-2 mt-2 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => router.push("/administrador")}
                            className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={busyId === id}
                            className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-[#0b1220] hover:bg-gray-100 disabled:opacity-50"
                        >
                            Guardar cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
