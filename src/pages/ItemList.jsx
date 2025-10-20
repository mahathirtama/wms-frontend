import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemService } from '../services/itemService';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchItems = async (page = 1) => { 
      try {
        setLoading(true);
        const params = { page }; // Kirim page ke API
        const response = await itemService.getItems(params);
        setItems(response.data.data);

      } catch (err) {
        setError('Gagal mengambil data item.');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
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
        <h1 className="h2">Master Items</h1>
        <Link to="/master/items/create" className="btn btn-primary">
          Tambah Item Baru
        </Link>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Description</th>
                <th>Unit</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.sku}</td>
                    <td>{item.name}</td>
                    <td>{item.description || '-'}</td>
                    <td>{item.unit_of_measure}</td>
                    <td>
                      <Link 
                        to={`/master/items/${item.id}/edit`} 
                        className="btn btn-sm btn-outline-warning"
                      >
                        Edit
                      </Link>
                  
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">Belum ada data item.</td>
                </tr>
              )}
            </tbody>
          </table>
       
        </div>
      </div>
    </div>
  );
};

export default ItemList;