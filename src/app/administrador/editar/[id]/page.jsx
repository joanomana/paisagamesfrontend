'use client';
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
        const fetchData = async () => {
            try {
                console.log(typeof(id))
                const res = await fetch(`/api/productos/${id}`);
                if (!res.ok) throw new Error("No se encontró el producto");
                const data = await res.json();
                setForm({
                    nombre: data.nombre ?? "",
                    descripcion: data.descripcion ?? "",
                    tipo: data.tipo ?? "",
                    plataforma: data.plataforma ?? "",
                    categoria: data.categoria ?? "",
                    precio: Number(data.precio ?? 0),
                    stock: Number(data.stock ?? 0),
                    portada: data.portada ?? "",
                    imagen1: data.imagen1 ?? "",
                    imagen2: data.imagen2 ?? "",
                    mdEdicion: data.mdEdicion ?? "",
                    mdRegion: data.mdRegion ?? "",
                });
            } catch (err) {
                Swal.fire("Error", err.message, "error");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const saveEdit = async () => {
        setBusyId(id);
        try {
            const res = await fetch(`/api/productos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error("Error al guardar cambios");
            Swal.fire("Guardado", "Producto actualizado correctamente", "success");
            router.push("/administrador");
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        } finally {
            setBusyId(null);
        }
    };

    if (loading) return <div className="p-5 text-white">Cargando...</div>;

    return (
        <div className="min-h-screen bg-[#0b1220] p-5 text-white">
            <div className="max-w-3xl mx-auto rounded-2xl border border-white/15 bg-[#0b1220] p-6 shadow-xl">
                <h3 className="mb-4 text-lg font-semibold">Editar producto</h3>

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

                    {/* 🔹 Ejemplo de un select */}
                    <div>
                        <label className="block text-xs text-white/70">Tipo</label>
                        <select
                            value={form.tipo}
                            onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value }))}
                            className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 p-2 text-sm focus:outline-none"
                        >
                            <option value="">-- Seleccionar --</option>
                            {TIPOS.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
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
