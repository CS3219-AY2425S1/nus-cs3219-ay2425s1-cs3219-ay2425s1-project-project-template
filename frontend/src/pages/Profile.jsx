import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import jwtDecode from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import GeneralNavbar from "../components/GeneralNavbar";
import "../styles/Profile.css";
import DefaultImage from '../assets/Default.jpg';

const Profile = () => {
  const [cookies] = useCookies(['token']);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    profilePic: "",
  });
  const [editing, setEditing] = useState(false);
  const [file, setFile] = useState(null); // For profile picture upload

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = "your-user-id-here"; // Change this to the correct user ID
        const { data } = await axios.get(`http://localhost:3001/user/${userId}`, {
          withCredentials: true,
        });
        setUserData({
          username: data.data.username,
          email: data.data.email,
          profilePic: data.data.profileImage,
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        toast.error("Failed to load profile");
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile); // Store the uploaded file
  };

  const handleSave = async () => {
    try {
      const userId = "your-user-id-here"; // Replace with the correct user ID

      // First update username and email
      await axios.patch(
        `http://localhost:3001/user/${userId}`,
        {
          username: userData.username,
          email: userData.email,
        },
        { withCredentials: true }
      );

      // If there's a new profile picture, upload it
      if (file) {
        const formData = new FormData();
        formData.append("profileImage", file);

        await axios.post(
          `http://localhost:3001/user/profile-picture`, // Adjust to the actual API route
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      toast.success("Profile updated successfully");
      setEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <>
      <GeneralNavbar /> {/* Navbar at the top */}
      <div className="profile-container">
        <div className="profile-header">
          <h2 className="profile-title">User Profile</h2>
          <p className="profile-subtitle">Manage your profile.</p>
        </div>

        <div className="profile-content">
          {/* Profile Picture Section */}
          <div className="profile-pic-section">
            <img
              src={userData.profilePic || DefaultImage}
              alt="Profile"
              className="profile-pic"
            />
            {editing && (
              <label className="edit-pic">
                <input type="file" onChange={handleFileChange} />
                Edit
              </label>
            )}
          </div>

          {/* User Info Section */}
          <div className="user-info-section">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                value={userData.username}
                onChange={handleInputChange}
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <button onClick={() => setEditing(!editing)}>
                {editing ? "Cancel" : "Edit Profile"}
              </button>
              {editing && (
                <button onClick={handleSave} className="save-btn">
                  Save Changes
                </button>
              )}
            </div>

            <div className="form-group">
              <button className="change-password-btn">Change Password</button>
            </div>
          </div>
        </div>

        <ToastContainer />
      </div>
    </>
  );
};

export default Profile;
