import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import GeneralNavbar from "../components/navbar/GeneralNavbar";
import "../styles/Profile.css";
import DefaultImage from '../assets/Default.jpg';
import useAuth from "../hooks/useAuth";

const Profile = () => {
  const { userId, cookies } = useAuth();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
  });
  const [profilePic, setprofilePic] = useState(DefaultImage);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user data when userId is available
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
          withCredentials: true,
        });
        setUserData({
          username: data.data.username,
          email: data.data.email,
        });
        setprofilePic(data.data.profileImage || DefaultImage);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        toast.error("Failed to load profile");
      }
    };
    if (userId) {
      fetchUserProfile();
    }
  }, [userId, cookies]);

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSave = async () => {
    // Validation
    if (!userData.username) {
      toast.error("Username cannot be empty.");
      return;
    }

    // Simple email validation regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!emailRegex.test(userData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    try {
      // Extract username and email from the userData state
      const updatedData = {
        username: userData.username,
        email: userData.email,
      };
  
      // Send PATCH request to the backend
      const response = await axios.patch(
        `http://localhost:3001/users/${userId}`,
        updatedData, // Only include username and email
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`, // Use the token for authorization
          },
          withCredentials: true,
        }
      );
  
      // If successful, update the UI and show success message
      if (response.status === 200) {
        toast.success("Changes saved successfully!");
      } else {
        toast.error("Failed to save changes.");
      }
  
      // Disable editing after saving
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to save changes.");
    }
  };

  return (
    <div>
      <GeneralNavbar />
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">User Profile</h1>
          <p className="profile-subtitle">Manage your profile.</p>
        </div>

        <div className="profile-content">
          {/* Profile Picture Section */}
          <div className="profile-pic-section">
            <img
              src={profilePic || DefaultImage}
              alt="Profile"
              className="profile-pic"
            />
          </div>

          {/* User Info Section */}
          <div className="user-info-section">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="info-text"
                value={userData.username}
                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="info-text"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          
            {/* Buttons Section */}
            <div className="button-group">
              {isEditing ? (
                <button className="save-btn" onClick={handleSave}>
                  Save
                </button>
              ) : (
                <button className="edit-btn" onClick={toggleEdit}>
                  Edit Info
                </button>
              )}
              <button className="change-password-btn">Change Password</button>
            </div>
          </div>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Profile;
