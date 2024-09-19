import React, { useState } from "react";
import MatchUI from "./components/MatchUI";
import { Button } from "@nextui-org/react";

const App: React.FC = () => {
  const [isMatchUIVisible, setIsMatchUIVisible] = useState<boolean>(true);

  const handleClose = () => {
    setIsMatchUIVisible(false);
  };

  return (
    <div>
      {isMatchUIVisible && <MatchUI onClose={handleClose} />}
      <Button onClick={() => setIsMatchUIVisible(true)} variant="solid">
        Open MatchUI
      </Button>
    </div>
  );
};

export default App;
