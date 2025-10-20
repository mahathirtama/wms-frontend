import apiClient from './apiClient';


const getPurchaseRequests = (params) => {
  return apiClient.get('/purchase-requests', { params });
};

const getPurchaseRequestById = (id) => {
  return apiClient.get(`/purchase-requests/${id}`);
};

const createPurchaseRequest = (data) => {
  return apiClient.post('/purchase-requests', data);
};

const updatePurchaseRequest = (id, data) => {
  return apiClient.put(`/purchase-requests/${id}`, data);
};

const deletePurchaseRequest = (id) => {
  return apiClient.delete(`/purchase-requests/${id}`);
};



const getPurchaseOrders = (params) => {
  return apiClient.get('/purchase-orders', { params });
};


const createPurchaseOrder = (data) => {
  return apiClient.post('/purchase-orders', data);
};



const getSuppliers = () => {
  return apiClient.get('/suppliers'); 
};

const getPurchaseOrderById = (id) => {
  return apiClient.get(`/purchase-orders/${id}`);
};



export const purchasingService = {
  getPurchaseRequests,
  getPurchaseRequestById,
  createPurchaseRequest,
  updatePurchaseRequest,
  deletePurchaseRequest,
  
  getPurchaseOrders,
  createPurchaseOrder, 

  getPurchaseOrderById,
  
  getSuppliers,
};