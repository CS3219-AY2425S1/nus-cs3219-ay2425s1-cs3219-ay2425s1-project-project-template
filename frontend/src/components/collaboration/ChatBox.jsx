import React, { useState, useEffect, useRef } from "react";

const ChatBox = ({ socket, roomId, username }) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const chatEndRef = useRef(null);

    // Scroll to the bottom of the chat on new messages
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Listen for incoming messages from the server
    useEffect(() => {
        if (!socket) return;
        
        socket.on("chat-message", (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        socket.on("chat-history", (history) => {
            setMessages(history);
        });

        return () => {
            socket.off("chat-message");
            socket.off("chat-history");
        };
    }, [socket]);

    const sendMessage = () => {
        if (message.trim()) {
            // Send message to the server
            const formattedMessage = `${username}: ${message}`;
            socket.emit("chat-message", formattedMessage);
            setMessage("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", borderLeft: "1px solid #ddd", padding: "10px" }}>
            <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <div style={{ display: "flex", padding: "10px 0" }}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    style={{ flex: 1, padding: "10px", fontSize: "14px" }}
                />
                <button onClick={sendMessage} style={{ marginLeft: "10px", padding: "10px" }}>Send</button>
            </div>
        </div>
    );
};

export default ChatBox;
