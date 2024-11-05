import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/MatchPopup.css';
import questionService from '../../services/question-service';
import useAuth from '../../hooks/useAuth';

const generateRoomId = (difficulty, topic, language, matchedUser) => {
  const { user1, user2 } = matchedUser;
  const timestamp = new Date().getDate();
  const data = `${difficulty}-${topic}-${language}-${user1}-${user2}-${timestamp}`;
  const roomId = btoa(data); // encode using base64
  return roomId;
};

const MatchFound = ({ matchData, closePopup }) => {
    const { cookies } = useAuth();
    const navigate = useNavigate();
    const { difficulty, topic, language, matchedUser } = matchData;
    const roomId = generateRoomId(difficulty, topic, language, matchedUser);

    const handleStartSession = async () => {
        closePopup();

        try {
          const question = await questionService.getQuestionByTopicAndDifficulty(topic, difficulty, roomId, cookies);

          if (question) {
            console.log(question.title);
            navigate('/collab', {
              state: {
                question,
                language,
                matchedUser,
                roomId
              }
            });
          } else {
            console.error('Error fetching question');
          }
        } catch (error) {
          console.error('Error fetching question:', error);
        }
    }

    return (
      <div className="overlay">
        <dialog open className="dialog-popup">
          <div className="popup-content">
            <h3>Match found!</h3>
            <p>Succesful match between {matchedUser.user1} and {matchedUser.user2}!</p>
            <button onClick={handleStartSession}>Start Session</button>
          </div>
        </dialog>
      </div>
    );
  };

export default MatchFound;
