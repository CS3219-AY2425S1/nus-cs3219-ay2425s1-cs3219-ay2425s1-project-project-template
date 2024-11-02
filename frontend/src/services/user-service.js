import axios from 'axios';

const getUserById = async (userId, token) => {
  const { data } = await axios.get(`http://localhost:3001/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  return data.data;
}

const userService = { getUserById };
export default userService;