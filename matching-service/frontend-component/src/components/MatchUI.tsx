import { useState } from "react";
import StartSession from "./StartSession";
import MatchFound from "./MatchFound";

interface MatchUIProps {
  onClose: () => void;
}

enum UIState {
  StartSession = "StartSession",
  MatchFound = "MatchFound",
}

const MatchUI = ({ onClose }: MatchUIProps) => {
  const [isMatchUIVisible, setIsMatchUIVisible] = useState<boolean>(true);
  const [uiState, setUiState] = useState<UIState>(UIState.StartSession);

  const matchFound = () => {
    console.log("Match found");
    setUiState(UIState.MatchFound);
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
            handleMatchFound={matchFound}
            onClose={closeModal}
            isOpen={uiState === UIState.StartSession}
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
