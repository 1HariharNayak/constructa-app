// API Client Service for SITEFLOW
// Seamlessly interfaces between the reactive local prototype and backend Express/MongoDB server

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const USE_BACKEND = false; // Set to true when running local Node/Express backend

class ApiService {
  constructor() {
    this.token = localStorage.getItem('siteflow_auth_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) localStorage.setItem('siteflow_auth_token', token);
    else localStorage.removeItem('siteflow_auth_token');
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {})
    };
  }

  async get(endpoint) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return res.json();
  }

  async post(endpoint, data) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return res.json();
  }

  async put(endpoint, data) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return res.json();
  }

  async delete(endpoint) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return res.json();
  }
}

export const api = new ApiService();
