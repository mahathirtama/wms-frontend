import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inventoryService } from '../services/inventoryService';

const GIList = () => {
  const [giList, setGiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoodsIssues = async () => {
      try {
        setLoading(true);
        const response = await inventoryService.getGoodsIssues({ page: 1 });
        setGiList(response.data.data); 
      } catch (err) {
        setError('Gagal mengambil data Goods Issue.');
      } finally {
        setLoading(false);
      }
    };
    fetchGoodsIssues();
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
        <h1 className="h2">Daftar Goods Issue</h1>
        <Link to="/inventory/goods-issue/create" className="btn btn-primary">
          Buat GI Baru
        </Link>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>GI Number</th>
                <th>Tanggal Issue</th>
                <th>User</th>
                <th>Referensi</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {giList.length > 0 ? (
                giList.map((gi) => (
                  <tr key={gi.id}>
                    <td>{gi.gi_number}</td>
                    <td>{gi.issue_date}</td>
                    <td>{gi.user?.name || 'N/A'}</td>
                    <td>{gi.reference_id || gi.notes || 'N/A'}</td>
                    <td>
                      <Link to={`/inventory/goods-issue/${gi.id}`} className="btn btn-sm btn-outline-secondary">
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">Belum ada data Goods Issue.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GIList;