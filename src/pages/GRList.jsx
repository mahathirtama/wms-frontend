import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inventoryService } from '../services/inventoryService';

const GRList = () => {
  const [grList, setGrList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoodsReceipts = async () => {
      try {
        setLoading(true);
        const response = await inventoryService.getGoodsReceipts({ page: 1 });
        setGrList(response.data.data); 
      } catch (err) {
        setError('Gagal mengambil data Goods Receipt.');
      } finally {
        setLoading(false);
      }
    };
    fetchGoodsReceipts();
  }, []);

  if (loading) {
    return <div className="spinner-border text-primary" role="status"></div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2">Daftar Goods Receipt</h1>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>GR Number</th>
                <th>Nomor PO</th>
                <th>Gudang</th>
                <th>Tanggal Terima</th>
                <th>User</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {grList.length > 0 ? (
                grList.map((gr) => (
                  <tr key={gr.id}>
                    <td>{gr.gr_number}</td>
                    <td>{gr.purchase_order?.po_number || 'N/A'}</td>
                    <td>{gr.warehouse?.code || 'N/A'}</td>
                    <td>{gr.received_date}</td>
                    <td>{gr.user?.name || 'N/A'}</td>
                    <td>
                      <Link to={`/inventory/goods-receipt/${gr.id}`} className="btn btn-sm btn-outline-secondary">
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">Belum ada data Goods Receipt.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GRList;