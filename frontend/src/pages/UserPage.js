import "../styles/UserPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import { USER_SERVICE } from "../Services";

export const UserPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [createdAt, setCreatedAt] = useState("");

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

  return (
    <div className="user-page">
      <div className="center-block">
        <img className="profile-image" src="profile.jpg" alt=""></img>
        <table className="profile-table">
          <tbody>
            <tr>
              <td>Username</td>
              <td>{username}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{email}</td>
            </tr>
            <tr>
              <td>Created At</td>
              <td>{createdAt}</td>
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