import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = () => {
  const { logout, user } = useAuth(); // Ambil user object
  const navigate = useNavigate();

  // --- HELPER FUNCTION UNTUK CEK ROLE ---
  const hasRole = (requiredRoles) => {
    // 1. Jika tidak ada user atau roles, jangan tampilkan apa pun
    if (!user || !user.roles) {
      return false;
    }

    // 2. Jika user adalah 'admin', selalu tampilkan
    if (user.roles.some(role => role.slug === 'admin')) {
      return true;
    }

    // 3. Pastikan requiredRoles selalu array
    const rolesToCheck = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

    // 4. Cek apakah user punya SALAH SATU role yang dibutuhkan
    return user.roles.some(userRole => rolesToCheck.includes(userRole.slug));
  };
  // --- END HELPER FUNCTION ---


  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="sidebar bg-light border-end">
      <div>
        <h4 className="mb-4">WMS</h4>

        {/* Daftar Navigasi (Dengan Kondisi) */}
        <ul className="nav nav-pills flex-column mb-auto">

          {/* Dashboard (Bisa diakses semua role) */}
          <li className="nav-item mb-1">
            <NavLink to="/dashboard" className="nav-link">
              Dashboard
            </NavLink>
          </li>

          {/* --- Menu Purchasing (Hanya Purchasing Staff & Admin) --- */}
          {hasRole('purchasing-staff') && (
            <>
              <li className="nav-item mb-1">
                <NavLink to="/purchasing/requests" className="nav-link">
                  Purchase Requests
                </NavLink>
              </li>
              <li className="nav-item mb-1">
                <NavLink to="/purchasing/orders" className="nav-link">
                  Purchase Orders
                </NavLink>
              </li>
            </>
          )}

          {/* --- Menu Inventory (Hanya Warehouse Staff & Admin) --- */}
          {hasRole('warehouse-staff') && (
            <>
              <li className="nav-item mb-1">
                <NavLink to="/inventory/goods-receipt" className="nav-link">
                  Goods Receipt
                </NavLink>
              </li>
              <li className="nav-item mb-1">
                <NavLink to="/inventory/goods-issue" className="nav-link">
                  Goods Issue
                </NavLink>
              </li>
              <li className="nav-item mb-1">
                <NavLink to="/inventory/goods-transfer" className="nav-link">
                  Goods Transfer
                </NavLink>
              </li>
              <li className="nav-item mb-1">
                <NavLink to="/inventory/stock" className="nav-link">
                  Stock Inquiry
                </NavLink>
              </li>
            </>
          )}

           {/* --- Menu Master Data (Contoh: Bisa diakses Keduanya & Admin) --- */}
           {hasRole(['purchasing-staff', 'warehouse-staff']) && (
             <>
               <hr />
               <li className="nav-item mb-1">
                 <NavLink to="/master/items" className="nav-link">
                   Master Items
                 </NavLink>
               </li>
               {/* Tambahkan master lain di sini jika perlu */}
             </>
           )}

        </ul>
      </div>

      {/* Bagian Bawah Sidebar (User & Logout) */}
      <div className="mt-auto">
        <hr />
        <div className="small mb-2">
          Logged in as: <br />
          <strong>{user?.name || "User"}</strong>
          {/* Tampilkan role (opsional) */}
          <small className="d-block text-muted">
             ({user?.roles?.map(r => r.name).join(', ')})
          </small>
        </div>
        <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;