import React, { useEffect, useRef } from 'react';
import '../../styles/MatchPopup.css';

const MatchPopup = ({ countdown, showPopup, closePopup }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (showPopup) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [showPopup]);

  return (
    <dialog ref={dialogRef} className="dialog-popup">
      <div className="popup-content">
        <h3>Finding a Match...</h3>
        <p>Time remaining: {countdown} seconds</p>
        <p>Please wait while we find a match for you.</p>
        <button onClick={closePopup}>Cancel</button>
      </div>
    </dialog>
  );
};

export default MatchPopup;
