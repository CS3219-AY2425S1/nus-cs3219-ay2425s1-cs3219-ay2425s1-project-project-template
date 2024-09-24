import axios, { AxiosInstance } from 'axios';

const USER_SERVICE = import.meta.env.VITE_USER_SERVICE;

export const userApiClient: AxiosInstance = axios.create({
  baseURL: USER_SERVICE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// define more api clients for other microservices
