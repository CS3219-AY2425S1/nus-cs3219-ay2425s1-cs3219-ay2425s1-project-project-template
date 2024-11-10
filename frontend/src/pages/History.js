import "../styles/History.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from "react";
import { COLLABORATION_SERVICE } from "../Services";
import { faHome } from '@fortawesome/free-solid-svg-icons';

export const History = () => {
  const [history, setHistory] = useState([]);
  const [header, setHeader] = useState("View past attempts!");
  const navigate = useNavigate();

  const getHistory = async (username) => {
    try {
      const response = await axios.get(`http://localhost:5002/attempts/${username}`);
      if (response.data.attempts === undefined || response.data.attempts.length === 0) {
        setHeader("Seems like you haven't solved any questions! Solve with a friend today :)");
      }
      else {
        setHistory(response.data.attempts);
      }
    } catch (error) {
      alert("An error occured when getting your history!");
      console.log(`Collab history error: ${error}`);
    }
  }

  useEffect(() => {
    getHistory(localStorage.getItem("username"));
  }, [])

  const handleRowClick = (item) => {
    const username = localStorage.getItem("username");
    navigate(`/collabhistory/${username}/${item.attemptId}`);
  }

  const handleHomeButton = (e) => {
    navigate("/home");
  }

  return (
    <div className="history">
      <div className="collab-header">Collaboration History</div>
      <div className="collab-text">{header}</div>
      <table className="history-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Question</th>
            <th>Collaborated with:</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item) => 
          <tr key={item.timestamp} onClick={() => handleRowClick(item)}>
            <td>{item.timestamp}</td>
            <td>{item.title}</td>
            <td>{item.partner}</td>
          </tr>)}
        </tbody>
      </table>
      <FontAwesomeIcon icon={faHome} style={{fontSize: "32px", color: "#F7B32B", cursor: "pointer", margin: "20px"}} onClick={handleHomeButton}>        
      </FontAwesomeIcon>

    </div>
  )
}