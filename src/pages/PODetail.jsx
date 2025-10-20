import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { purchasingService } from '../services/purchasingService';

const PODetail = () => {
  const { id } = useParams();
  const [po, setPo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPO = async () => {
      try {
        setLoading(true);
        const response = await purchasingService.getPurchaseOrderById(id);
        setPo(response.data);
      } catch (err) { setError('Gagal mengambil data PO.'); }
      finally { setLoading(false); }
    };
    fetchPO();
  }, [id]);

  if (loading) return <div className="spinner-border text-primary"></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!po) return <div className="alert alert-warning">Data PO tidak ditemukan.</div>;

  return (
    <div className="container-fluid">
      <h1 className="h2 mb-4">Detail PO: {po.po_number}</h1>


      <div className="card shadow-sm mb-3">
        <div className="card-header"><h5 className="mb-0">Header</h5></div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4"><strong>Supplier:</strong><br /> {po.supplier?.name}</div>
            <div className="col-md-4"><strong>Tanggal Order:</strong><br /> {po.order_date}</div>
            <div className="col-md-4"><strong>Exp. Tiba:</strong><br /> {po.expected_delivery_date}</div>
            <div className="col-md-4 mt-3"><strong>Status:</strong><br /> <span className={`badge fs-6 bg-${po.status === 'fully_received' ? 'success' : 'primary'}`}>{po.status}</span></div>
            <div className="col-md-4 mt-3"><strong>Total:</strong><br /> Rp {Number(po.total_amount).toLocaleString('id-ID')}</div>
            <div className="col-md-4 mt-3"><strong>Pembuat:</strong><br /> {po.user?.name}</div>
            <div className="col-md-12 mt-3"><strong>Notes:</strong><br /> {po.notes || '-'}</div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header"><h5 className="mb-0">Items</h5></div>
        <div className="card-body">
          <table className="table">
            <thead className="table-light">
              <tr><th>SKU</th><th>Item</th><th>Qty Order</th><th>Qty Diterima</th><th>Harga Satuan</th><th>Subtotal</th></tr>
            </thead>
            <tbody>
              {po.items.map(item => (
                <tr key={item.id}>
                  <td>{item.item?.sku}</td>
                  <td>{item.item?.name}</td>
                  <td>{item.quantity_ordered}</td>
                  <td>{item.quantity_received}</td>
                  <td>Rp {Number(item.unit_price).toLocaleString('id-ID')}</td>
                  <td>Rp {(Number(item.quantity_ordered) * Number(item.unit_price)).toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default PODetail;