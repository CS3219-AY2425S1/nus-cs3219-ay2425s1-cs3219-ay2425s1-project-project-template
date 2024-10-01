import axios from 'axios';

export const createUser = async (username: string, email: string, password: string) => {
  try {
    await axios.post('http://localhost:8003/users', { username, email, password });
  } catch (error) {
    console.error('Error creating user:', error);
    throw error; 
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post('http://localhost:8003/auth/login', { email, password });
    const { accessToken } = response.data.data;
    localStorage.setItem('authToken', accessToken);
  } catch (error) {
    console.error('Error logging in:', error);
    throw error; 
  }
};

export const verifyToken = async () => {
  const accessToken = localStorage.getItem('authToken');
  if (!accessToken) {
    return false;
  }
  try {
    const response = await axios.get('http://localhost:8003/auth/verify-token', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('Token verified');
    return response.data;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
}