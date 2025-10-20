import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inventoryService } from '../services/inventoryService';

const GTList = () => {
  const [gtList, setGtList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoodsTransfers = async () => {
      try {
        setLoading(true);
        const response = await inventoryService.getGoodsTransfers({ page: 1 });
        setGtList(response.data.data); // Ambil dari array 'data' paginasi
      } catch (err) {
        setError('Gagal mengambil data Goods Transfer.');
      } finally {
        setLoading(false);
      }
    };
    fetchGoodsTransfers();
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
        <h1 className="h2">Daftar Goods Transfer</h1>
        <Link to="/inventory/goods-transfer/create" className="btn btn-primary">
          Buat GT Baru
        </Link>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>GT Number</th>
                <th>Tanggal</th>
                <th>Gudang Asal</th>
                <th>Gudang Tujuan</th>
                <th>User</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {gtList.length > 0 ? (
                gtList.map((gt) => (
                  <tr key={gt.id}>
                    <td>{gt.gt_number}</td>
                    <td>{gt.transfer_date}</td>
                    <td>{gt.from_warehouse?.code || 'N/A'}</td>
                    <td>{gt.to_warehouse?.code || 'N/A'}</td>
                    <td>{gt.user?.name || 'N/A'}</td>
                    <td>
                      <Link to={`/inventory/goods-transfer/${gt.id}`} className="btn btn-sm btn-outline-secondary">
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">Belum ada data Goods Transfer.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GTList;