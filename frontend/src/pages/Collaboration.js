import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../styles/Collaboration.css';
import SharedSpace from '../components/SharedSpace';
import AIChatbot from '../components/AIChatbot';
import axios from "axios";
import { QUESTIONS_SERVICE } from "../Services";

const socket = io('http://localhost:5002');


export const Collaboration = () => {
    const currentUsername = localStorage.getItem("username");
    const partnerUsername = sessionStorage.getItem("partner");
    const [chat, setChat] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [title, setTitle] = useState('-')
    const titleRef = useRef(title);
    const [question, setQuestion] = useState('No questions found');
    const questionRef = useRef(question);
    const [showModal, setShowModal] = useState(false);
    const [roomName, setRoomName] = useState("");
    const navigate = useNavigate();
    const topic = sessionStorage.getItem("match_topic") ?? 'NA';
    const difficulty = sessionStorage.getItem("match_difficulty") ?? 'NA';
    const sharedSpaceRef = useRef();


    const getQuestionData = async () => {
        try {
          const response = await axios.get(`${QUESTIONS_SERVICE}/questions/${topic}/${difficulty}`);
          console.log("response in getQuestionData: ", response);
          setTitle(response.data.title);
          setQuestion(response.data.description);
        } catch (error) {
            if (error.status === 404 || error.status === 500) {
                console.log("Response 404 || 500", error);
                setTitle("No questions found");
                setQuestion("No questions were found matching your requested topic and difficulty. But this room is still open for collaboration if you wish to discuss anything!\nYou may also leave the room by clicking the 'Leave' button below and try out a different topic or difficulty level. Thank you for using PeerPrep!");
            } else {
                console.log(error);
                navigate("/*");
            }
        }
    }

    useEffect(()=> {
        console.log("useEffect running");
        getQuestionData();
    }, []);

    useEffect(() => {
        titleRef.current = title;
    }, [title]);

    useEffect(() => {
        questionRef.current = question;
    }, [question]);

    // Sync chat
    useEffect(() => {
        
        // Join the room with partner
        const newRoom = [currentUsername, partnerUsername].sort().join('-');
        setRoomName(newRoom);
        socket.emit("joinRoom", newRoom);
        console.log(`Joined room: ${newRoom}`);

        socket.on('receiveMessage', (messageData) => {
            if (messageData.currentUsername === currentUsername) {
                console.log("Message sent by current user");
            } else {
                setChat((prevChat) => [...prevChat, messageData]);
                console.log(`User ${currentUsername} received message: ${messageData} from user ${messageData.currentUsername}`);
            }
          });

        socket.on('leave', (message) => {
            saveData().then((result) => {
            navigate('/home');
            alert(message);
            }).catch(error => {
                console.log("error occured while saving data");
            })
        });

        return () => {
            socket.off('receiveMessage');
            socket.off('leave');
        }
    }, []);

    useEffect(() => {
        console.log("Chat updated:", chat);
    }, [chat]);

    const handleSendMessage = () => {
        const messageData = { roomName, currentUsername, currentMessage };
        socket.emit('sendMessage', messageData);
        setChat((prevChat) => [...prevChat, messageData]);
        setCurrentMessage('');

    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    };

    const saveData = async () => {
        try {
            const sharedSpaceState = sharedSpaceRef.current.getSharedSpaceState();
            const response = await axios.post("http://localhost:5002/saveAttempt", {
                username: localStorage.getItem("username"),
                attempts: [{title: titleRef.current, code: sharedSpaceState.code, text: sharedSpaceState.text1,
                    language: sharedSpaceState.language, partner_username: sessionStorage.getItem("partner"),
                    question: questionRef.current
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
        saveData().then((result) => {
            navigate('/home');
        }).catch(error => {
            console.log("Error with saving!");
        });
    }

    const cancelLeave = () => {
        setShowModal(false);
    }

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
                <h3>Chat with {partnerUsername}</h3>
                <div className="chat-messages">
                    {chat.map((msg, index) => (
                        <p key={index} className={`message ${(msg.currentUsername === currentUsername) ? 'sent' : 'received'}`}>
                            {msg.currentMessage}
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