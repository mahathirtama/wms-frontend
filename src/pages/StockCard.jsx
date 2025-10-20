import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { inventoryService } from '../services/inventoryService';

const StockCard = () => {
  const { itemId, warehouseId } = useParams(); 
  
  const [item, setItem] = useState(null);
  const [warehouse, setWarehouse] = useState(null);
  const [transactions, setTransactions] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockCard = async () => {
      try {
        setLoading(true);
        const response = await inventoryService.getStockCard(itemId, warehouseId);
        setItem(response.data.item);
        setWarehouse(response.data.warehouse);
        setTransactions(response.data.transactions);
      } catch (err) {
        setError('Gagal mengambil data kartu stok.');
      } finally {
        setLoading(false);
      }
    };
    fetchStockCard();
  }, [itemId, warehouseId]);

  if (loading) {
    return <div className="spinner-border text-primary" role="status"></div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container-fluid">
      <nav aria-label="breadcrumb" className="mb-2">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/inventory/stock">Stock Inquiry</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Kartu Stok</li>
        </ol>
      </nav>

      <h1 className="h2 mb-3">Kartu Stok (Stock Card)</h1>


      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <strong>Item:</strong><br />
              [{item?.sku}] {item?.name}
            </div>
            <div className="col-md-6">
              <strong>Gudang:</strong><br />
              [{warehouse?.code}] {warehouse?.name}
            </div>
          </div>
        </div>
      </div>
      

      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-striped table-sm">
            <thead className="table-light">
              <tr>
                <th>Tanggal</th>
                <th>Tipe</th>
                <th>Dokumen</th>
                <th>Quantity</th>
                <th>Stok Akhir</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{new Date(tx.created_at).toLocaleString('id-ID')}</td>
                    <td>
                      <span className={`badge bg-${tx.quantity > 0 ? 'success' : 'danger'}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td>{tx.document_number || tx.notes}</td>
                    <td className={tx.quantity > 0 ? 'text-success' : 'text-danger'}>
                      {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}
                    </td>
                    <td>{tx.quantity_after_transaction}</td>
                    <td>{tx.user?.name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">Tidak ada histori transaksi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockCard;