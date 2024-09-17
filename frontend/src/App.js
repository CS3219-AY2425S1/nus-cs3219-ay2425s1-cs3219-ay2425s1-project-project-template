// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import QuestionPage from "./pages/QuestionPage";
import backgroundImage from "./assets/images/lightbluepinkgrad.jpeg"; // Adjust the path as needed
import "./styles/App.css"; // Import the CSS file

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        textAlign: "center",
        paddingTop: "20%",
      }}
    >
      <h1>Welcome to PeerPrep</h1>
      <button
        onClick={() => navigate("/questions")}
        className="button-custom" // Apply custom button style
      >
        View Questions
      </button>
    </div>
  );
};

const App = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/questions" element={<QuestionPage />} />
          {/* Define other routes here */}
        </Routes>
      </Router>
    </div>
  );
};

export default App;
