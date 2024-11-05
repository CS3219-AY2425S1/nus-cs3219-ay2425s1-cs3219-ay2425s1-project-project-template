import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
//import dotenv from 'dotenv';

const GeminiChat: React.FC<{ socketRef: React.RefObject<any> }> = ({ socketRef }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ user: string, ai: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false); // New state for collapsed state
    
    // dotenv.config();
    // const apiKey = process.env.API_KEY;
    // console.log("Loaded API Key:", apiKey);
    // const genAI = new GoogleGenerativeAI(apiKey as string);
    const genAI = new GoogleGenerativeAI("AIzaSyCAiYFWcbjQNYWtytkhleSq7ys13j8qKmM"); // for now because it can't read properly from .env
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        
        setMessages(prev => [...prev, { user: input, ai: "" }]);
        setLoading(true);

        try {
            const result = await model.generateContent(input);
            const aiResponse = result.response.text();
            
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].ai = aiResponse;
                return newMessages;
            });
        } catch (error) {
            console.error("Error generating AI response:", error);
        } finally {
            setLoading(false);
            setInput('');
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSend();
        }
    };

    const toggleCollapse = () => {
        setIsCollapsed(prev => !prev); // Toggle collapsed state
    };

    return (
        <div style={{ ...styles.chatContainer, height: isCollapsed ? '40px' : 'auto' }}>
            <button onClick={toggleCollapse} style={styles.toggleButton}>
                {isCollapsed ? 'Expand Chat' : 'Collapse Chat'}
            </button>
            {!isCollapsed && (
                <>
                    <div style={styles.messages}>
                        {messages.map((msg, index) => (
                            <div key={index} style={styles.message}>
                                <strong>You:</strong> {msg.user}
                                <br />
                                <strong>AI:</strong> {msg.ai}
                            </div>
                        ))}
                        {loading && <div>Loading...</div>}
                    </div>
                    <div style={styles.inputContainer}>
                        <input
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            style={styles.input}
                            placeholder="Type your message..."
                        />
                        <button onClick={handleSend} style={styles.sendButton}>Send</button>
                    </div>
                </>
            )}
        </div>
    );
};

const styles = {
    chatContainer: {
        flex: "1 0 auto",
        backgroundColor: "#2e2e3e",
        borderRadius: "8px",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        overflowY: "hidden", // Change overflow to hidden to avoid scrollbars when collapsed
        transition: 'height 0.3s ease', // Smooth transition for height change
    },
    toggleButton: {
        padding: "8px 12px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        marginBottom: "10px",
    },
    messages: {
        flex: 1,
        overflowY: "auto",
        color: "#ffffff",
        maxHeight: '300px',
    },
    message: {
        marginBottom: "10px",
    },
    inputContainer: {
        display: "flex",
    },
    input: {
        flex: 1,
        padding: "10px",
        borderRadius: "5px",
        backgroundColor: "#333",
        border: "1px solid #444",
        color: "#ffffff",
        marginRight: "5px",
    },
    sendButton: {
        padding: "8px 12px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
};

export default GeminiChat;
