import { http } from '../http';


export const ventasAPI = {
    getAll: (params) => http.get('/api/ventas', { params }),         

    getById: (id) => http.get(`/api/ventas/${id}`),

    update: (id, body) => http.put(`/api/ventas/${id}`, body), 

    create: ({ productoId, cantidad, cliente, metadatos }) =>
        http.post('/api/ventas', { productoId, cantidad, cliente, metadatos }),

    checkout: async ({ items, cliente, metadatos }) => {
        const payload = {
        cliente: cliente || {},
        items: items.map((i) => ({
            producto: i.id || i._id || i.productoId,
            cantidad: Number(i.cantidad || 1),
        })),
        metadatos: metadatos || {},
        };
        return http.post('/api/ventas', payload);
    },
};
