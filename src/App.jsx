import React from 'react';
import AppRoutes from './routes/AppRoutes';

function App() {
  // Anda bisa tambahkan layout utama (Navbar, Sidebar) di sini jika mau,
  // atau di dalam ProtectedRoute
  return (
    <div className="app-container">
      <AppRoutes />
    </div>
  );
}

export default App;