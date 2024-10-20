import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AvatarDisplay from '../components/AvatarDisplay';
import LoadingDots from '../components/LoadingDots';
import socketService from '../services/socketService'; // WebSocket service

function MatchingPage({ difficulties, topics, languages, setMatchResult }) {
  const [time, setTime] = useState(30);
  const [matchingFailed, setMatchingFailed] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (time <= 0) {
      setMatchingFailed(true);
      return;
    }

    const interval = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  const baseAvatarUrl = "https://avatar.iran.liara.run/public";

  const matchRequest = {
    userId: 'newUser', // Replace with actual user ID if available
    topics: topics,
    difficulties: difficulties,
    languages: languages,
    requestTime: Date.now(),
    status: 'pending',
  };

  // Send match request when the component is mounted
  useEffect(() => {
    socketService.sendMatchRequest(matchRequest);

    // Set up WebSocket event listeners
    socketService.onMatchResult((result) => {
      setMatchResult(result);
      navigate('/matched');
    });

    socketService.onMatchTimeout(() => {
      console.log("Match timed out");
      navigate('/failed');
    });

    // Clean up socket listeners and cancel request if unmount
    return () => {
      socketService.sendMatchCancel(matchRequest);
    };
  }, [navigate, matchRequest]);

  if (matchingFailed) {
    return <Navigate to="/failed" />;
  }

  return (
    <div className="h-[calc(100vh-65px)] w-full bg-[#1a1a1a] flex flex-col justify-start items-center">
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center gap-5">
        <div className="self-stretch text-center text-white text-3xl font-bold leading-tight">
          Matching you with another user within {time}s...
        </div>
        {
          time < 10 ?
            <div className="self-stretch text-center text-white text-xl font-bold leading-tight">
              Cannot find an exact match, trying partial matches...
            </div>
            : <></>
        }

        {/* Display Selected Topics, Difficulties, and Languages */}
        <div className="text-white text-lg mt-5">
          <p><strong>Selected Topics:</strong> {topics.join(', ')}</p>
          <p><strong>Selected Difficulties:</strong> {Object.keys(difficulties).filter(key => difficulties[key]).join(', ')}</p>
          <p><strong>Selected Languages:</strong> {languages.join(', ')}</p>
        </div>

        {/* Avatar and Loading */}
        <div className='flex flex-row w-full items-center justify-center gap-14'>
          <img className="w-40 h-40" src={baseAvatarUrl} alt="static avatar" />
          <LoadingDots />
          <AvatarDisplay baseUrl={baseAvatarUrl} />
        </div>

        {/* Cancel Button */}
        <Link to="/language">
          <button className="btn btn-secondary" onClick={() => socketService.sendMatchCancel(matchRequest)}>
            Cancel
          </button>
        </Link>
      </main>
    </div>
  );
}

export default MatchingPage;
