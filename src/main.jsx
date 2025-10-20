import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'

// 👇 PASTIKAN BARIS INI ADA DAN DI ATAS IMPORT CSS LAIN
import 'bootstrap/dist/css/bootstrap.min.css'; 

import App from './App.jsx'
import './index.css' // CSS kustom Anda

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)