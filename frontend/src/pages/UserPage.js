import "../styles/UserPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";

export const UserPage = () => {
  const USER_SERVICE_HOST = "http://localhost:3002";
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
      const response = await axios.get(`${USER_SERVICE_HOST}/users/${id}`, {
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
  })

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
        <FontAwesomeIcon icon={faHome} style={{fontSize: "32px", color: "#F7B32B", cursor: "pointer"}} onClick={handleHomeButton}>        
        </FontAwesomeIcon>
      </div>
    </div>
  )
}