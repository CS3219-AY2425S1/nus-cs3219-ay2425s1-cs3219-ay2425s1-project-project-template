import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext"; 
import axios from "axios";

const ManageProfilePage = () => {
  const { userId, accessToken } = useAuth(); 
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}` 
          }
        });
        setUsername(response.data.username);
        setEmail(response.data.email);
      } catch (err) {
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) { 
      fetchUserData();
    }
  }, [userId, accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUser = {
      username,
      email,
      password,
    };

    try {
      await axios.put(`/api/users/${userId}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${accessToken}` 
        }
      });
      alert("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Profile</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
          />
        </div>
        <button type="submit" style={{ padding: "10px 15px" }}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ManageProfilePage;
