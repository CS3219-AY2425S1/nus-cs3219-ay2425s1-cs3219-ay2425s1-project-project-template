import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import '../styles/Collaboration.css';

const socket = io('http://localhost:3002'); // replace with your server URL

export const Collaboration = () => {
    const [upperText, setUpperText] = useState('');
    const [codeText, setCodeText] = useState('');
    const [language, setLanguage] = useState('JavaScript');
    const [chatMessages, setChatMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    // Sync upper text
    useEffect(() => {
        socket.on('syncUpperText', (text) => setUpperText(text));
        return () => socket.off('syncUpperText');
    }, []);

    const handleUpperTextChange = (e) => {
        setUpperText(e.target.value);
        socket.emit('syncUpperText', e.target.value);
    };

    const getLanguageExtension = () => {
        switch (language) {
            case 'JavaScript':
                return javascript();
            case 'Python':
                return python();
            case 'C++':
                return cpp();
            case 'Java':
                return java();
            default:
                return javascript();
        }
    }

    // Sync code text
    useEffect(() => {
        socket.on('syncCodeText', (text) => setCodeText(text));
        return () => socket.off('syncCodeText');
    }, []);

    const handleCodeTextChange = (e) => {
        setCodeText(e.target.value);
        socket.emit('syncCodeText', e.target.value);
    };

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
 
    const handleKeyDown = (e) => {
      if (e.key == 'Enter') {
        handleSendMessage();
      }
    };

    return (
        <div className="collaboration-container">
          <div className="question-and-whiteboard">
            <div className="question">
              <h2>Question: </h2>
            </div>
            <div className="whiteboard">
                <div className="text-area">
                    <textarea
                        value={upperText}
                        onChange={handleUpperTextChange}
                        placeholder="Write your notes and solutions here..."
                    />
                </div>
                <div className="code-area">
                    <select className="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
                        <option value="JavaScript">JavaScript</option>
                        <option value="Python">Python</option>
                        <option value="C++">C++</option>
                        <option value="Java">Java</option>
                    </select>
                    <CodeMirror
                        value={codeText}
                        extensions={[getLanguageExtension()]}
                        onChange={handleCodeTextChange}
                        options={{
                            lineNumbers: true,
                        }}
                        placeholder="Write your code here..."
                    />
                </div>
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
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                />
                <button className="send-button" onClick={handleSendMessage}>Send</button>
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
