import "../styles/UserPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import { USER_SERVICE } from "../Services";

export const UserPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [isEditing, setIsEditing] = useState({username: false, email: false});
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }

  const getProfile = async (id, accessToken) => {
    try {
      const response = await axios.get(`${USER_SERVICE}/users/${id}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      setUsername(response.data.data.username);
      setEmail(response.data.data.email);
      setCreatedAt((new Date(response.data.data.createdAt)).toLocaleDateString("en-SG", options));
    } catch (error) {
      console.log(error);
    }
  }

  const handleHomeButton = (e) => {
    navigate("/home");
  }

  useEffect(() => {
    getProfile(localStorage.getItem("userId"), localStorage.getItem("accessToken"));
  }, [])

  const deleteProfile = async (id, accessToken) => {
    try {
      const response = await axios.delete(`${USER_SERVICE}/users/${id}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      if (response.status === 200) {
        console.log(`data: ${response.data}`);
        alert("Successfully deleted your profile!");
        localStorage.clear();
        navigate("/login");
      } else {
        alert("Unknown error when deleting profile!");
        console.log(`Unknown error in deleting profile`);
      }
    } catch (error) {
      alert("Failed to delete profile!");
      console.log(`Error in deleting profile: ${error}`)
    }
  }

  const handleEditClick = (field) => {
    setIsEditing({ ...isEditing, [field]: true});
    if (field === "username") setNewUsername(username);
    if (field === "email") setNewEmail(email);
  }

  const handleCancel = (field) => {
    setIsEditing({ ...isEditing, [field]: false});
  }

  const handleSave = async (field) => {
    const id = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");

    const updatedData = {};
    if (field === "username") updatedData.username = newUsername;
    if (field === "email") updatedData.email = newEmail;

    try {
        const response = await axios.patch(`${USER_SERVICE}/users/${id}`, updatedData, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        if (field === "username") setUsername(newUsername);
        if (field === "email") setEmail(newEmail);

        setIsEditing({ ...isEditing, [field]: false});
        alert("Profile updated successfully!");
    } catch (error) {
        if (error.response && error.response.data.code === 11000) {
            alert("This email or username is already in use!")
        } else {
            console.log("Failed to update profile:", error);
            alert("Failed to update profile information!");
        }
    }
  }

  return (
    <div className="user-page">
      <div className="center-block">
        <img className="profile-image" src="profile.jpg" alt=""></img>
        <table className="profile-table">
          <tbody>
            <tr>
              <td>Username:</td>
              <td>
                <div className="editable-container">
                  {isEditing.username ? (
                    <>
                      <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)}/>
                      <button className="save-button" onClick={() => handleSave("username")}>Save</button>
                      <button className="cancel-button" onClick={() => handleCancel("username")}>Cancel</button>
                    </>
                  ) : (
                    <>
                      {username}
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="edit-icon"
                        onClick={() => handleEditClick("username")}
                      />
                    </>
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>
                <div className="editable-container">
                  {isEditing.email ? (
                    <>
                      <input type="text" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}/>
                      <button className="save-button" onClick={() => handleSave("email")}>Save</button>
                      <button className="cancel-button" onClick={() => handleCancel("email")}>Cancel</button>
                    </>
                  ) : (
                    <>
                      {email}
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="edit-icon"
                        onClick={() => handleEditClick("email")}
                      />
                    </>
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <td>Created At:</td>
              <td className="created-at">{createdAt}</td>
            </tr>
          </tbody>
        </table>
        <div className='btn-container'>
          <FontAwesomeIcon icon={faHome} style={{fontSize: "32px", color: "#F7B32B", cursor: "pointer"}} onClick={handleHomeButton}>        
          </FontAwesomeIcon>
          <button className="history-btn" onClick={(e) => navigate("/history")}>Questions attempted</button>
          <FontAwesomeIcon icon={faTrash} 
            style={{fontSize: "32px", color: "red", cursor: "pointer"}} 
            onClick={() => deleteProfile(localStorage.getItem("userId"), localStorage.getItem("accessToken"))}>
          </FontAwesomeIcon>
        </div>
      </div>
    </div>
  )
}