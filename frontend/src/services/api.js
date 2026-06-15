import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to format errors
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

// Endpoints definitions
export const auth = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getMe: () => API.get('/auth/me')
};

export const emergency = {
  getAll: (districtCode) => API.get('/emergency', { params: { districtCode } }),
  create: (data) => API.post('/emergency', data),
  update: (id, data) => API.put(`/emergency/${id}`, data),
  delete: (id) => API.delete(`/emergency/${id}`)
};

export const hospitals = {
  getAll: (filters) => API.get('/hospitals', { params: filters }),
  getNearby: (lat, lng, radius) => API.get('/hospitals/nearby', { params: { lat, lng, radius } }),
  create: (data) => API.post('/hospitals', data),
  update: (id, data) => API.put(`/hospitals/${id}`, data),
  delete: (id) => API.delete(`/hospitals/${id}`)
};

export const schemes = {
  getAll: (filters) => API.get('/schemes', { params: filters }),
  checkEligibility: (profile) => API.post('/schemes/check', profile),
  create: (data) => API.post('/schemes', data),
  update: (id, data) => API.put(`/schemes/${id}`, data),
  delete: (id) => API.delete(`/schemes/${id}`)
};

export const education = {
  getAll: (category) => API.get('/education', { params: { category } }),
  create: (data) => API.post('/education', data),
  update: (id, data) => API.put(`/education/${id}`, data),
  delete: (id) => API.delete(`/education/${id}`)
};

export const feedback = {
  submit: (data) => API.post('/feedback', data),
  getAll: () => API.get('/feedback'),
  updateStatus: (id, status) => API.patch(`/feedback/${id}`, { status })
};

export const chatbot = {
  ask: (message, location, preferredLanguage) => API.post('/chatbot', { message, location, preferredLanguage })
};

export default API;
