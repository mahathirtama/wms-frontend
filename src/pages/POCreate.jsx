import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { purchasingService } from "../services/purchasingService";

const POCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();


  const prId = location.state?.prId;


  const [supplierId, setSupplierId] = useState("");
  const [orderDate, setOrderDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [expectedDate, setExpectedDate] = useState("");
  const [notes, setNotes] = useState("");


  const [masterSuppliers, setMasterSuppliers] = useState([]);

  const [items, setItems] = useState([]);

  const [loadingPage, setLoadingPage] = useState(true); 
  const [loadingSubmit, setLoadingSubmit] = useState(false); 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingPage(true);

    
        const supplierResponse = await purchasingService.getSuppliers();
        setMasterSuppliers(supplierResponse.data);


        if (prId) {

          const prResponse = await purchasingService.getPurchaseRequestById(
            prId
          );
          const prData = prResponse.data;

          const itemsFromPR = prData.items.map((prItem) => ({
            item_id: prItem.item_id,
            item_sku: prItem.item.sku,
            item_name: prItem.item.name,
            quantity_ordered: prItem.quantity,
            unit_price: 0,
          }));

          setItems(itemsFromPR);
          setExpectedDate(prData.required_date);
          setNotes(prData.notes || "");
        }

      } catch (err) {
        setError("Gagal memuat data awal. Pastikan API backend berjalan.");
      } finally {
        setLoadingPage(false); 
      }
    };

    fetchData();
  }, [prId]); 


  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  // Fungsi Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true); 
    setError(null);
    setSuccess(null);

    const poData = {
      purchase_request_id: prId || null, 
      supplier_id: supplierId,
      order_date: orderDate,
      expected_delivery_date: expectedDate,
      notes: notes,
      items: items.map((item) => ({
        item_id: item.item_id,
        quantity_ordered: item.quantity_ordered,
        unit_price: item.unit_price,
      })),
    };

    try {
      const response = await purchasingService.createPurchaseOrder(poData);
      setSuccess(`PO ${response.data.data.po_number} berhasil dibuat!`);
      setTimeout(() => navigate("/purchasing/orders"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal membuat PO.");
    } finally {
      setLoadingSubmit(false); // Ganti state loading
    }
  };

  if (loadingPage) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <h1 className="h2 mb-4">

        {prId ? `Buat PO dari PR #${prId}` : "Buat PO Manual"}
      </h1>

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="row mb-3">
              <div className="col-md-4">
                <label htmlFor="supplier" className="form-label">
                  Supplier <span className="text-danger">*</span>
                </label>
                <select
                  id="supplier"
                  className="form-select"
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Pilih supplier...
                  </option>
                  {masterSuppliers.map((sup) => (
                    <option key={sup.id} value={sup.id}>
                      [{sup.code}] {sup.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label htmlFor="orderDate" className="form-label">
                  Tanggal Order
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="orderDate"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="expectedDate" className="form-label">
                  Tanggal Diharapkan Tiba
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="expectedDate"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                />
              </div>
              <div className="col-md-12 mt-3">
                <label htmlFor="notes" className="form-label">
                  Notes
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <hr />

            {/* Bagian Line Items */}
            <h5 className="mb-3">Items</h5>
            {items.map((item, index) => (
              <div className="row g-3 mb-2" key={index}>
                <div className="col-md-5">
                  <label className="form-label small">Item</label>
                  <input
                    type="text"
                    className="form-control"
                    value={`[${item.item_sku}] ${item.item_name}`}
                    disabled
                    readOnly
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small">Quantity Ordered</label>
                  <input
                    type="number"
                    className="form-control"
                    value={item.quantity_ordered}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "quantity_ordered",
                        e.target.value
                      )
                    }
                    min="1"
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small">
                    Unit Price (Rp) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={item.unit_price}
                    onChange={(e) =>
                      handleItemChange(index, "unit_price", e.target.value)
                    }
                    min="0"
                    required
                  />
                </div>
                {/* Kita tidak perlu tombol hapus di sini jika alurnya dari PR */}
              </div>
            ))}

            {/* Jika tidak ada item (PO Manual), tampilkan pesan */}
            {items.length === 0 && (
              <div className="text-center text-muted">
                <p>Tidak ada item dari PR.</p>
                {/* Di sini Anda bisa tambahkan logika untuk "Tambah Item Manual" */}
              </div>
            )}

            <hr />

            {/* Tombol Submit */}
            <div className="text-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loadingSubmit}
              >
                {loadingSubmit ? "Menyimpan..." : "Simpan Purchase Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default POCreate;
