import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '../services/inventoryService';

// Ini adalah FOTOCOPY dari GICreate.jsx, dengan sedikit modifikasi
const GTCreate = () => {
  const navigate = useNavigate();
  
  // State untuk Header
  const [fromWarehouseId, setFromWarehouseId] = useState(''); // Gudang Asal
  const [toWarehouseId, setToWarehouseId] = useState('');     // Gudang Tujuan
  const [transferDate, setTransferDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  
  // State untuk Master Data
  const [masterWarehouses, setMasterWarehouses] = useState([]);
  const [masterItems, setMasterItems] = useState([]); // Awalnya kosong
  
  // State untuk Line Items
  const [items, setItems] = useState([
    { item_id: '', quantity: 1 }
  ]);

  // State UI
  const [loadingWarehouses, setLoadingWarehouses] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // 1. Ambil data master Gudang
  useEffect(() => {
    setLoadingWarehouses(true);
    inventoryService.getWarehouses()
      .then(response => {
        setMasterWarehouses(response.data);
      })
      .catch(err => setError('Gagal memuat data gudang.'))
      .finally(() => setLoadingWarehouses(false));
  }, []);

  // 2. EFEK (CHAINED DROPDOWN): Berjalan saat 'fromWarehouseId' berubah
  useEffect(() => {
    // Validasi: Jika gudang asal belum dipilih, kosongi item
    if (!fromWarehouseId) {
      setMasterItems([]);
      setItems([{ item_id: '', quantity: 1 }]);
      return;
    }
    
    // Validasi: Jika gudang asal = gudang tujuan, reset
    if (fromWarehouseId === toWarehouseId) {
      setToWarehouseId(''); // Kosongkan gudang tujuan
    }

    // Ambil item yang ADA STOK-nya di gudang asal
    const fetchAvailableItems = async () => {
      setLoadingItems(true);
      setError(null);
      setItems([{ item_id: '', quantity: 1 }]);
      
      try {
        const params = {
          warehouse_id: fromWarehouseId,
          per_page: 9999
        };
        const response = await inventoryService.getStockLevels(params);
        
        // Hanya ambil 'item' dari data 'stock_level'
        const availableItems = response.data.data.map(stockLevel => stockLevel.item);
        setMasterItems(availableItems);

      } catch (err) {
        setError('Gagal memuat data item untuk gudang ini.');
      } finally {
        setLoadingItems(false);
      }
    };

    fetchAvailableItems();
  }, [fromWarehouseId]); // <-- Trigger dependency!

  // 3. Fungsi DYNAMIC FORM (tetap sama)
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

  // 4. Fungsi Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi Frontend
    if (fromWarehouseId === toWarehouseId) {
      setError('Gudang Asal dan Gudang Tujuan tidak boleh sama.');
      return;
    }
    
    setLoadingSubmit(true);
    setError(null);
    setSuccess(null);

    const gtData = {
      from_warehouse_id: fromWarehouseId,
      to_warehouse_id: toWarehouseId,
      transfer_date: transferDate,
      notes: notes,
      items: items.filter(item => item.item_id && item.quantity > 0)
    };

    try {
      const response = await inventoryService.createGoodsTransfer(gtData);
      setSuccess(`Goods Transfer ${response.data.data.gt_number} berhasil dibuat!`);
      // Reset form
      setItems([{ item_id: '', quantity: 1 }]);
      setNotes('');
      setFromWarehouseId('');
      setToWarehouseId('');
      
      setTimeout(() => navigate('/inventory/goods-transfer'), 2000);
    } catch (err) {
      // Menampilkan error dari backend (cth: "Stok tidak mencukupi")
      setError(err.response?.data?.message || 'Gagal membuat Goods Transfer.');
    } finally {
      setLoadingSubmit(false);
    }
  };
  
  if (loadingWarehouses) {
    return <div className="spinner-border text-primary" role="status"></div>;
  }

  return (
    <div className="container-fluid">
      <h1 className="h2 mb-4">Buat Goods Transfer (Pindah Gudang)</h1>

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* Bagian Header Form */}
            <div className="row mb-3">
              <div className="col-md-4">
                <label htmlFor="fromWarehouse" className="form-label">Gudang Asal <span className="text-danger">*</span></label>
                <select
                  id="fromWarehouse"
                  className="form-select"
                  value={fromWarehouseId}
                  onChange={(e) => setFromWarehouseId(e.target.value)} // Ini men-trigger useEffect
                  required
                >
                  <option value="" disabled>Pilih gudang asal...</option>
                  {masterWarehouses.map(wh => (
                    <option key={wh.id} value={wh.id}>
                      [{wh.code}] {wh.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label htmlFor="toWarehouse" className="form-label">Gudang Tujuan <span className="text-danger">*</span></label>
                <select
                  id="toWarehouse"
                  className="form-select"
                  value={toWarehouseId}
                  onChange={(e) => setToWarehouseId(e.target.value)}
                  required
                >
                  <option value="" disabled>Pilih gudang tujuan...</option>
                  {masterWarehouses
                    .filter(wh => wh.id !== fromWarehouseId) // Filter agar gudang asal tdk muncul
                    .map(wh => (
                      <option key={wh.id} value={wh.id}>
                        [{wh.code}] {wh.name}
                      </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label htmlFor="transferDate" className="form-label">Tanggal Transfer</label>
                <input
                  type="date"
                  className="form-control"
                  id="transferDate"
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-12 mt-3">
                <label htmlFor="notes" className="form-label">Notes</label>
                <input
                  type="text"
                  className="form-control"
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
            
            <hr />

            {/* Bagian Line Items (Sama seperti GICreate) */}
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
                    disabled={!fromWarehouseId || loadingItems} 
                  >
                    <option value="" disabled>
                      {loadingItems ? 'Memuat item...' : (fromWarehouseId ? 'Pilih item...' : 'Pilih gudang asal dulu...')}
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
                    disabled={!fromWarehouseId}
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
              disabled={!fromWarehouseId}
            >
              + Tambah Item
            </button>

            <hr />

            {/* Tombol Submit */}
            <div className="text-end">
              <button type="submit" className="btn btn-primary" disabled={loadingSubmit || !fromWarehouseId || !toWarehouseId}>
                {loadingSubmit ? 'Menyimpan...' : 'Simpan Goods Transfer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GTCreate;