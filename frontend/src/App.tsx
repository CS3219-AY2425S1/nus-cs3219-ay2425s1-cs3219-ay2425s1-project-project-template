import React from "react";
import { BrowserRouter } from "react-router-dom";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <h1 className="text-5xl font-bold underline">Hello world!</h1>
      </div>
    </BrowserRouter>
  );
};

export default App;
