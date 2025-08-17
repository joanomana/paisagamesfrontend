// src/lib/api/ventas.js
import { http } from '../http';

export const ventasAPI = {

    create: ({ productoId, cantidad, cliente, metadatos }) =>
        http.post('/api/ventas', { productoId, cantidad, cliente, metadatos }),


    checkout: async ({ items, cliente, metadatos }) => {
        // Adaptar el carrito a la forma que espera el backend:
        // tu ejemplo usa "producto" (no "productoId")
        const payload = {
        cliente: cliente || {},
        items: items.map((i) => ({
            producto: i.id || i._id || i.productoId, // asegúrate de enviar el ObjectId del producto
            cantidad: Number(i.cantidad || 1),
        })),
        metadatos: metadatos || {},
        };


        const venta = await http.post('/api/ventas', payload);
        return venta; 
    },
};
