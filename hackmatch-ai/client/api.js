import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Tera backend port
});

// Agar token saved hai toh har request mein bhej do
API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

export default API;