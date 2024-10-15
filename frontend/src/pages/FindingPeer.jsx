import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const FindingPeer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { selectedTopics, selectedLevel, waitTimeInSeconds } =
    location.state || {};

  const [time, setTime] = useState(waitTimeInSeconds || 120); 
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      clearInterval(interval);
      navigate("/matching-service"); 
    }

    return () => clearInterval(interval);
  }, [isActive, time, navigate]);

  const handleEndSession = () => {
    setIsActive(false);
    navigate("/matching-service");
  };

  return (
    <div className="flex min-h-screen bg-black">
      <ToastContainer />
      <div className="m-6 flex h-[calc(100vh-3rem)] w-full flex-col items-center justify-center rounded-3xl border border-gray-300/30">
        <h1 className="mb-5 text-xl font-bold text-lime-400">
          Searching for a peer...
        </h1>
        <div className="mb-6 text-8xl font-bold text-white">
          {Math.floor(time / 60)}:{("0" + (time % 60)).slice(-2)}
        </div>
        <div className="mb-4 flex space-x-1 text-sm text-gray-300">
          <h1 className="font-bold text-lime-400">Topics:</h1>
          <p>{selectedTopics?.join(", ")}</p>
        </div>
        <div className="mb-4 flex space-x-1 text-sm text-gray-300">
          <h1 className="font-bold text-lime-400">Level:</h1>
          <p>{selectedLevel}</p>
        </div>

        <button
          onClick={handleEndSession}
          className="rounded-full bg-red-500 px-6 py-2 text-white hover:bg-red-600"
        >
          End Session
        </button>
      </div>
    </div>
  );
};

export default FindingPeer;
