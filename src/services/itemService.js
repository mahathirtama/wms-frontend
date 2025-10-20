import apiClient from './apiClient';

// Mengambil daftar item (sekarang bisa pakai pagination/search)
const getItems = (params) => {
  // params bisa: { page: 1, search: 'baut' }
  return apiClient.get('/items', { params });
};

// 👇 TAMBAHKAN FUNGSI BARU 👇
const getItemById = (id) => {
  return apiClient.get(`/items/${id}`);
};

const createItem = (data) => {
  return apiClient.post('/items', data);
};

const updateItem = (id, data) => {

  return apiClient.post(`/items/${id}`, { ...data, _method: 'PUT' });
};


export const itemService = {
  getItems,
  getItemById,
  createItem,
  updateItem,
};