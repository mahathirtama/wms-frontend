import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { purchasingService } from '../services/purchasingService';

const PRDetail = () => {
  const { id } = useParams(); 
  const [pr, setPr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPR = async () => {
      try {
        setLoading(true);
        const response = await purchasingService.getPurchaseRequestById(id);
        setPr(response.data); 
      } catch (err) {
        setError('Gagal mengambil data PR.');
      } finally {
        setLoading(false);
      }
    };
    fetchPR();
  }, [id]); 

  if (loading) {
    return <div className="spinner-border text-primary" role="status"></div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!pr) {
    return <div className="alert alert-warning">Data PR tidak ditemukan.</div>;
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2">Detail PR: {pr.pr_number}</h1>
        <Link to={`/purchasing/requests/${pr.id}/edit`} className="btn btn-warning">
          Edit PR Ini
        </Link>
      </div>

      <div className="card shadow-sm mb-3">
        <div className="card-header">
          <h5 className="mb-0">Header</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <strong>Requester:</strong><br />
              {pr.user?.name || 'N/A'}
            </div>
            <div className="col-md-4">
              <strong>Tanggal Dibutuhkan:</strong><br />
              {pr.required_date}
            </div>
            <div className="col-md-4">
              <strong>Status:</strong><br />
              <span className={`badge fs-6 bg-${pr.status === 'approved' ? 'success' : 'warning'}`}>
                {pr.status}
              </span>
            </div>
            <div className="col-md-12 mt-3">
              <strong>Notes:</strong><br />
              {pr.notes || '-'}
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="mb-0">Items</h5>
        </div>
        <div className="card-body">
          <table className="table">
            <thead className="table-light">
              <tr>
                <th>SKU</th>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>UoM</th>
              </tr>
            </thead>
            <tbody>
              {pr.items.map(item => (
                <tr key={item.id}>
                  <td>{item.item?.sku || 'N/A'}</td>
                  <td>{item.item?.name || 'N/A'}</td>
                  <td>{item.quantity}</td>
                  <td>{item.item?.unit_of_measure || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PRDetail;