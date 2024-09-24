import axios from 'axios';

const USER_SERVICE = import.meta.env.VITE_USER_SERVICE;

export const userApiGetClient = axios.create({
  baseURL: USER_SERVICE,
  withCredentials: true,
});

export const userApiClient = axios.create({
  baseURL: USER_SERVICE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// define more api clients for other microservices
