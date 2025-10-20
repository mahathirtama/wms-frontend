import apiClient from './apiClient';


const login = (data) => {
  return apiClient.post('/login', data);
};


const logout = () => {
  return apiClient.post('/logout');
};


const getMe = () => {
  return apiClient.get('/user');
};


export const authService = {
  login,
  logout,
  getMe,
};