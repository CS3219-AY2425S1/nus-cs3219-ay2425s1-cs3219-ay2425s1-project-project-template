import React, { useState } from 'react'
import CodeEditor from '../../components/collab/CodeEditor'

const RoomPage: React.FC = () => {
  const roomId = "3ae88cf5-8458-436f-a72e-be9e011e355e"
  const userId = localStorageStorage.getItem('userId')
  console.log(userId)

  return (
    <div>
      <h1>Room {roomId}</h1>

      {/* Temporary input to simulate user identification */}
      <div>
        <label>
          Enter User ID (e.g., user111 or user222):
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </label>
      </div>

      <CodeEditor roomId={roomId} />

      {/* Display userId for reference */}
      {userId && <p>You are: {userId}</p>}
    </div>
  )
}

export default RoomPage