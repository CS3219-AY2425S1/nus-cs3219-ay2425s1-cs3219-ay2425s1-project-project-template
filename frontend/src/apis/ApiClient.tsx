import axios from 'axios';

export const api = axios.create({ baseURL: 'http://localhost/api' });

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;

    return Promise.reject(message);
  },
);
