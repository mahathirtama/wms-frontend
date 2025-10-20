import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { purchasingService } from '../services/purchasingService';
import { itemService } from '../services/itemService';

const PRCreate = () => {
  const navigate = useNavigate();

  const [requiredDate, setRequiredDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  

  const [masterItems, setMasterItems] = useState([]);
  

  const [items, setItems] = useState([
    { item_id: '', quantity: 1 }
  ]);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);


  useEffect(() => {
    itemService.getItems()
      .then(response => {
        setMasterItems(response.data);
      })
      .catch(err => {
        setError('Gagal memuat data item. Pastikan API backend berjalan.');
      });
  }, []);


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
    setLoading(true);
    setError(null);
    setSuccess(null);

    const prData = {
      required_date: requiredDate,
      notes: notes,
      items: items.filter(item => item.item_id && item.quantity > 0) 
    };

    try {
      const response = await purchasingService.createPurchaseRequest(prData);
      setSuccess(`PR ${response.data.data.pr_number} berhasil dibuat!`);

      setItems([{ item_id: '', quantity: 1 }]);
      setNotes('');

      setTimeout(() => navigate('/purchasing/orders'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat PR.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="h2 mb-4">Buat Purchase Request (PR) Baru</h1>

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* Bagian Header Form */}
            <div className="row mb-3">
              <div className="col-md-4">
                <label htmlFor="requiredDate" className="form-label">Tanggal Dibutuhkan</label>
                <input
                  type="date"
                  className="form-control"
                  id="requiredDate"
                  value={requiredDate}
                  onChange={(e) => setRequiredDate(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-8">
                <label htmlFor="notes" className="form-label">Notes</label>
                <input
                  type="text"
                  className="form-control"
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Catatan opsional..."
                />
              </div>
            </div>
            
            <hr />

            {/* Bagian Line Items */}
            <h5 className="mb-3">Items</h5>
            {items.map((item, index) => (
              <div className="row g-3 mb-2" key={index}>
                <div className="col-md-6">
                  <label className="form-label small">Item</label>
                  <select
                    className="form-select"
                    value={item.item_id}
                    onChange={(e) => handleItemChange(index, 'item_id', e.target.value)}
                    required
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
                    required
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
            >
              + Tambah Item
            </button>

            <hr />

            {/* Tombol Submit */}
            <div className="text-end">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan Purchase Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PRCreate;