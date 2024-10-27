"use client"

import React from 'react';
import CollaborativeCodingPage from './components/CollaborativeSpace';

const CodingPage: React.FC = () => {
  const initialCode = `function helloWorld() {
  console.log('Hello, world!');
}
helloWorld();`;

  const roomId = 'my-unique-room-id'; // Generate or obtain dynamically
  const userName = 'Alice'; // Replace with the actual user name

  return (
    <CollaborativeCodingPage
      initialCode={initialCode}
      language="javascript"
      theme="vs-dark"
      roomId={roomId}
      userName={userName}
    />
  );
};

export default CodingPage;