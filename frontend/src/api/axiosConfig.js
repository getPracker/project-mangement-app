import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || '/api',
});

// Add an interceptor to inject the token
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  
  return config;
});

export default api;