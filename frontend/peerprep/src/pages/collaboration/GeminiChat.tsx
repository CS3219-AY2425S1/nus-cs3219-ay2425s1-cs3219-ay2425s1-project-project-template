import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { type Socket } from "socket.io-client";


const GeminiChat: React.FC<{ socket: Socket, doc: string }> = ({ socket, doc }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ user: string, ai: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [includeDoc, setIncludeDoc] = useState(true); // New state for toggling doc inclusion
   
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
   
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };


    const handleSend = async () => {
        if (!input.trim()) return;
       
        setMessages(prev => [...prev, { user: input, ai: "" }]);
        setLoading(true);


        try {
            const combinedInput = includeDoc ? `${doc}\n${input}` : input;
            const result = await model.generateContent(combinedInput);
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


    const toggleDoc = () => {
        setIncludeDoc(prev => !prev); // Toggle doc inclusion state
    };


    return (
        <div style={styles.chatBoxContainer}>
            <div style={styles.messagesContainer}>
                {messages.map((msg, index) => (
                    <div key={index} style={styles.messageContainer}>
                        <div style={styles.userMessage}><strong>You:</strong> {msg.user}</div>
                        {msg.ai && <div style={styles.aiMessage}><strong>AI:</strong> {msg.ai}</div>}
                    </div>
                ))}
                {loading && <div style={styles.loadingMessage}>Loading...</div>}
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
                <button onClick={toggleDoc} style={{ ...styles.toggleDocButton, backgroundColor: includeDoc ? '#28a745' : '#007bff' }}>
                    {includeDoc ? 'Code Included' : 'Code Excluded'}
                </button>
            </div>
        </div>
    );
};

const styles = {
    chatBoxContainer: {
        display: "flex",
        flexDirection: "column" as const,
        backgroundColor: "#2e2e3e",
        borderRadius: "8px",
        padding: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        width: "100%", // Full width
        height: "50vh", // Fixed height to ensure it's not cut off vertically (or use 100% if parent has height)
        color: "#ffffff",
    },
    messagesContainer: {
        flex: 1,
        overflowY: "auto" as const,
        padding: "10px",
        backgroundColor: "#1e1e2e",
        borderRadius: "8px",
        maxHeight: "400px", // Increased height or can be auto
        marginBottom: "10px",
    },
    messageContainer: {
        marginBottom: "15px",
    },
    userMessage: {
        alignSelf: "flex-end",
        backgroundColor: "#4e8ef7",
        color: "#ffffff",
        padding: "6px 10px",
        borderRadius: "10px",
        maxWidth: "75%",
        fontSize: "0.9rem",
    },
    aiMessage: {
        alignSelf: "flex-start",
        backgroundColor: "#44475a",
        color: "#ffffff",
        padding: "6px 10px",
        borderRadius: "10px",
        maxWidth: "75%",
        fontSize: "0.9rem",
        marginTop: "5px",
    },
    loadingMessage: {
        textAlign: "center" as const,
        color: "#b3b3b3",
        fontStyle: "italic",
    },
    inputContainer: {
        height: "36px",
        display: "flex",
        marginTop: "5px",
    },
    input: {
        flex: 1,
        height: "36px",
        padding: "6px",
        fontSize: "0.85rem",
        borderRadius: "6px",
        border: "1px solid #444",
        backgroundColor: "#1e1e2e",
        color: "#ffffff",
        marginRight: "5px",
        boxSizing: "border-box" as const,
    },
    sendButton: {
        height: "36px",
        padding: "6px 12px",
        fontSize: "0.85rem",
        borderRadius: "6px",
        border: "none",
        backgroundColor: "#9A78B3",
        color: "#ffffff",
        cursor: "pointer",
        boxSizing: "border-box" as const,
    },
    toggleDocButton: {
        padding: "8px",
        backgroundColor: "#3e3e4e",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        marginLeft: "10px",
        fontSize: "0.9rem",
        transition: "background-color 0.3s ease",
    },

};

export default GeminiChat;
