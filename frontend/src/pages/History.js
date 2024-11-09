import "../styles/History.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from "react";
import { COLLABORATION_SERVICE } from "../Services";

export const History = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  const getHistory = async (username) => {
    try {
      const response = await axios.get(`http://localhost:5002/attempts/${username}`);
      console.log(response.data);
      setHistory(response.data.attempts);

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

  return (
    <div className="history">
      <div className="collab-header">Collaboration History</div>
      <div className="collab-text">View past attempts!</div>
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

    </div>
  )
}