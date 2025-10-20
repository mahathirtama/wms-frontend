import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { inventoryService } from '../services/inventoryService';

const GRDetail = () => {
  const { id } = useParams();
  const [gr, setGr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGR = async () => {
      try {
        setLoading(true);
        const response = await inventoryService.getGoodsReceiptById(id);
        setGr(response.data);
      } catch (err) { setError('Gagal mengambil data GR.'); }
      finally { setLoading(false); }
    };
    fetchGR();
  }, [id]);

  if (loading) return <div className="spinner-border text-primary"></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!gr) return <div className="alert alert-warning">Data GR tidak ditemukan.</div>;

  return (
    <div className="container-fluid">
      <h1 className="h2 mb-4">Detail GR: {gr.gr_number}</h1>

      <div className="card shadow-sm mb-3">
        <div className="card-header"><h5 className="mb-0">Header</h5></div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4"><strong>Nomor PO:</strong><br /> {gr.purchase_order?.po_number}</div>
            <div className="col-md-4"><strong>Gudang:</strong><br /> {gr.warehouse?.code}</div>
            <div className="col-md-4"><strong>Tanggal Terima:</strong><br /> {gr.received_date}</div>
            <div className="col-md-4 mt-3"><strong>User Penerima:</strong><br /> {gr.user?.name}</div>
            <div className="col-md-4 mt-3"><strong>No. SJ Supplier:</strong><br /> {gr.supplier_do_number || '-'}</div>
            <div className="col-md-12 mt-3"><strong>Notes:</strong><br /> {gr.notes || '-'}</div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header"><h5 className="mb-0">Items Diterima</h5></div>
        <div className="card-body">
          <table className="table">
            <thead className="table-light">
              <tr><th>SKU</th><th>Item</th><th>Qty Diterima</th><th>UoM</th></tr>
            </thead>
            <tbody>
              {gr.items.map(item => (
                <tr key={item.id}>
                  <td>{item.item?.sku}</td>
                  <td>{item.item?.name}</td>
                  <td>{item.quantity_received}</td>
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
export default GRDetail;