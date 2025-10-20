import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { purchasingService } from '../services/purchasingService';
import { inventoryService } from '../services/inventoryService';

const GoodsReceiptCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const poId = location.state?.poId;

  // State untuk Header GR
  const [warehouseId, setWarehouseId] = useState('');
  const [receivedDate, setReceivedDate] = useState(new Date().toISOString().split('T')[0]);
  const [supplierDo, setSupplierDo] = useState('');
  const [notes, setNotes] = useState('');

  // State untuk Data
  const [poData, setPoData] = useState(null); // Data PO lengkap
  const [masterWarehouses, setMasterWarehouses] = useState([]);
  
  // State untuk Line Items
  const [items, setItems] = useState([]); // Ini adalah item-item yang akan DIKIRIM

  // State UI
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // 1. Ambil data PO dan data Gudang
  useEffect(() => {
    if (!poId) {
      setError('ID Purchase Order tidak ditemukan. Harap kembali ke daftar PO.');
      setLoadingPage(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoadingPage(true);
        
        // Ambil data Gudang
        const warehouseRes = await inventoryService.getWarehouses();
        setMasterWarehouses(warehouseRes.data);

        // Ambil data PO lengkap
        const poRes = await purchasingService.getPurchaseOrderById(poId);
        setPoData(poRes.data);
        
        const itemsFromPO = poRes.data.items.map(poItem => ({
          po_item_id: poItem.id, 
          item_id: poItem.item_id,
          sku: poItem.item.sku,
          name: poItem.item.name,
          quantity_ordered: poItem.quantity_ordered,
          quantity_already_received: poItem.quantity_received,
          quantity_to_receive: 0,
        }));
        setItems(itemsFromPO);

      } catch (err) {
        setError('Gagal memuat data PO atau Gudang.');
      } finally {
        setLoadingPage(false);
      }
    };
    
    fetchData();
  }, [poId]);

  // 2. Fungsi untuk handle perubahan kuantitas
  const handleQuantityChange = (index, value) => {
    const newItems = [...items];
    const item = newItems[index];
    const sisaOrder = item.quantity_ordered - item.quantity_already_received;
    
    let qty = Number(value);
    

    if (qty > sisaOrder) {
      qty = sisaOrder;
    }

    if (qty < 0) {
      qty = 0;
    }

    item.quantity_to_receive = qty;
    setItems(newItems);
  };

  // 3. Fungsi Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setError(null);
    setSuccess(null);


    const itemsToSubmit = items
      .filter(item => item.quantity_to_receive > 0)
      .map(item => ({
        po_item_id: item.po_item_id,
        quantity_received: item.quantity_to_receive,
      }));

    if (itemsToSubmit.length === 0) {
      setError('Tidak ada item yang diterima. Harap isi kuantitas.');
      setLoadingSubmit(false);
      return;
    }

    // Data yang dikirim ke API GR
    const grData = {
      purchase_order_id: poId,
      warehouse_id: warehouseId,
      received_date: receivedDate,
      supplier_do_number: supplierDo,
      notes: notes,
      items: itemsToSubmit,
    };

    try {
      // Panggil API GR
      const response = await inventoryService.createGoodsReceipt(grData);
      setSuccess(`Goods Receipt ${response.data.data.gr_number} berhasil dibuat!`);
      setTimeout(() => navigate('/purchasing/orders'), 2000); // Kembali ke daftar PO
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan Goods Receipt.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingPage) {
    return <div className="spinner-border text-primary" role="status"></div>;
  }
  
  if (!poData && !error) {
     return <div className="alert alert-warning">Memuat data PO...</div>;
  }

  return (
    <div className="container-fluid">
      <h1 className="h2 mb-4">Terima Barang (Goods Receipt)</h1>
      <h3 className="h5 mb-3">PO: {poData?.po_number}</h3>

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* Bagian Header Form */}
            <div className="row mb-3">
              <div className="col-md-4">
                <label htmlFor="warehouse" className="form-label">Gudang Penerima <span className="text-danger">*</span></label>
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
                <label htmlFor="receivedDate" className="form-label">Tanggal Diterima</label>
                <input
                  type="date"
                  className="form-control"
                  id="receivedDate"
                  value={receivedDate}
                  onChange={(e) => setReceivedDate(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="supplierDo" className="form-label">Surat Jalan Supplier</label>
                <input
                  type="text"
                  className="form-control"
                  id="supplierDo"
                  value={supplierDo}
                  onChange={(e) => setSupplierDo(e.target.value)}
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

            {/* Bagian Line Items */}
            <h5 className="mb-3">Items</h5>
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Item</th>
                  <th style={{ width: '15%' }}>Qty Order</th>
                  <th style={{ width: '15%' }}>Qty Diterima</th>
                  <th style={{ width: '15%' }}>Sisa</th>
                  <th style={{ width: '20%' }}>Qty Diterima Sekarang <span className="text-danger">*</span></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const sisa = item.quantity_ordered - item.quantity_already_received;
                  return (
                    <tr key={item.po_item_id}>
                      <td>
                        [{item.sku}] {item.name}
                      </td>
                      <td>{item.quantity_ordered}</td>
                      <td>{item.quantity_already_received}</td>
                      <td>{sisa}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={item.quantity_to_receive}
                          onChange={(e) => handleQuantityChange(index, e.target.value)}
                          min="0"
                          max={sisa}
                          disabled={sisa <= 0} 
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            
            <hr />

            {/* Tombol Submit */}
            <div className="text-end">
              <button type="submit" className="btn btn-primary" disabled={loadingSubmit}>
                {loadingSubmit ? 'Menyimpan...' : 'Simpan Goods Receipt'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GoodsReceiptCreate;