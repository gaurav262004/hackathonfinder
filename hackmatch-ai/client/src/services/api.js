// API base URL
export const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
export const api = {
  async request(method, endpoint, data = null, token = null) {
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    const config = {
      method,
      headers,
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'API Error');
    }

    return result;
  },

  // Auth endpoints
  auth: {
    signup: (name, email, password) =>
      api.request('POST', '/auth/signup', { name, email, password }),
    login: (email, password) =>
      api.request('POST', '/auth/login', { email, password }),
  },

  // User endpoints
  users: {
    getProfile: (token) =>
      api.request('GET', '/users/profile', null, token),
    updateProfile: (data, token) =>
      api.request('PUT', '/users/profile', data, token),
    discover: (token) =>
      api.request('GET', '/users/discover', null, token),
    getUser: (userId, token) =>
      api.request('GET', `/users/${userId}`, null, token),
    connect: (userId, token) =>
      api.request('POST', `/users/connect/${userId}`, {}, token),
  },

  // Project endpoints
  projects: {
    create: (data, token) =>
      api.request('POST', '/projects/create', data, token),
    getAll: (token) =>
      api.request('GET', '/projects', null, token),
    getOne: (projectId, token) =>
      api.request('GET', `/projects/${projectId}`, null, token),
    apply: (projectId, token) =>
      api.request('POST', `/projects/${projectId}/apply`, {}, token),
    updateApplication: (projectId, appId, status, token) =>
      api.request('PUT', `/projects/${projectId}/application/${appId}`, { status }, token),
    getMyProjects: (token) =>
      api.request('GET', '/projects/user/my-projects', null, token),
  },
};

// Local storage helpers
export const tokenHelper = {
  save: (token) => localStorage.setItem('token', token),
  get: () => localStorage.getItem('token'),
  remove: () => localStorage.removeItem('token'),
  isValid: () => !!localStorage.getItem('token'),
};

// User helper
export const userHelper = {
  save: (user) => localStorage.setItem('user', JSON.stringify(user)),
  get: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  remove: () => localStorage.removeItem('user'),
};
