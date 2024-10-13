import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext"; 
import { useNavigate } from "react-router-dom"; 

const ManageProfilePage = () => {
  const { userId, accessToken } = useAuth(); 
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8081/users/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }

        const data = await response.json();
        setUsername(data.data.username);
        setEmail(data.data.email);
      } catch (err) {
        setError(err.message);
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
    const updatedUser = {};

    if (username) updatedUser.username = username;
    if (email) updatedUser.email = email;
    if (password) updatedUser.password = password;

    try {
        const response = await fetch(`http://localhost:8081/users/${userId}`, {
        method: 'PATCH', 
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
        });

        if (!response.ok) {
        throw new Error("Failed to update profile.");
        }

        alert("Profile updated successfully!");
    } catch (err) {
        setError(err.message);
    }
  };


  const handleBack = () => {
    navigate("/dashboard"); 
  };

  if (loading) return <p style={{ color: "white", textAlign: "center" }}>Loading...</p>; 
  if (error) return <p style={{ color: "white", textAlign: "center" }}>{error}</p>;

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh", 
      textAlign: "center", 
      color: "white",
      position: "relative" 
    }}>
      <button
        onClick={handleBack}
        style={{
          position: "absolute", 
          top: "30px", 
          left: "30px", 
          padding: "10px 20px",
          backgroundColor: "white",
          color: "black",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "16px",
          fontFamily: "Figtree",
          transition: "background-color 0.3s",
          width: "auto",
        }}
      >
        Back to Dashboard
      </button>

      <form onSubmit={handleSubmit} style={{ maxWidth: "350px", width: "100%", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "20px" }}>Manage Profile</h2>
        
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="username">Username</label>
          <div>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              style={{
                border: "none",
                borderBottom: "2px solid white",
                outline: "none",
                backgroundColor: "transparent",
                color: "white",
                fontSize: "20px",
                marginTop: "5px",
                width: "100%",
                textAlign: "center"
              }}
            />
          </div>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="email">Email</label>
          <div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off" 
              style={{
                border: "none",
                borderBottom: "2px solid white",
                outline: "none",
                backgroundColor: "transparent",
                color: "white",
                fontSize: "20px",
                marginTop: "5px",
                width: "100%",
                textAlign: "center"
              }}
            />
          </div>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="password">Password</label>
          <div>
            <input
              type="password"
              id="password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              autoComplete="off" 
              style={{
                border: "none",
                borderBottom: "2px solid white",
                outline: "none",
                backgroundColor: "transparent",
                color: "white",
                fontSize: "20px",
                marginTop: "5px",
                width: "100%",
                textAlign: "center"
              }}
            />
          </div>
        </div>
        <button
          type="submit"
          onMouseEnter={() => setIsHovered(true)} 
          onMouseLeave={() => setIsHovered(false)} 
          style={{
            marginTop: "30px",
            padding: "15px 30px",
            backgroundColor: isHovered ? '#f0f0f0' : 'white',
            color: 'black',
            border: "none",
            borderRadius: "15px",
            cursor: "pointer",
            fontSize: '16px',
            fontFamily: 'Figtree',
            transition: "background-color 0.3s",
            width: "100%",
            maxWidth: "200px",
            margin: "0 auto",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ManageProfilePage;
