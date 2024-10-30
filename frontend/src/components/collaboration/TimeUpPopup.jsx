import React from 'react';
import '../../styles/CollabPopup.css';

const TimeUpPopup = ({ continueSession, quitSession }) => {
    return (
        <div className="overlay">
            <dialog open className="dialog-popup">
                <div className="popup-content">
                    <h3>Time's Up!</h3>
                    <p>The collaboration session has ended. Would you like to extend the session?</p>
                    <button className="confirm-button" onClick={continueSession}>Continue Session</button>
                    <button className="cancel-button" onClick={quitSession}>Quit Session</button>
                </div>
            </dialog>
        </div>
    );
};

export default TimeUpPopup;