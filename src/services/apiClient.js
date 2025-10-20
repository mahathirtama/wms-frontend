import axios from 'axios';



const VITE_API_URL = import.meta.env.VITE_API_BASE_URL;

if (!VITE_API_URL) {
  console.error("VITE_API_BASE_URL is not set in your .env.local file!");
}



const apiClient = axios.create({
 baseURL: VITE_API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem('authToken');

    if (token) {
      
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {

    return Promise.reject(error);
  }
);

export default apiClient;