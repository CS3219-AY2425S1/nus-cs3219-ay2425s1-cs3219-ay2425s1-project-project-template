import React from "react";
import backgroundImage from "./assets/images/background.jpg"; // Adjust the path as needed

const App = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        height: "100vh",
        backgroundSize: "cover",
      }}
    >
      {/*  content */}
    </div>
  );
};

export default App;
