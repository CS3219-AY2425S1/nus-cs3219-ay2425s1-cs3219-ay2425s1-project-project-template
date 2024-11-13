import React, { useState, useEffect, useContext } from 'react';
import DefaultIcon from '../../assets/user.png';
import { getUserByEmail, updateUserById } from '../../api/UserApi'; // Assuming this is the function to update user info
import { UserContext } from "../../App";

const SettingPage = () => {
  const { userEmail } = useContext(UserContext);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [id, setId] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (userEmail) {
      localStorage.setItem("userEmail", userEmail);
    }
  }, [userEmail]);

  // Fetch user info based on email
  useEffect(() => {
    const storedEmail = userEmail || localStorage.getItem("userEmail");

    if (storedEmail) {
      setIsLoading(true);
      setStatus(""); 

      async function fetchUser() {
        try {
          const userData = await getUserByEmail(storedEmail);
          if (userData && userData.data) {
            setId(userData.data.id)
            setUsername(userData.data.username); // Set initial form values
            setEmail(userData.data.email);
          } else {
            setStatus("User data not available. Please try again later.");
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          setStatus("Error loading user data. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      }

      fetchUser();
    } else {
      setStatus("No user email provided. Please log in.");
      setIsLoading(false);
    }
  }, [userEmail]);

  // Handle form submission for updating user profile
  const handleSaveChanges = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
  
    // Check if user ID is available before making the API request
    if (!id) {
      setError('User ID is missing');
      setLoading(false);
      return;
    }
  
    // Prepare update data without password
    const updateData = {
      username,
      email,
    };
  
    try {
      const updatedUser = await updateUserById(id, updateData);
      setSuccess('Profile updated successfully');
    } catch (err) { 
      console.error("Failed to update profile:", err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  // Conditional rendering for loading or user data error
  if (isLoading) {
    return <div>Loading user data...</div>;
  }

  if (!id) {
    return <div>{status}</div>;
  }

  return (
    <div className="flex flex-col h-full bg-white p-6">
      <div className="grid flex-grow grid-cols-3 overflow-hidden border border-gray-300 rounded-lg">
        <div className="flex flex-col justify-between col-span-3 py-6 px-6">
          <div>
            <p className="text-gray-800 text-xl font-bold mb-6">User Profile</p>

            <div className="flex items-center gap-4 mb-6 relative">
              <div className="w-20 h-20 bg-gray-200 rounded-full relative overflow-hidden">
                <img
                  src={DefaultIcon} // Replace with actual image path or dynamic avatar source
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
                {/* Hover Button */}
                <button
                  className="avatar-button"
                  onClick={() => alert('Change Profile Picture')}
                >
                  Change
                </button>
              </div>
              <div>
                <p className="text-gray-800 text-lg font-semibold">{username}</p>
                <p className="text-gray-600 text-sm">{email}</p>
                {/* Display User ID */}
                <p className="text-gray-600 text-sm">User ID: {id}</p>
              </div>
            </div>

            <div className="flex items-end border-b border-gray-300 gap-4 pb-6 mb-6">
              {/* Form Fields for Username and Email */}
              <div className="grid flex-grow grid-cols-2 gap-4">
                <input
                  type="text"
                  className="border rounded px-3 py-2"
                  placeholder="New Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="email"
                  className="border rounded px-3 py-2"
                  placeholder="New Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                onClick={handleSaveChanges}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded w-1/4 disabled:bg-blue-300"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

          </div>

          {/* Display Error or Success Message */}
          {error && <p className="text-red-500 mt-4">{error}</p>}
          {success && <p className="text-green-500 mt-4">{success}</p>}

        </div>
      </div>
    </div>
  );
};

export default SettingPage;
