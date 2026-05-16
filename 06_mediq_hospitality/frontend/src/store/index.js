import { create } from 'zustand';
import API from '../utils/api';
import toast from 'react-hot-toast';

// ── Auth Store ────────────────────────────────────────────────────
export const useAuthStore = create((set, get) => ({
  user:    JSON.parse(localStorage.getItem('mediq_user')  || 'null'),
  token:   localStorage.getItem('mediq_token') || null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('mediq_token', data.token);
      localStorage.setItem('mediq_user',  JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
      toast.success(`Welcome back, ${data.user.name}!`);
      return { success: true, user: data.user };
    } catch (err) {
      set({ loading: false });
      toast.error(err.message || 'Login failed');
      return { success: false, error: err.message };
    }
  },

  register: async (payload) => {
    set({ loading: true });
    try {
      const { data } = await API.post('/auth/register', payload);
      localStorage.setItem('mediq_token', data.token);
      localStorage.setItem('mediq_user',  JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
      toast.success('Account created successfully!');
      return { success: true, user: data.user };
    } catch (err) {
      set({ loading: false });
      toast.error(err.message || 'Registration failed');
      return { success: false, error: err.message };
    }
  },

  logout: async () => {
    try { await API.post('/auth/logout'); } catch (_) {}
    localStorage.removeItem('mediq_token');
    localStorage.removeItem('mediq_user');
    set({ user: null, token: null });
    toast.success('Logged out');
  },

  refreshMe: async () => {
    try {
      const { data } = await API.get('/auth/me');
      set({ user: data.user });
      localStorage.setItem('mediq_user', JSON.stringify(data.user));
    } catch (_) {}
  },

  updateProfile: async (payload) => {
    try {
      const { data } = await API.put('/auth/profile', payload);
      set({ user: data.user });
      localStorage.setItem('mediq_user', JSON.stringify(data.user));
      toast.success('Profile updated');
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false };
    }
  },

  isAdmin:    () => ['admin','superadmin'].includes(get().user?.role),
  isCustomer: () => get().user?.role === 'customer',
  isLoggedIn: () => !!get().user,
}));

// ── Hospital Store ────────────────────────────────────────────────
export const useHospitalStore = create((set, get) => ({
  hospitals: [], selectedHospital: null,
  total: 0, pages: 0, page: 1,
  loading: false, error: null,
  filters: { procedure:'', city:'', tier:'', accreditation:'', pmjay:'', search:'', sortBy:'score' },

  setFilters: (f) => set(s => ({ filters: { ...s.filters, ...f }, page: 1 })),
  setSelected: (h) => set({ selectedHospital: h }),

  fetchHospitals: async (extra = {}) => {
    const { filters, page } = get();
    set({ loading: true, error: null });
    try {
      const params = { ...filters, ...extra, page, limit: 15 };
      // Remove empty keys
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const { data } = await API.get('/hospitals', { params });
      set({ hospitals: data.hospitals, total: data.total, pages: data.pages, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchHospital: async (id) => {
    set({ loading: true });
    try {
      const { data } = await API.get(`/hospitals/${id}`);
      set({ selectedHospital: data.hospital, loading: false });
      return data.hospital;
    } catch (err) {
      set({ loading: false });
      return null;
    }
  },

  toggleSave: async (hospitalId) => {
    try {
      const { data } = await API.post(`/auth/saved/${hospitalId}`);
      toast.success(data.message);
      useAuthStore.getState().refreshMe();
    } catch (err) {
      toast.error(err.message);
    }
  },
}));

// ── Chat Store ────────────────────────────────────────────────────
export const useChatStore = create((set, get) => ({
  messages: [], sessionId: null, isTyping: false,
  lastParsed: null, lastHospitals: [], lastCost: null,
  suggestions: ['Angioplasty in Nagpur under ₹3 lakh, age 58, diabetic','Best cancer hospital Mumbai for chemotherapy','Knee replacement Pune ₹2.5 lakh','Kidney dialysis cost Hyderabad','Bypass surgery Delhi age 65 hypertension','Cataract surgery Jaipur affordable'],

  addMessage: (m) => set(s => ({ messages: [...s.messages, m] })),

  sendMessage: async (text, context = {}) => {
    const { sessionId, addMessage } = get();
    addMessage({ role:'user', content:text, id: Date.now() });
    set({ isTyping: true });
    try {
      const { data } = await API.post('/chat/message', { message: text, sessionId, context });
      set({ sessionId: data.sessionId, lastParsed: data.parsed, lastHospitals: data.hospitals||[], lastCost: data.costEstimate });
      addMessage({ role:'assistant', content: data.response?.message || 'Could not process.', id: Date.now()+1, parsed: data.parsed, hospitals: data.hospitals, cost: data.costEstimate, response: data.response });
    } catch (err) {
      addMessage({ role:'assistant', content:'⚠️ Connection error. Please ensure the backend is running.', id: Date.now()+1, isError: true });
    } finally {
      set({ isTyping: false });
    }
  },

  clearChat: () => set({ messages:[], sessionId:null, lastParsed:null, lastHospitals:[], lastCost:null }),
}));

// ── Cost Store ────────────────────────────────────────────────────
export const useCostStore = create((set) => ({
  estimate: null, comparisons: [], history: [], loading: false,

  fetchEstimate: async (params) => {
    set({ loading: true });
    try {
      const { data } = await API.post('/costs/estimate', params);
      set({ estimate: data.estimate, loading: false });
      return data.estimate;
    } catch (err) {
      toast.error(err.message);
      set({ loading: false });
      return null;
    }
  },

  fetchComparisons: async (params) => {
    set({ loading: true });
    try {
      const { data } = await API.post('/costs/compare', params);
      set({ comparisons: data.comparisons||[], loading: false });
    } catch (err) {
      set({ loading: false });
    }
  },

  fetchHistory: async () => {
    try {
      const { data } = await API.get('/costs/history');
      set({ history: data.estimates||[] });
    } catch (_) {}
  },
}));

// ── Admin Store ───────────────────────────────────────────────────
export const useAdminStore = create((set) => ({
  dashboard: null, users: [], analytics: null,
  loading: false,

  fetchDashboard: async () => {
    set({ loading: true });
    try {
      const { data } = await API.get('/admin/dashboard');
      set({ dashboard: data, loading: false });
    } catch (err) {
      set({ loading: false });
    }
  },

  fetchUsers: async (params = {}) => {
    set({ loading: true });
    try {
      const { data } = await API.get('/admin/users', { params });
      set({ users: data.users||[], loading: false });
      return data;
    } catch (err) {
      set({ loading: false });
      return { users: [] };
    }
  },

  updateUser: async (id, payload) => {
    try {
      const { data } = await API.put(`/admin/users/${id}`, payload);
      toast.success('User updated');
      return data;
    } catch (err) {
      toast.error(err.message);
    }
  },

  createHospital: async (payload) => {
    try {
      const { data } = await API.post('/hospitals', payload);
      toast.success('Hospital created');
      return { success: true, hospital: data.hospital };
    } catch (err) {
      toast.error(err.message);
      return { success: false };
    }
  },

  updateHospital: async (id, payload) => {
    try {
      const { data } = await API.put(`/hospitals/${id}`, payload);
      toast.success('Hospital updated');
      return { success: true, hospital: data.hospital };
    } catch (err) {
      toast.error(err.message);
      return { success: false };
    }
  },

  deleteHospital: async (id) => {
    try {
      await API.delete(`/hospitals/${id}`);
      toast.success('Hospital removed');
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false };
    }
  },

  fetchAnalytics: async () => {
    try {
      const { data } = await API.get('/admin/analytics');
      set({ analytics: data });
    } catch (_) {}
  },
}));
