import axios from 'axios';

export const createUser = async (username: string, email: string, password: string) => {
  return await axios.post('http://localhost:8003/users', { username, email, password })
    .then(response => response.data)
    .catch(error => {
      console.error('Error creating question:', error);
      throw error;
    });
};