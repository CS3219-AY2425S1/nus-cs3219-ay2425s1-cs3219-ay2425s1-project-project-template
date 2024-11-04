import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/MatchPopup.css';
import questionService from '../../services/question-service';
import useAuth from '../../hooks/useAuth';


const MatchFound = ({ matchData, closePopup }) => {
    const { cookies } = useAuth();
    const navigate = useNavigate();
    const { matchedUser, difficulty, topic, language, roomId } = matchData;

    const handleStartSession = async () => {
        closePopup();

        try {
          const question = await questionService.getQuestionByTopicAndDifficulty(topic, difficulty, cookies);

          if (question) {
            console.log(question.title);
            navigate('/collab', {
              state: {
                question: question,
                language: language,
                matchedUser: matchedUser,
                roomId: roomId
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
