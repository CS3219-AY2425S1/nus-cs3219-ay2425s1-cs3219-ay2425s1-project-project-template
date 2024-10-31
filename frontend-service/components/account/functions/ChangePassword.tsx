import { useState } from 'react';

function ChangePassword({ userId }) {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      // Retrieve the JWT token
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error((await response.json()).message || 'An error occurred');
      }

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleChangePassword}>
      <label>
        New Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit">Change Password</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default ChangePassword;
