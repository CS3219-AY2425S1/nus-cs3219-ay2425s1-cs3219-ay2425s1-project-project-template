import React, { useState, useRef, useEffect } from 'react';
import '../styles/AIChatbot.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import ReactMarkdown from 'react-markdown';


const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const chatBodyRef = useRef(null);

    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    const handleUserMessage = async () => {
        if (!userInput.trim()) return;

        const userMessage = { role: 'user', content: userInput };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setUserInput('');

        // Generate a response
        try {
            console.log("Sending POST request to /chatbot with:", userInput);
            const response = await fetch("http://localhost:5003/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({message: userInput})
            });

            const data = await response.json();
            console.log("Response received:", data);

            if (data.response) {
                setMessages([...newMessages, { role: 'assistant', content: data.response }]);
            }
        } catch (error) {
            console.error("Error communicating with the chatbot backend:", error);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key == 'Enter') {
            event.preventDefault();
            handleUserMessage();
        }
    };

    // Scroll to bottom when the chatbot opens
    useEffect(() => {
        if (isOpen || messages.length) {
            setTimeout(() => {
                if (chatBodyRef.current) {
                    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
                }
            }, 100);
        }
    }, [messages, isOpen]);

    return (
        <div>
            <div className="chatbot-icon" onClick={toggleChatbot}>
                <FontAwesomeIcon icon={faRobot} />
            </div>

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <span>AI Chatbot</span>
                        <button className="close-button" onClick={toggleChatbot}>⏷</button>
                    </div>
                    <div className="chatbot-body" ref={chatBodyRef}>
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={message.role === 'user' ? 'user-message' : 'chatbot-response'}
                            >
                                <ReactMarkdown>{message.content}</ReactMarkdown>
                            </div>
                        ))}
                    </div>
                    <div className="input-and-send-button-container">
                        <div className="chatbot-input-container">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Message me..."
                                className="chatbot-input"
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <button className="chatbot-send-button" onClick={handleUserMessage}>
                            Send
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
};

export default AIChatbot;