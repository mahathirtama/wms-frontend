import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { inventoryService } from '../services/inventoryService';

const GTDetail = () => {
  const { id } = useParams();
  const [gt, setGt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGT = async () => {
      try {
        setLoading(true);
        const response = await inventoryService.getGoodsTransferById(id);
        setGt(response.data);
      } catch (err) { setError('Gagal mengambil data GT.'); }
      finally { setLoading(false); }
    };
    fetchGT();
  }, [id]);

  if (loading) return <div className="spinner-border text-primary"></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!gt) return <div className="alert alert-warning">Data GT tidak ditemukan.</div>;

  return (
    <div className="container-fluid">
      <h1 className="h2 mb-4">Detail GT: {gt.gt_number}</h1>

      <div className="card shadow-sm mb-3">
        <div className="card-header"><h5 className="mb-0">Header</h5></div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3"><strong>Tanggal Transfer:</strong><br /> {gt.transfer_date}</div>
            <div className="col-md-3"><strong>Gudang Asal:</strong><br /> {gt.from_warehouse?.code}</div>
            <div className="col-md-3"><strong>Gudang Tujuan:</strong><br /> {gt.to_warehouse?.code}</div>
            <div className="col-md-3"><strong>User Pembuat:</strong><br /> {gt.user?.name}</div>
            <div className="col-md-12 mt-3"><strong>Notes:</strong><br /> {gt.notes || '-'}</div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header"><h5 className="mb-0">Items Ditransfer</h5></div>
        <div className="card-body">
          <table className="table">
            <thead className="table-light">
              <tr><th>SKU</th><th>Item</th><th>Qty Ditransfer</th><th>UoM</th></tr>
            </thead>
            <tbody>
              {gt.items.map(item => (
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
export default GTDetail;