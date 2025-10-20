import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { inventoryService } from '../services/inventoryService';

const GIDetail = () => {
  const { id } = useParams();
  const [gi, setGi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGI = async () => {
      try {
        setLoading(true);
        const response = await inventoryService.getGoodsIssueById(id);
        setGi(response.data);
      } catch (err) { setError('Gagal mengambil data GI.'); }
      finally { setLoading(false); }
    };
    fetchGI();
  }, [id]);

  if (loading) return <div className="spinner-border text-primary"></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!gi) return <div className="alert alert-warning">Data GI tidak ditemukan.</div>;

  return (
    <div className="container-fluid">
      <h1 className="h2 mb-4">Detail GI: {gi.gi_number}</h1>

      <div className="card shadow-sm mb-3">
        <div className="card-header"><h5 className="mb-0">Header</h5></div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4"><strong>Tanggal Issue:</strong><br /> {gi.issue_date}</div>
            <div className="col-md-4"><strong>User Pembuat:</strong><br /> {gi.user?.name}</div>
            <div className="col-md-4"><strong>Referensi:</strong><br /> {gi.reference_id || '-'}</div>
            <div className="col-md-12 mt-3"><strong>Notes:</strong><br /> {gi.notes || '-'}</div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header"><h5 className="mb-0">Items Dikeluarkan</h5></div>
        <div className="card-body">
          <table className="table">
            <thead className="table-light">
              <tr><th>SKU</th><th>Item</th><th>Qty Dikeluarkan</th><th>UoM</th></tr>
            </thead>
            <tbody>
              {gi.items.map(item => (
                <tr key={item.id}>
                  <td>{item.item?.sku}</td>
                  <td>{item.item?.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.item?.unit_of_measure}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default GIDetail;