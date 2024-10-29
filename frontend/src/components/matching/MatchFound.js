import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/MatchPopup.css';

const generateRoomId = (difficulty, topic, language, matchedUser) => {
  const { user1, user2 } = matchedUser;
  const data = `${difficulty}-${topic}-${language}-${user1}-${user2}`;
  const roomId = btoa(data); // encode using base64
  return roomId;
};

const MatchFound = ({ matchData, closePopup }) => {
    const navigate = useNavigate();
    const { difficulty, topic, language, matchedUser } = matchData;
    const roomId = generateRoomId(difficulty, topic, language, matchedUser);

    const handleStartSession = () => {
        closePopup();
        
        navigate('/collab', {
          state: {
            difficulty,
            topic,
            language,
            matchedUser,
            roomId
          }
        });
    }

    return (
      <div className="overlay">
        <dialog open className="dialog-popup">
          <div className="popup-content">
            <h3>Match found!</h3>
            <p>Succesful match between {matchedUser.user1} and {matchedUser.user2}!</p>
            <button onClick={handleStartSession}>Start Session</button>
          </div>
        </dialog>
      </div>
    );
  };

export default MatchFound;
