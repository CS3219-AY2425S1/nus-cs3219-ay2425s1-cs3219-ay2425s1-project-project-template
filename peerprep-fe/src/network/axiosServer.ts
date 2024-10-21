'use server';
import axios from 'axios';
import { cookies } from 'next/headers';

const API_GATEWAY_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8001';

const axiosServer = axios.create({
  baseURL: `${API_GATEWAY_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for authorization token using server-side cookies
axiosServer.interceptors.request.use(
  (config) => {
    const token = cookies().get('access-token')?.value;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

const axiosAuthServer = axios.create({
  baseURL: process.env.AUTH_SERVICE_URL || 'http://172.17.0.1:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosAuthServer.interceptors.request.use(
  (config) => {
    const token = cookies().get('access-token')?.value;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export { axiosServer, axiosAuthServer };
