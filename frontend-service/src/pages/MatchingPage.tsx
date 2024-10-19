import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MatchMe from "../../components/matchmaking/MatchMe";
import Countdown from "../../components/matchmaking/Countdown";
import MatchUnsuccess from "../../components/matchmaking/MatchUnsuccess";
import MatchSuccess from "../../components/matchmaking/MatchSuccess";

// Define constants for match stages
const STAGE = {
  MATCHME: "matchme",
  COUNTDOWN: "countdown",
  SUCCESS: "success",
  UNSUCCESSFUL: "unsuccessful",
};

const MatchingPage: React.FC = () => {
  const [stage, setStage] = useState(STAGE.MATCHME);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  // Helper function to handle fetch requests with error handling
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Request failed:", error);
      throw error;
    }
  };

  // Trigger handlers according to match status in server
  const checkMatchStatus = async () => {
    // setLoading(true); // Indicate loading
    try {
      const result = await fetchWithAuth("http://localhost:3002/match-status");
      const matchStatus = result.matchStatus;
      console.log(matchStatus);
      handleMatchStatusReceived(matchStatus);
    } catch {
      console.error("Failed to check match status.");
    } finally {
      // setLoading(false); // Remove loading
    }
  };

  const handleMatchStatusReceived = (matchStatus: string) => {
    if (matchStatus == "isNotMatching") {
      setStage(STAGE.MATCHME);
    } else if (matchStatus == "isMatching") {
      setStage(STAGE.COUNTDOWN);
    } else if (matchStatus == "isMatched") {
      handleMatchFound();
    } else if (matchStatus == "unsuccessful") {
      handleMatchUnsuccess();
    }
  };

  // Simply send a find match request to be put in the queue
  const handleMatchMe = async () => {
    setStage(STAGE.COUNTDOWN);
    try {
      await fetchWithAuth("http://localhost:3002/find-match", {
        method: "POST",
        body: JSON.stringify({ topic: selectedTopic, difficulty: selectedDifficulty }),
      });
    } catch (error) {
      console.error("Failed to find match: ", error);
    }
  };

  const handleMatchFound = () => {
    setStage(STAGE.SUCCESS);
  };

  const handleMatchUnsuccess = () => {
    setStage(STAGE.UNSUCCESSFUL);
  };

  const handleRetry = async () => {
    // setStage(STAGE.COUNTDOWN);
    try {
      await fetchWithAuth("http://localhost:3002/reset-status", { method: "POST" });
    } catch (error) {
      console.error("Failed to reset status: ", error);
    }
    setStage(STAGE.MATCHME);
  };

  const handleCancel = async () => {
    // try {
    //   await fetchWithAuth("http://localhost:3002/cancel-matching", { method: "POST" });
    // } catch (error) {
    //   console.error("Failed to cancel matching.");
    // }
    setStage(STAGE.MATCHME);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  // Ensure that when the page is loaded/reloaded, the stage state is always
  // correct with respect to the actual user's match state in backend.
  useEffect(() => {
    checkMatchStatus();
    const interval = setInterval(() => {
      checkMatchStatus();
    }, 2000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>} {/* Show loading message */}
      
      {stage === STAGE.MATCHME && (
        <MatchMe
          onMatchMe={handleMatchMe}
          selectedTopic={selectedTopic}
          updateSelectedTopic={setSelectedTopic}
          selectedDifficulty={selectedDifficulty}
          updateSelectedDifficulty={setSelectedDifficulty}
        />
      )}

      {stage === STAGE.COUNTDOWN && (
        <Countdown
          onSuccess={handleMatchFound}
          onFailure={handleMatchUnsuccess}
          onCancel={handleCancel}
        />
      )}

      {stage === STAGE.UNSUCCESSFUL && (
        <MatchUnsuccess
          onRetry={handleRetry}
          onBackToDashboard={handleBackToDashboard}
        />
      )}

      {stage === STAGE.SUCCESS && <MatchSuccess />}
    </div>
  );
};

export default MatchingPage;
