import React from 'react';
import '../../styles/MatchPopup.css';


const MatchFound = ({ matchedUser, closePopup }) => {
    return (
      <div className="overlay">
        <dialog open className="dialog-popup">
          <div className="popup-content">
            <h3>Match found with {matchedUser.username}!</h3>
            <button onClick={closePopup}>Start Session</button>
          </div>
        </dialog>
      </div>
    );
  };

export default MatchFound;
