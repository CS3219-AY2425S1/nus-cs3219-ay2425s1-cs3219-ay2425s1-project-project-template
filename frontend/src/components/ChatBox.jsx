import React from "react";

export default function ChatBox({ messages, sendMessage }) {
  const [newMessage, setNewMessage] = React.useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="mb-8">
      <div className="text-L font-bold text-[#bcfe4d] mb-4">CHAT</div>
      <div className="bg-[#1e1e1e] rounded p-4 h-[300px] flex flex-col">
        <div className="flex-1 overflow-auto mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 px-4 py-2 rounded-full text-sm ${
                msg.sender === "me"
                  ? "bg-[#bcfe4d] text-black ml-auto"
                  : "bg-[#DDDDDD] text-black"
              } max-w-[80%]`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-[#333333] text-white px-4 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-[#bcfe4d]"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 rounded-full text-sm text-black bg-[#bcfe4d] hover:bg-[#a6e636] transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}