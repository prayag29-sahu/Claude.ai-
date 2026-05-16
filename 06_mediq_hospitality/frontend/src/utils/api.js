import axios from 'axios';
import toast from 'react-hot-toast';

const API = axios.create({
  baseURL:         process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout:         15000,
});

// ── Request interceptor — inject token ────────────────────────────
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('mediq_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor — handle 401 / errors ────────────────────
API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const msg = err.response?.data?.error || err.message || 'Network error';

    if (err.response?.status === 401 && err.response?.data?.code === 'TOKEN_EXPIRED') {
      // Attempt silent token refresh
      try {
        const { data } = await axios.post(`${API.defaults.baseURL}/auth/refresh`, {}, { withCredentials: true });
        localStorage.setItem('mediq_token', data.token);
        err.config.headers.Authorization = `Bearer ${data.token}`;
        return API(err.config);
      } catch (_) {
        localStorage.removeItem('mediq_token');
        localStorage.removeItem('mediq_user');
        window.location.href = '/login';
      }
    }

    if (err.response?.status === 401) {
      localStorage.removeItem('mediq_token');
      localStorage.removeItem('mediq_user');
    }

    if (err.response?.status >= 500) {
      toast.error('Server error — please try again.');
    }

    return Promise.reject({ ...err, message: msg });
  }
);

export default API;
