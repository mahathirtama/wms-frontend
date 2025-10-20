import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

// CSS Sederhana untuk Konten (Tambahkan ke CSS global Anda)
/*
.main-content {
  margin-left: 250px; // Lebar yang sama dengan .sidebar
  padding: 2rem;
  width: calc(100% - 250px);
}
*/

const MainLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet /> {/* Halaman (Dashboard, dll) akan dirender di sini */}
      </main>
    </div>
  );
};

export default MainLayout;