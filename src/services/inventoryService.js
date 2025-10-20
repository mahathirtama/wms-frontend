import apiClient from './apiClient';


const createGoodsReceipt = (data) => {
  return apiClient.post('/inventory/goods-receipt', data);
};


const getWarehouses = () => {
  return apiClient.get('/warehouses');
};

const getGoodsReceipts = (params) => {
  return apiClient.get('/inventory/goods-receipts', { params });
};

const getStockLevels = (params) => {
  return apiClient.get('/inventory/stock-levels', { params });
};

const getStockCard = (itemId, warehouseId) => {
  return apiClient.get(`/inventory/stock-card/${itemId}/${warehouseId}`);
};

const getGoodsIssues = (params) => {
  return apiClient.get('/inventory/goods-issues', { params });
};

const createGoodsIssue = (data) => {
  return apiClient.post('/inventory/goods-issue', data);
};

const getGoodsTransfers = (params) => {
  return apiClient.get('/inventory/goods-transfers', { params });
};

const createGoodsTransfer = (data) => {
  return apiClient.post('/inventory/goods-transfer', data);
};

const getGoodsReceiptById = (id) => {
  return apiClient.get(`/inventory/goods-receipts/${id}`);
};
const getGoodsIssueById = (id) => {
  return apiClient.get(`/inventory/goods-issues/${id}`);
};
const getGoodsTransferById = (id) => {
  return apiClient.get(`/inventory/goods-transfers/${id}`);
};

export const inventoryService = {
  createGoodsReceipt,
  getWarehouses,
  getGoodsReceipts,
  getStockLevels,
  getStockCard,
  getGoodsIssues,
  createGoodsIssue,
  getGoodsTransfers,
  createGoodsTransfer,
  getGoodsReceiptById,
  getGoodsIssueById,
  getGoodsTransferById,
};