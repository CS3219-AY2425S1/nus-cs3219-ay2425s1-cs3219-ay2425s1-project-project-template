import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MatchMe from "../../components/matchmaking/MatchMe";
import Countdown from "../../components/matchmaking/Countdown";
import MatchUnsuccess from "../../components/matchmaking/MatchUnsuccess";
import MatchSuccess from "../../components/matchmaking/MatchSuccess";

const MatchingPage: React.FC = () => {
  const [stage, setStage] = useState("matchme");
  const navigate = useNavigate();

  const handleMatchMe = () => {
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

  return (
    <div>
      {stage === "matchme" && <MatchMe onMatchMe={handleMatchMe} />}
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
