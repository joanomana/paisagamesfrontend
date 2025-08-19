'use client';

export default function Context() {
    return (
        <div className="space-y-4 text-white">
            <h2 className="text-xl font-medium">Bienvenido al panel de administración</h2>
            <p className="text-white/80">
                Aquí puedes gestionar tu tienda: revisar <span className="underline decoration-white/30">ventas</span>,
                crear y editar <span className="underline decoration-white/30">productos</span> y controlar el
                <span className="underline decoration-white/30"> stock</span>. Usa el panel de la izquierda para navegar.
            </p>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                <p className="text-sm text-white/80">
                    Sugerencia: podemos convertir estas pestañas en rutas con URL
                    (<code className="bg-black/30 px-1 rounded">/administrador?tab=ventas</code>) o subrutas
                    (<code className="bg-black/30 px-1 rounded">/administrador/ventas</code>).
                </p>
            </div>
        </div>
    );
}
