import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '../services/inventoryService';


const GICreate = () => {
  const navigate = useNavigate();
  
  // State untuk Header
  const [warehouseId, setWarehouseId] = useState(''); 
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  

  const [masterWarehouses, setMasterWarehouses] = useState([]);
  const [masterItems, setMasterItems] = useState([]); 

  const [items, setItems] = useState([
    { item_id: '', quantity: 1 }
  ]);


  const [loadingWarehouses, setLoadingWarehouses] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false); 
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);


  useEffect(() => {
    setLoadingWarehouses(true);
    inventoryService.getWarehouses()
      .then(response => {
        setMasterWarehouses(response.data);
      })
      .catch(err => setError('Gagal memuat data gudang.'))
      .finally(() => setLoadingWarehouses(false));
  }, []);

  useEffect(() => {

    if (!warehouseId) {
      setMasterItems([]);
      setItems([{ item_id: '', quantity: 1 }]); 
      return;
    }

    const fetchAvailableItems = async () => {
      setLoadingItems(true); 
      setError(null);
      setItems([{ item_id: '', quantity: 1 }]); 
      
      try {

        const params = {
          warehouse_id: warehouseId,
          per_page: 9999 
        };
        const response = await inventoryService.getStockLevels(params);
        

        const availableItems = response.data.data.map(stockLevel => stockLevel.item);
        setMasterItems(availableItems);

      } catch (err) {
        setError('Gagal memuat data item untuk gudang ini.');
      } finally {
        setLoadingItems(false);
      }
    };

    fetchAvailableItems();
  }, [warehouseId]); 


  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };
  const handleAddItemRow = () => {
    setItems([...items, { item_id: '', quantity: 1 }]);
  };
  const handleRemoveItemRow = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setError(null);
    setSuccess(null);

    const giData = {
      warehouse_id: warehouseId,
      issue_date: issueDate,
      notes: notes,
      items: items.filter(item => item.item_id && item.quantity > 0)
    };

    try {
      const response = await inventoryService.createGoodsIssue(giData);
      setSuccess(`Goods Issue ${response.data.data.gi_number} berhasil dibuat!`);
      setItems([{ item_id: '', quantity: 1 }]);
      setNotes('');

      
      setTimeout(() => navigate('/inventory/goods-issue'), 2000);
    } catch (err) {

      setError(err.response?.data?.message || 'Gagal membuat Goods Issue.');
    } finally {
      setLoadingSubmit(false);
    }
  };
  
  if (loadingWarehouses) {
    return <div className="spinner-border text-primary" role="status"></div>;
  }

  return (
    <div className="container-fluid">
      <h1 className="h2 mb-4">Buat Goods Issue (Pengeluaran Barang)</h1>

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

        
            <div className="row mb-3">
              <div className="col-md-4">
                <label htmlFor="warehouse" className="form-label">Gudang Asal <span className="text-danger">*</span></label>
                <select
                  id="warehouse"
                  className="form-select"
                  value={warehouseId}
                  onChange={(e) => setWarehouseId(e.target.value)} 
                  required
                >
                  <option value="" disabled>Pilih gudang...</option>
                  {masterWarehouses.map(wh => (
                    <option key={wh.id} value={wh.id}>
                      [{wh.code}] {wh.name}
                    </option>
                  ))}
                </select>
              </div>
        
              <div className="col-md-4">
                <label htmlFor="issueDate" className="form-label">Tanggal Issue</label>
                <input
                  type="date"
                  className="form-control"
                  id="issueDate"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="notes" className="form-label">Notes / Referensi</label>
                <input
                  type="text"
                  className="form-control"
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Cth: Sales Order SO-123"
                />
              </div>
            </div>
            
            <hr />


            <h5 className="mb-3">Items</h5>
            {items.map((item, index) => (
              <div className="row g-3 mb-2" key={index}>
                <div className="col-md-6">
                  <label className="form-label small">Item <span className="text-danger">*</span></label>
                  <select
                    className="form-select"
                    value={item.item_id}
                    onChange={(e) => handleItemChange(index, 'item_id', e.target.value)}
                    required
           
                    disabled={!warehouseId || loadingItems} 
                  >
                    <option value="" disabled>
                      {loadingItems ? 'Memuat item...' : (warehouseId ? 'Pilih item...' : 'Pilih gudang dulu...')}
                    </option>
                    
             
                    {masterItems.map(masterItem => (
                      <option key={masterItem.id} value={masterItem.id}>
                        [{masterItem.sku}] {masterItem.name}
                      </option>
                    ))}
                  </select>
                </div>
         
                <div className="col-md-3">
                  <label className="form-label small">Quantity <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    min="1"
                    required
                    disabled={!warehouseId}
                  />
                </div>
                <div className="col-md-3 d-flex align-items-end">
                  {items.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => handleRemoveItemRow(index)}
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm mt-2"
              onClick={handleAddItemRow}
       
              disabled={!warehouseId}
            >
              + Tambah Item
            </button>

            <hr />

            {/* Tombol Submit */}
            <div className="text-end">
              <button type="submit" className="btn btn-primary" disabled={loadingSubmit || !warehouseId}>
                {loadingSubmit ? 'Menyimpan...' : 'Simpan Goods Issue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GICreate;