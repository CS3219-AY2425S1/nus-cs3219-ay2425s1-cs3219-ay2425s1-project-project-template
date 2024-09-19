import React, { useState } from "react";
import MatchUI from "./components/MatchUI";

const App: React.FC = () => {
  const [isMatchUIVisible, setIsMatchUIVisible] = useState<boolean>(true);

  const handleClose = () => {
    setIsMatchUIVisible(false);
  };

  return (
    <div>
      {isMatchUIVisible && <MatchUI onClose={handleClose} />}
      <button onClick={() => setIsMatchUIVisible(true)}>Open MatchUI</button>
    </div>
  );
};

export default App;
