import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { io } from 'socket.io-client';
import '../styles/Collaboration.css';
import SharedSpace from '../components/SharedSpace';
import AIChatbot from '../components/AIChatbot';
import axios from "axios";
import { QUESTIONS_SERVICE } from "../Services";

const socket = io('http://localhost:5002');


export const Collaboration = () => {
    const [chatMessages, setChatMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [title, setTitle] = useState('-')
    const [question, setQuestion] = useState('No questions found');
    const [showModal, setShowModal] = useState(false);
    const [roomName, setRoomName] = useState("");
    const navigate = useNavigate();
    const topic = sessionStorage.getItem("match_topic") ?? 'Bit Manipulation';
    const difficulty = sessionStorage.getItem("match_difficulty") ?? 'Medium';


    const getQuestionData = async () => {
        try {
          const response = await axios.get(`${QUESTIONS_SERVICE}/questions/${topic}/${difficulty}`);
          if (response.status === 404 || response.status === 500) {
            //404 not found
            console.log("Response 404 || 500");
            navigate("/*");
          }
          setTitle(response.data.title);
          setQuestion(response.data.description);
        } catch (error) {
            console.log(error);
            navigate("/*");
        }
    }

    useEffect(()=> {
        console.log("useEffect running");
        getQuestionData();
    })

    const sharedSpaceRef = useRef();

    // Sync chat
    useEffect(() => {
        /**
        socket.on('chatMessage', (message) => {
            setChatMessages((prevMessages) => [...prevMessages, {text: message, isSent: false}]);
        });
        */
        
        // Join the room with partner
        const newRoom = [localStorage.getItem("username"), sessionStorage.getItem("partner")].sort().join('-');
        setRoomName(newRoom);
        socket.emit("joinRoom", newRoom);
        console.log(`Joined room: ${newRoom}`);

        socket.on('leave', (message) => {
            saveData();
            navigate('/home');
            alert(message);
        });

        return () => {
            //socket.off('chatMessage');
            socket.off('leave');
        }
    }, []);

    /**
    const handleSendMessage = () => {
        if (currentMessage.trim()) {
            const newMessage = { text: currentMessage, isSent: true };
            socket.emit('chatMessage', newMessage);
            setChatMessages((prevMessages) => [...prevMessages, newMessage]);
            setCurrentMessage('');
        }
    };
    */

    const saveData = async () => {
        try {
            const sharedSpaceState = sharedSpaceRef.current.getSharedSpaceState();
            const response = await axios.post("http://localhost:5002/saveAttempt", {
                username: localStorage.getItem("username"),
                attempts: [{question_id: 1, code: sharedSpaceState.code, text: sharedSpaceState.text1,
                    language: sharedSpaceState.language, partner_username: sessionStorage.getItem("partner")
                }]
            });
            console.log(response);
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    }

    const handleLeaveButtonClick = () => {
       setShowModal(true);
    }

    const confirmLeave = () => {
        socket.emit('leave', roomName);
        saveData();
        navigate('/home');
    }

    const cancelLeave = () => {
        setShowModal(false);
    }
    
    /**
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
            <div className="question-box">
                <h3 className='questionTitle'>{title}</h3>
              <h3 className='questionText'>{question}</h3>
            </div>
            <div className="whiteboard">
                <SharedSpace ref={sharedSpaceRef} />
            </div>
            <div className="ai-chatbot-container">
                <AIChatbot />
            </div>
          </div>
          <div className="chat-box-and-button">
            <h2>Topic: {topic}</h2>
            <h2>Difficulty: {difficulty}</h2>
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
