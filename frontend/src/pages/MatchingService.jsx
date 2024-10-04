import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import TopicSelector from "../components/TopicSelect";
import LevelSelector from "../components/LevelSelect";
import WaitTimeSelector from "../components/WaitTimeSelect";


export default function MatchingService() {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("Hard");
  const [selectedWaitTime, setSelectedWaitTime] = useState("2 minutes");

  const topics = [
    "Data Structures", "Array", "Hash Table", "Depth-First Search", 
    "Breadth-First Search", "Sorting", "Bit Manipulation", "Binary Search",
    "Database", "Backtracking", "Linked List"
  ];

  const levels = ["Easy", "Medium", "Hard"];
  const waitTimes = ["30s", "1 minute", "2 minutes", "5 minutes", "> 5 minutes"];

  const handleStart = () => {
    // Functionality to start matching process
    console.log("Matching with:", selectedTopics, selectedLevel, selectedWaitTime);
  };

  return (
    <div className="matching-service">
      <h1>Matching Service</h1>
      <div className="selectors">
        <TopicSelector 
          topics={topics} 
          selectedTopics={selectedTopics} 
          setSelectedTopics={setSelectedTopics} 
        />
        <LevelSelector 
          levels={levels} 
          selectedLevel={selectedLevel} 
          setSelectedLevel={setSelectedLevel} 
        />
        <WaitTimeSelector 
          waitTimes={waitTimes} 
          selectedWaitTime={selectedWaitTime} 
          setSelectedWaitTime={setSelectedWaitTime} 
        />
      </div>
      <button 
          onClick={handleStart}
          className="mt-4 px-6 py-3 bg-[#bcfe4d] text-black font-bold rounded-full hover:bg-[#a6f243] transition-colors"
        >
          Start
        </button>
    </div>
  );
}
