import axios, { AxiosError } from 'axios';
import { API_URL } from './apiURL';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem('authToken');
    if (authToken && !config.url?.includes('/admin/login')) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized or token expired
      localStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);
