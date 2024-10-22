import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import PeerPrep from "./PeerPrep";
import CodeEditor from "../components/CodeEditor";
import ChatBox from "../components/ChatBox";
import Problems from "../components/Problems";

export default function CollaborationService() {
  const location = useLocation();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Python");
  const [messages, setMessages] = useState([]);
  const [problem, setProblem] = useState({
    title: "Binary Search",
    difficulty: "Medium",
    tags: ["Array", "Binary Search"],
    description:
      "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.",
    examples: [
      {
        input: "nums = [-1,0,3,5,9,12], target = 9",
        output: "4",
        explanation: "9 exists in nums and its index is 4",
      },
      {
        input: "nums = [-1,0,3,5,9,12], target = 2",
        output: "-1",
        explanation: "2 does not exist in nums so return -1",
      },
    ],
  });

  const sendMessage = (text) => {
    setMessages([...messages, { sender: "me", text }]);
  };

  return (
    <PeerPrep>
      <main className="flex-1 overflow-auto p-4">
        <div className="flex gap-6"> {/* Updated to make the div a flex container and add gap */}
          <Problems problem={problem} />
          <CodeEditor
            code={code}
            setCode={setCode}
            language={language}
            setLanguage={setLanguage}
          />
          <ChatBox messages={messages} sendMessage={sendMessage} />
        </div>
        
      </main>
    </PeerPrep>
  );  
}