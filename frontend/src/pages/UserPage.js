import "../styles/UserPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

export const UserPage = () => {
  const USER_SERVICE_HOST = "http://localhost:3001";
  const navigate = useNavigate();

  const getProfile = async () => {
    try {
      const response = await axios.get(`${USER_SERVICE_HOST}/users/userid`);
    } catch (error) {
      console.log(error);
    }
  }

  const handleHomeButton = (e) => {
    navigate("/");
  }

  /**
  useEffect(() => {
    getProfile();
  })
  */

  return (
    <div className="user-page">
      <div className="center-block">
        <img className="profile-image" src="profile.jpg" alt=""></img>
        <table className="profile-table">
          <tr>
            <td>Username</td>
            <td>xx</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>xx</td>
          </tr>
          <tr>
            <td>Created At</td>
            <td>xx</td>
          </tr>
          <tr>
            <td>Admin Access</td>
            <td>xx</td>
          </tr>
        </table>
        <FontAwesomeIcon icon={faHome} style={{fontSize: "32px", color: "#F7B32B", cursor: "pointer"}} onClick={handleHomeButton}>        
        </FontAwesomeIcon>
      </div>
    </div>
  )
}