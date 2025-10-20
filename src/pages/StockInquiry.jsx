import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inventoryService } from '../services/inventoryService';
import { itemService } from '../services/itemService'; 

const StockInquiry = () => {

  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [masterItems, setMasterItems] = useState([]);
  const [masterWarehouses, setMasterWarehouses] = useState([]);


  const [filterItem, setFilterItem] = useState('');
  const [filterWarehouse, setFilterWarehouse] = useState('');


  useEffect(() => {
    const fetchMasterData = async () => {
      try {

        const itemRes = await itemService.getItems({ per_page: 9999 }); 
        

        setMasterItems(itemRes.data.data || []); 
        

        const whRes = await inventoryService.getWarehouses();
        setMasterWarehouses(whRes.data || []); 
        
      } catch (err) {
        console.error("Gagal memuat master data", err);

        setMasterItems([]); 
        setMasterWarehouses([]);
      }
    };
    fetchMasterData();
  }, []);


  useEffect(() => {
    const fetchStock = async () => {
      try {
        setLoading(true);
        const params = {
          page: 1, 
          item_id: filterItem || null,
          warehouse_id: filterWarehouse || null,
        };
        const response = await inventoryService.getStockLevels(params);
        setStockData(response.data.data);
      } catch (err) {
        setError('Gagal mengambil data stok.');
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, [filterItem, filterWarehouse]); 

  return (
    <div className="container-fluid">
      <h1 className="h2 mb-4">Stock Inquiry</h1>

      {/* --- BAGIAN FILTER --- */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-5">
              <label htmlFor="filterItem" className="form-label">Filter Item</label>
              <select 
                id="filterItem" 
                className="form-select"
                value={filterItem}
                onChange={(e) => setFilterItem(e.target.value)}
              >
                <option value="">Semua Item</option>
                {masterItems.map(item => (
                  <option key={item.id} value={item.id}>[{item.sku}] {item.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-5">
              <label htmlFor="filterWarehouse" className="form-label">Filter Gudang</label>
              <select 
                id="filterWarehouse" 
                className="form-select"
                value={filterWarehouse}
                onChange={(e) => setFilterWarehouse(e.target.value)}
              >
                <option value="">Semua Gudang</option>
                {masterWarehouses.map(wh => (
                  <option key={wh.id} value={wh.id}>[{wh.code}] {wh.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* --- BAGIAN TABEL DATA --- */}
      <div className="card shadow-sm">
        <div className="card-body">
          {loading && <div className="spinner-border text-primary" role="status"></div>}
          {error && <div className="alert alert-danger">{error}</div>}
          
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>SKU</th>
                <th>Item Name</th>
                <th>Warehouse</th>
                <th>Sisa Stok</th>
                <th>UoM</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {!loading && stockData.length > 0 ? (
                stockData.map((row) => (
                  <tr key={row.id}>
                    <td>{row.item?.sku}</td>
                    <td>{row.item?.name}</td>
                    <td>{row.warehouse?.code}</td>
                    <td>{row.quantity_on_hand}</td>
                    <td>{row.item?.unit_of_measure}</td>
                    <td>
                      <Link 
                        to={`/inventory/stock-card/${row.item_id}/${row.warehouse_id}`} 
                        className="btn btn-sm btn-outline-info"
                      >
                        Lihat Kartu Stok
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                !loading && (
                  <tr>
                    <td colSpan="6" className="text-center">Tidak ada data stok.</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockInquiry;