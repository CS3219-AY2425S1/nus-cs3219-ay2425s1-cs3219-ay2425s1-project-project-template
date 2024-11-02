import React, { useState, useEffect } from 'react';
import '../../styles/CollabPopup.css';
import SessionExpiredPopup from './SessionExpiredPopup';

const TimeUpPopup = ({ continueSession, quitSession, continueAlone }) => {
    const [countdown, setCountdown] = useState(10); // 10-second countdown
    const [waitingForPartner, setWaitingForPartner] = useState(false);
    const [sessionExpired, setSessionExpired] = useState(false);

    useEffect(() => {
        let interval;
        if (!waitingForPartner && countdown > 0) {
            interval = setInterval(() => setCountdown((prev) => prev - 1), 1000);
        } else if (countdown === 0 && !waitingForPartner) {
            quitSession();
        }
        return () => clearInterval(interval);
    }, [waitingForPartner, countdown, quitSession]);

    const handleContinueSession = () => {
        setWaitingForPartner(true);
        setCountdown(10);
        continueSession();
    };

    useEffect(() => {
        let interval;
        if (waitingForPartner && countdown > 0) {
            interval = setInterval(() => setCountdown((prev) => prev - 1), 1000);
        } else if (waitingForPartner && countdown === 0) {
            setSessionExpired(true); // Show session expired popup
        }
        return () => clearInterval(interval);
    }, [waitingForPartner, countdown]);

    if (sessionExpired) return <SessionExpiredPopup continueAlone={continueAlone}/>;

    return (
        <div className="overlay">
            <dialog open className="dialog-popup">
                <div className="popup-content">
                    <h3>Time's Up!</h3>
                    {!waitingForPartner ? (
                        <>
                            <p>The collaboration session has ended. Would you like to extend the session?</p>
                            <p>{countdown} seconds left to decide.</p>
                            <button className="confirm-button" onClick={handleContinueSession}>Continue Session</button>
                            <button className="cancel-button" onClick={quitSession}>Quit Session</button>
                        </>
                    ) : (
                        <>
                            <p>Waiting for your partner to confirm... ({countdown} seconds left)</p>
                            {countdown <= 0 && <p>Session will end if the partner does not confirm.</p>}
                        </>
                    )}
                </div>
            </dialog>
        </div>
    );
};

export default TimeUpPopup;