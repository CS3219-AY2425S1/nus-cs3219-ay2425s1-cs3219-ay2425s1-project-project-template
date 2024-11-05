import React, { useState, useRef, useEffect } from "react";

export default function ChatBox({ messages, sendMessage, problem }) {
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    
    // Add user message to chat history
    const userMessage = {
      text: newMessage,
      sender: "me",
      timestamp: new Date().toISOString()
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:3007/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: newMessage,
          context: problem?.description || ''
        })
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      // Add AI response to chat history
      const aiMessage = {
        text: data.response,
        sender: "ai",
        timestamp: new Date().toISOString()
      };
      
      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI response error:', error);
      // Add error message to chat history
      const errorMessage = {
        text: 'Sorry, I encountered an error. Please try again.',
        sender: "ai",
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setNewMessage("");
    }
  };

  return (
    <div className="mb-8">
      <div className="text-L font-bold text-[#bcfe4d] mb-2">CHAT</div>
      <div className="bg-[#1e1e1e] rounded p-4 h-[300px] flex flex-col">
        <div className="flex-1 overflow-auto mb-4">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 px-4 py-2 rounded-lg ${
                msg.sender === "me"
                  ? "bg-[#bcfe4d] text-black ml-auto"
                  : "bg-[#DDDDDD] text-black"
              } max-w-[80%] break-words`}
            >
              {msg.text}
            </div>
          ))}
          {isLoading && (
            <div className="bg-[#DDDDDD] text-black px-4 py-2 rounded-lg max-w-[80%]">
              AI is thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            className="flex-1 bg-[#333333] text-white px-4 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-[#bcfe4d]"
            placeholder="Please type here..."
            disabled={isLoading}
          />
          <p className="text-sm text-gray-400">
            Start your message with "hi ai" for AI assistance...
          </p>
          <button
            onClick={handleSend}
            className={`px-4 py-2 rounded-full text-sm text-black ${
              isLoading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-[#bcfe4d] hover:bg-[#a6e636]"
            } transition-colors`}
            disabled={isLoading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
