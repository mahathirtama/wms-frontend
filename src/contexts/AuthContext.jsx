import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import apiClient from '../services/apiClient';

// 1. Buat Context
const AuthContext = createContext(null);

// 2. Buat Provider (komponen yang "membungkus" aplikasi)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [loading, setLoading] = useState(true); // Untuk cek login awal

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Jika ada token di storage, coba ambil data user
      setToken(token);
      authService.getMe()
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          // Token tidak valid, hapus
          localStorage.removeItem('authToken');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false); // Tidak ada token, tidak perlu loading
    }
  }, []);

  const login = async (email, password) => {
    // 1. Panggil service
    const response = await authService.login({ email, password });
    
    // 2. Simpan token dan user
    const { access_token, user } = response.data;
    localStorage.setItem('authToken', access_token);
    setToken(access_token);
    setUser(user);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      // Selalu bersihkan data di frontend
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    isLoggedIn: !!user,
    loading,
    login,
    logout,
  };

  // 3. Sediakan value ke children
  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Hanya tampilkan app jika selesai loading */}
    </AuthContext.Provider>
  );
};

// 4. Buat custom hook untuk gampang dipakai
export const useAuth = () => {
  return useContext(AuthContext);
};