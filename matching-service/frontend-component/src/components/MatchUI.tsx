import { useState } from "react";
import StartSession from "./StartSession";
import MatchmakingInProgress from "./MatchmakingInProgress";
import MatchFound from "./MatchFound";

interface MatchUIProps {
  onClose: () => void;
}

enum UIState {
  StartSession = "StartSession",
  Matchmaking = "Matchmaking",
  MatchFound = "MatchFound",
}

const MatchUI = ({ onClose }: MatchUIProps) => {
  const [isMatchUIVisible, setIsMatchUIVisible] = useState<boolean>(true);
  const [uiState, setUiState] = useState<UIState>(UIState.StartSession);
  const [matchmakingTime, setMatchmakingTime] = useState<number>(0);

  const startMatchmaking = (difficulty: string, topic: string) => {
    console.log(
      `Matchmaking started with difficulty: ${difficulty}, topic: ${topic}`
    );
    setUiState(UIState.Matchmaking);

    // Simulate matchmaking progress
    let time = 0;
    const interval = setInterval(() => {
      setMatchmakingTime(time);
      time += 10;
      if (time >= 100) {
        clearInterval(interval);
        setUiState(UIState.MatchFound);
      }
    }, 1000);
  };

  const stopMatchmaking = () => {
    console.log("Matchmaking stopped");
    setUiState(UIState.StartSession);
  };

  const confirmMatch = () => {
    console.log("Match confirmed");
    // Handle match confirmation (e.g., redirect to the coding session)
    setUiState(UIState.StartSession); // Reset for now
  };

  const closeModal = () => {
    console.log("Closing modal");
    setIsMatchUIVisible(false);
    setUiState(UIState.StartSession);
    onClose();
  };

  return (
    <>
      {isMatchUIVisible && (
        <>
          <StartSession
            onContinue={startMatchmaking}
            onClose={closeModal}
            isOpen={uiState === UIState.StartSession}
          />
          <MatchmakingInProgress
            onStop={stopMatchmaking}
            matchmakingTime={matchmakingTime}
            onClose={closeModal}
            isOpen={uiState === UIState.Matchmaking}
          />
          <MatchFound
            onConfirm={confirmMatch}
            onClose={closeModal}
            isOpen={uiState === UIState.MatchFound}
          />
        </>
      )}
    </>
  );
};

export default MatchUI;
