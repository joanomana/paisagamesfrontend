import { http } from '../http';

export const productosAPI = {
    list: (params = {}) => http.get('/api/productos', { query: params }),
    get: (id) => http.get(`/api/productos/${id}`),


    create: (payload) => http.post('/api/productos', payload),
    update: (id, payload) => http.put(`/api/productos/${id}`, payload),
    remove: (id) => http.del(`/api/productos/${id}`),
};
