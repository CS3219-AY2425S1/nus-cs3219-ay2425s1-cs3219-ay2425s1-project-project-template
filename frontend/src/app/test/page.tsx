'use client'

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3232');

const MatchComponent = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [matchResult, setMatchResult] = useState(null);

  useEffect(() => {
    socket.on('matchResult', (result) => {
      console.log('Match Result:', result);
      setMatchResult(result);
    });

    return () => {
      socket.off('matchResult');
    };
  }, []);

  const handleMatchRequest = () => {
    const matchRequest = {
      topic,
      difficulty,
      clientId: socket.id,
    };

    socket.emit('initMatch', matchRequest);
    console.log('Match Request Sent:', matchRequest);
  };

  return (
    <div>
      <h1>Match Component</h1>
      <input
        type="text"
        placeholder="Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <input
        type="text"
        placeholder="Difficulty"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      />
      <button onClick={handleMatchRequest}>Send Match Request</button>
      {matchResult && (
        <div>
          <h2>Match Result:</h2>
          <pre>{JSON.stringify(matchResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default MatchComponent;
