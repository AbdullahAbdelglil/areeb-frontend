// src/services/api.ts
import axios from 'axios';
import { refreshToken } from './authService';

const API_BASE_URL = 'http://localhost:8080/api/v1'; 

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

