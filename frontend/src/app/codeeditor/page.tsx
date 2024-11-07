"use client"

import React from 'react';
import CollaborativeCodingPage from './mock_components/CollaborativeSpace';

const CodingPage: React.FC = () => {
  const initialCode = `function helloWorld() {
  console.log('Hello, world!');
}
helloWorld();`;

  const roomId = 'my-unique-room-id'; // Generate or obtain dynamically
  const userName = 'Alice'; // Replace with the actual user name

  return (
    <div className='w-screen'>
      <CollaborativeCodingPage
        initialCode={initialCode}
        language="javascript"
        theme="vs-dark"
        roomId={roomId}
        userName={userName}
      />
    </div>
  );
};

export default CodingPage;