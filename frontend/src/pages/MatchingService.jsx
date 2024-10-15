import React, { useState, useEffect, useContext } from 'react';
import matchingService from '../services/MatchingService';
import TopicSelect from '../components/TopicSelect';
import LevelSelect from '../components/LevelSelect';
import WaitTimeSelect from '../components/WaitTimeSelect';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import PeerPrep from "./PeerPrep";
// import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MatchingServicePage() {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedWaitTime, setSelectedWaitTime] = useState("");
  const [message, setMessage] = useState("");
  // const { token } = useContext(AuthContext); 
  const token = null;
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  const topics = [
    "Data Structures",
    "Array",
    "Hash Table",
    "String",
    "Sorting",
    "Depth-First Search",
    "Breadth-First Search",
    "Bit Manipulation",
    "Tree",
    "Database",
    "Matrix",
    "Simulation",
    "Enumeration",
    "Backtracking",
    "Prefix Sum",
    "Sliding Window",
    "Linked List",
    "Binary Search",
  ];

  const levels = ["Easy", "Medium", "Hard"];
  const waitTimes = ["30s", "1min", "2mins", "5mins"];

  // Function to convert wait time to seconds
  const convertWaitTimeToSeconds = (waitTime) => {
    switch (waitTime) {
      case "30s":
        return 30;
      case "1min":
        return 60;
      case "2mins":
        return 120;
      case "5mins":
        return 300;
      default:
        return 600;
    }
  };

  // // Function to handle to matching
  const handleStartMatching = async() => {
    // Handle matching logic here
    // Check if all required fields are selected
    if (selectedTopics.length === 0) {
      toast.error("Please select at least one topic");
      return;
    }
    if (!selectedLevel) {
      toast.error("Please select a complexity level");
      return;
    }

    if (!selectedWaitTime) {
      toast.error("Please select a wait time");
      return;
    }

    const topic = selectedTopics.join(",");
    const complexity = `${selectedLevel}`;
    const wait_time = `${selectedWaitTime}`;
    const waitTimeInSeconds = convertWaitTimeToSeconds(selectedWaitTime);

    try {

      // Establish a connection with Matching Service
      await matchingService.connect(token, topic,complexity, wait_time);
      setMessage("Searching for a match...");
      setTimeout(() => {
        navigate("/finding-a-peer", {
          state: {
            selectedTopics,
            selectedLevel,
            waitTimeInSeconds,
          },
        });
      }, waitTimeInSeconds);
      

      // Look for a 'matchfound' event
      matchingService.onMatchFound((roomId) => {
        setMessage(`Match found! Room ID: ${roomId}`);
        // navigate(`/room/${roomId}`); // Navigate to the matched room
      });

      // Listen for 'error' event
      matchingService.onError((err) => {
        console.error('Socket error:', err);
        setMessage("An error occurred. Please try again.");
      });

      // Listen for 'disconnect' event
      matchingService.onDisconnect((reason) => {
        console.log('Disconnected:', reason);
        if (reason === 'io server disconnect') {
          // Attempt to reconnect
          matchingService.connect(token, complexity)
            .then(() => {
              setMessage("Reconnecting...");
            })
            .catch((err) => {
              console.error('Reconnection error:', err);
              setMessage("Failed to reconnect.");
            });
        } else {
          setMessage("Disconnected from server.");
        }
      });
    } catch (err) { 
      console.error('Connected failed:', err);
      setMessage("Failed to connect to the matching service. Please try again.");
    }
  };

  useEffect(() => {
    return () => {
      matchingService.disconnect();
    };
  }, []);



  return (
    <PeerPrep>
      <main className="flex-1 overflow-auto">
        <div className="flex gap-x-4">
          <div className="w-1/2 rounded-lg border border-[#333333] bg-[#111111] p-6">
            <TopicSelect
              topics={topics}
              selectedTopics={selectedTopics}
              setSelectedTopics={setSelectedTopics}
            />
          </div>
          <div className="w-1/2 flex-1 rounded-lg border border-[#333333] bg-[#111111] p-6">
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

        {error && (
          <p className="mt-2 text-red-500">{error}</p> 
        )}

        <button
          onClick={handleStartMatching}
          className="float-right mt-3 rounded-full bg-[#bcfe4d] px-6 py-2 font-bold text-black transition-colors hover:bg-[#a6e636]"
        >
          START MATCHING
        </button>
        {message && (
              <div className="mt-4 text-center text-white">
                {message}
              </div> 
            )}
      </main>
    </PeerPrep>
  ); 
}
