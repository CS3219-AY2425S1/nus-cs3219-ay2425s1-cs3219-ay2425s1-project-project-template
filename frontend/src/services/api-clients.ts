import axios, { AxiosInstance } from 'axios';

export const userApiClient: AxiosInstance = axios.create({
  baseURL: 'https://api.microservice1.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const questionApiClient = axios.create({
  baseURL: '/question-service',
  headers: {
    'Content-Type': 'application/json',
  },
});

// define more api clients for other microservices
