import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MatchMe from "../../components/matchmaking/MatchMe";
import Countdown from "../../components/matchmaking/Countdown";
import MatchUnsuccess from "../../components/matchmaking/MatchUnsuccess";
import MatchSuccess from "../../components/matchmaking/MatchSuccess";

const MatchingPage: React.FC = () => {
  const [stage, setStage] = useState("matchme");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const navigate = useNavigate();

  const handleMatchMe = () => {
    // TODO: Make a long-poll API request to `matching-service`
    const getMatchLongPoll = () => {
      fetch("http://localhost:3002/find-match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(
          {
            topic: selectedTopic,
            difficulty: selectedDifficulty
          }
        )
      })
      .then(response => response.json())
      .then(data => {console.log("matching-service response: ", data)})
      .catch(err => {console.error(err)});
    };
    getMatchLongPoll();
    setStage("countdown");
  };

  const handleMatchFound = () => {
    setStage("success");
  };

  const handleMatchUnsuccess = () => {
    setStage("unsuccessful");
  };

  const handleRetry = () => {
    setStage("countdown");
  };

  const handleCancel = () => {
    setStage("matchme");
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleMatchStatusReceived = (matchStatus:string) => {
    if (matchStatus == "isNotMatching") {
      handleCancel();
    } else if (matchStatus == "isMatching") {
      handleMatchMe();
    } else if (matchStatus == "isMatched") {
      handleMatchFound();
    } else {
      handleCancel();
    }
  };

  // Ensure that when the page is loaded/reloaded, the stage state is always
  // correct with respect to the actual user's match state in backend.
  useEffect(() => {
    const fetchMatchStatus = async () => {
      const response = await fetch("http://localhost:3002/match-status");
      const result = await response.json();
      const matchStatus = result["matchStatus"];
      handleMatchStatusReceived(matchStatus);
    };
    fetchMatchStatus();
  }, []);

  return (
    <div>
      {stage === "matchme" &&
        <MatchMe
          onMatchMe={handleMatchMe}
          selectedTopic={selectedTopic}
          updateSelectedTopic={setSelectedTopic}
          selectedDifficulty={selectedDifficulty}
          updateSelectedDifficulty={setSelectedDifficulty}
        />
      }
      {stage === "countdown" && (
        <Countdown
          onSuccess={handleMatchFound}
          onFailure={handleMatchUnsuccess}
          onCancel={handleCancel}
        />
      )}
      {stage === "unsuccessful" && (
        <MatchUnsuccess
          onRetry={handleRetry}
          onBackToDashboard={handleBackToDashboard}
        />
      )}
      {stage === "success" && <MatchSuccess />}
    </div>
  );
};

export default MatchingPage;
