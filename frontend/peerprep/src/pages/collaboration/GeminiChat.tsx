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
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY); // for now because it can't read properly from .env
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
        flex: "1",
        backgroundColor: "#1e1e2f", // Slightly darker color for contrast
        borderRadius: "8px",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        overflowY: "hidden",
        transition: "height 0.3s ease",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)", // Added shadow for depth
    },
    toggleButton: {
        padding: "8px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        marginBottom: "10px",
        fontWeight: "bold",
        fontSize: "0.9rem",
        transition: "background-color 0.3s ease",
    },
    messages: {
        flex: 1,
        overflowY: "auto",
        color: "#f5f5f5",
        padding: "10px",
        maxHeight: "300px",
        borderRadius: "5px",
        backgroundColor: "#2b2b3a", // Slightly lighter color for message background
    },
    message: {
        marginBottom: "15px",
        padding: "8px",
        borderRadius: "5px",
        backgroundColor: "#3e3e4e", // Background for individual message blocks
    },
    inputContainer: {
        display: "flex",
        alignItems: "center",
        marginTop: "10px",
    },
    input: {
        flex: 1,
        padding: "10px",
        borderRadius: "5px",
        backgroundColor: "#333",
        border: "1px solid #555",
        color: "#ffffff",
        marginRight: "10px",
        fontSize: "0.95rem",
        outline: "none",
    },
    sendButton: {
        padding: "10px 15px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "0.9rem",
        transition: "background-color 0.3s ease",
    },
};

export default GeminiChat;
