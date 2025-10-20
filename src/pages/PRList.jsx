import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { purchasingService } from '../services/purchasingService';

const PRList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await purchasingService.getPurchaseRequests();
      setRequests(response.data.data); 
    } catch (err) {
      setError('Gagal mengambil data Purchase Requests.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDelete = async (id) => {

    if (!window.confirm(`Anda yakin ingin menghapus PR #${id}?`)) {
      return;
    }

    try {
      await purchasingService.deletePurchaseRequest(id);

      fetchRequests(); 
    } catch (err) {
      setError('Gagal menghapus PR: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return <div className="spinner-border text-primary" role="status"></div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2">Purchase Requests</h1>
        <Link to="/purchasing/requests/create" className="btn btn-primary">
          Buat PR Baru
        </Link>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>PR Number</th>
                <th>Requester</th>
                <th>Tanggal Dibutuhkan</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((pr) => (
                  <tr key={pr.id}>
                    <td>{pr.pr_number}</td>
                    <td>{pr.user?.name || 'N/A'}</td>
                    <td>{pr.required_date}</td>
                    <td>
                      <span className={`badge bg-${pr.status === 'approved' ? 'success' : 'warning'}`}>
                        {pr.status}
                      </span>
                    </td>
                  <td>

                    {pr.status === 'approved' && (
                      <Link 
                        to="/purchasing/orders/create"
       
                        state={{ prId: pr.id }} 
                        className="btn btn-sm btn-success me-1"
                      >
                        Buat PO
                      </Link>
                    )}

                      <Link to={`/purchasing/requests/${pr.id}`} className="btn btn-sm btn-outline-info me-1">
                        Detail
                      </Link>
                      
                  
                      {pr.status === 'draft' && (
                        <>
                          <Link to={`/purchasing/requests/${pr.id}/edit`} className="btn btn-sm btn-outline-warning me-1">
                            Edit
                          </Link>
                          <button 
                            onClick={() => handleDelete(pr.id)} 
                            className="btn btn-sm btn-outline-danger"
                          >
                            Hapus
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">Tidak ada data.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PRList;