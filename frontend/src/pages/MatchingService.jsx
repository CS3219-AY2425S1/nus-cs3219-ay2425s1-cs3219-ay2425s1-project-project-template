import React, { useState } from 'react';
import TopicSelect from '../components/TopicSelect';
import LevelSelect from '../components/LevelSelect';
import WaitTimeSelect from '../components/WaitTimeSelect';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function MatchingService() {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedWaitTime, setSelectedWaitTime] = useState("");

  const topics = [
    "Data Structures", "Array", "Hash Table", "String", "Depth-First Search", 
    "Breadth-First Search", "Bit Manipulation", "Tree", "Database", "Matrix",
    "Simulation", "Enumeration", "Backtracking", "Prefix Sum", 
    "Sliding Window", "Linked List", "Binary Search", "Sorting"
  ];

  const levels = ["Easy", "Medium", "Hard"];
  const waitTimes = ["30s", "1 minute", "2 minutes", "5 minutes", ">5 minutes"];

  return (
    <div className="p-6">
      <Header />
      <div className="flex gap-6">
        <Sidebar />
        <div className="flex-1 p-6 bg-[#111111] rounded-lg border border-[#333333]">
          <TopicSelect 
            topics={topics}
            selectedTopics={selectedTopics}
            setSelectedTopics={setSelectedTopics}
          />
        </div>
        <div className="flex-1 p-6 bg-[#111111] rounded-lg border border-[#333333]">
          <LevelSelect
            levels={levels}
            selectedLevel={selectedLevel}
            setSelectedLevel={setSelectedLevel}
          />
          <WaitTimeSelect 
            waitTimes={waitTimes}
            selectedWaitTime={selectedWaitTime}
            setSelectedWaitTime={setSelectedWaitTime}
          />
        </div>
      </div>

      <button className="mt-6 float-right bg-[#bcfe4d] text-black px-6 py-2 rounded-full font-bold hover:bg-[#a6e636] transition-colors">
        START
      </button>
    </div>
  );
}