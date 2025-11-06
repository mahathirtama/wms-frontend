import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { purchasingService } from '../services/purchasingService';
import { itemService } from '../services/itemService';

const PREdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State untuk form
  const [status, setStatus] = useState('');
  const [requiredDate, setRequiredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([]); // Line items
  
  const [masterItems, setMasterItems] = useState([]); // Master item
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);


useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);


        const itemParams = {
          per_page: 9999 
        };
        

        const [itemResponse, prResponse] = await Promise.all([
          itemService.getItems(itemParams), 
          purchasingService.getPurchaseRequestById(id)
        ]);


        setMasterItems(itemResponse.data.data || []);


        const pr = prResponse.data;
        setStatus(pr.status);
        setRequiredDate(pr.required_date);
        setNotes(pr.notes || '');
        setItems(pr.items.map(item => ({
          id: item.id,
          item_id: item.item_id,
          quantity: item.quantity
        })));

      } catch (err) {
        setError('Gagal memuat data.');
        setMasterItems([]); 
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]); 

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };
  const handleAddItemRow = () => {
    setItems([...items, { item_id: '', quantity: 1, id: null }]); 
  };
  const handleRemoveItemRow = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // 3. Fungsi Submit (UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);


    const prData = {
      status: status,
      required_date: requiredDate,
      notes: notes,
      items: items.filter(item => item.item_id && item.quantity > 0),
      _method: 'PUT' 
    };

    try {
      await purchasingService.updatePurchaseRequest(id, prData);
      setSuccess('PR berhasil di-update!');
      setTimeout(() => navigate(`/purchasing/requests/${id}`), 1500); 
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal meng-update PR.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !masterItems.length) {
    return <div className="spinner-border text-primary" role="status"></div>;
  }

  if (error && !success) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container-fluid">
      <h1 className="h2 mb-4">Edit Purchase Request (PR)</h1>

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

  
            <div className="row mb-3">
              <div className="col-md-3">
                <label htmlFor="status" className="form-label">Status</label>
                <select 
                  id="status" 
                  className="form-select" 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="pending_approval">Pending Approval</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="col-md-3">
                <label htmlFor="requiredDate" className="form-label">Tanggal Dibutuhkan</label>
                <input
                  type="date"
                  className="form-control"
                  id="requiredDate"
                  value={requiredDate}
                  onChange={(e) => setRequiredDate(e.target.value)}
                />
              </div>
              <div className="col-md-6">
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

            {/* Bagian Line Items (Sama seperti PRCreate) */}
            <h5 className="mb-3">Items</h5>
            {items.map((item, index) => (
              <div className="row g-3 mb-2" key={index}>
                <div className="col-md-6">
                  <label className="form-label small">Item</label>
                  <select
                    className="form-select"
                    value={item.item_id}
                    onChange={(e) => handleItemChange(index, 'item_id', e.target.value)}
                  >
                    <option value="" disabled>Pilih item...</option>
                    {masterItems.map(masterItem => (
                      <option key={masterItem.id} value={masterItem.id}>
                        [{masterItem.sku}] {masterItem.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label small">Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    min="1"
                  />
                </div>
                <div className="col-md-3 d-flex align-items-end">
                  <button type="button" className="btn btn-outline-danger" onClick={() => handleRemoveItemRow(index)}>
                    Hapus
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-outline-secondary btn-sm mt-2" onClick={handleAddItemRow}>
              + Tambah Item
            </button>
            <hr />

            {/* Tombol Submit */}
            <div className="text-end">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PREdit;