import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../styles/Collaboration.css';
import SharedSpace from '../components/SharedSpace';
import AIChatbot from '../components/AIChatbot';

//const socket = io('http://localhost:3002'); // replace with your server URL

export const Collaboration = () => {
    const [chatMessages, setChatMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
/*
    // Sync chat
    useEffect(() => {
        socket.on('chatMessage', (message) => {
            setChatMessages((prevMessages) => [...prevMessages, {text: message, isSent: false}]);
        });
        return () => socket.off('chatMessage');
    }, []);

    const handleSendMessage = () => {
        if (currentMessage.trim()) {
            const newMessage = { text: currentMessage, isSent: true };
            socket.emit('chatMessage', newMessage);
            setChatMessages((prevMessages) => [...prevMessages, newMessage]);
            setCurrentMessage('');
        }
    };
*/
    const handleLeaveButtonClick = () => {
       setShowModal(true);
    }

    const confirmLeave = () => {
        setShowModal(false);
        navigate('/home');
    }

    const cancelLeave = () => {
        setShowModal(false);
    }
 /*
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    };
    */

    return (
        <div className="collaboration-container">
          <div className="question-and-whiteboard">
            <h2 className="subheading">Question</h2>
            <div className="question">
              <h3>Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0. A subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.For example, "ace" is a subsequence of "abcde". A common subsequence of two strings is a subsequence that is common to both strings. </h3>
            </div>
            <div className="whiteboard">
                <SharedSpace />
            </div>
            <div className="ai-chatbot-container">
                <AIChatbot />
            </div>
          </div>
          <div className="chat-box-and-button">
            <h2>Topic:</h2>
            <h2>Difficulty:</h2>
            <div className="chat-box">
                <h3>Chat</h3>
                <div className="chat-messages">
                    {chatMessages.map((msg, index) => (
                        <p key={index} className={`message ${msg.isSent ? 'sent' : 'received'}`}>
                            {msg.text}
                        </p>
                    ))}
                </div>
                <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}

                    placeholder="Type a message..."
                />
                <button className="send-button">Send</button>
            </div>
            
            <div className="leave-container">
                <button className="leave-button" onClick={handleLeaveButtonClick}>
                  Leave
                </button>
                {/*Confirmation Modal*/}
                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <button onClick={confirmLeave} className="confirm-button">
                                Leave Now
                            </button>
                            <button onClick={cancelLeave} className="cancel-button">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

            </div>
          </div>
        </div>
    );
};
