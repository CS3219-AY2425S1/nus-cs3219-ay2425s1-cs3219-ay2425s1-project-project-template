import axios from 'axios';

export const USER_SERVICE = 'user-service';

export const userApiClient = axios.create({
  baseURL: USER_SERVICE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userApiGetClient = axios.create({
  baseURL: USER_SERVICE,
  withCredentials: true,
});

// define more api clients for other microservices
