'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
    persist(
        (set, get) => ({
        items: [], 
        addItem: (prod, cantidad = 1) => {
            set((state) => {
            const id = prod._id || prod.id;
            const idx = state.items.findIndex(i => i.id === id);
            if (idx >= 0) {
                const items = [...state.items];
                const nueva = Math.min((items[idx].cantidad + cantidad), Number(prod.stock ?? 99));
                items[idx] = { ...items[idx], cantidad: nueva };
                return { items };
            }
            return {
                items: [
                ...state.items,
                {
                    id,
                    nombre: prod.nombre,
                    precio: Number(prod.precio),
                    imagen: prod.portada || prod.imagenes?.[0],
                    plataforma: prod.plataforma,
                    tipo: prod.tipo,
                    stock: Number(prod.stock ?? 99),
                    cantidad: Math.min(Number(cantidad), Number(prod.stock ?? 99)),
                },
                ],
            };
            });
        },
        updateQty: (id, cantidad) => {
            set((state) => {
            const items = state.items.map(i =>
                i.id === id ? { ...i, cantidad: Math.max(1, Math.min(Number(cantidad || 1), i.stock)) } : i
            );
            return { items };
            });
        },
        removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
        clear: () => set({ items: [] }),
        count: () => get().items.reduce((acc, i) => acc + i.cantidad, 0),
        total: () => get().items.reduce((acc, i) => acc + i.cantidad * i.precio, 0),
        }),
        { name: 'pg-cart' }
    )
);
