import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { purchasingService } from '../services/purchasingService';

const POList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const response = await purchasingService.getPurchaseOrders({ page: 1 });
        setOrders(response.data.data); 
      } catch (err) {
        setError('Gagal mengambil data Purchase Orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
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
        <h1 className="h2">Purchase Orders</h1>
        <Link to="/purchasing/orders/create" className="btn btn-primary">
          Buat PO Baru
        </Link>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>PO Number</th>
                <th>Supplier</th>
                <th>Order Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((po) => (
                  <tr key={po.id}>
                    
                    <td>{po.po_number}</td>
                    <td>{po.supplier?.name || 'N/A'}</td>
                    <td>{po.order_date}</td>
                    <td>
                      <span className={`badge bg-${po.status === 'sent' ? 'primary' : 'success'}`}>
                        {po.status}
                      </span>
                    </td>
                    <td>Rp {Number(po.total_amount).toLocaleString('id-ID')}</td>
                    <td>
                      <Link to={`/purchasing/orders/${po.id}`} className="btn btn-sm btn-outline-secondary">
                        Detail
                      </Link>
                    </td>
                    <td>

                      {(po.status === 'sent' || po.status === 'partially_received') && (
                        <Link 
                          to="/inventory/goods-receipt/create"
   
                          state={{ poId: po.id }} 
                          className="btn btn-sm btn-success me-1"
                        >
                          Terima Barang
                        </Link>
                      )}
                      
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">Tidak ada data.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default POList;