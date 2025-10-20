import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemService } from '../services/itemService';

const ItemCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    unit_of_measure: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await itemService.createItem(formData);
      setSuccess('Item berhasil ditambahkan!');

      setFormData({ sku: '', name: '', description: '', unit_of_measure: '' });
      setTimeout(() => navigate('/master/items'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menambahkan item.');
  
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="h2 mb-4">Tambah Item Baru</h1>
      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="mb-3">
              <label htmlFor="sku" className="form-label">SKU (Kode Unik) <span className="text-danger">*</span></label>
              <input type="text" className="form-control" id="sku" name="sku" value={formData.sku} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Nama Item <span className="text-danger">*</span></label>
              <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Deskripsi</label>
              <textarea className="form-control" id="description" name="description" value={formData.description} onChange={handleChange}></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="unit_of_measure" className="form-label">Satuan (Unit of Measure) <span className="text-danger">*</span></label>
              <input type="text" className="form-control" id="unit_of_measure" name="unit_of_measure" value={formData.unit_of_measure} onChange={handleChange} placeholder="Cth: PCS, KG, MTR" required />
            </div>

            <div className="text-end">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ItemCreate;