// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import QuestionPage from "./pages/QuestionPage";
import DashboardPage from "./pages/DashboardPage";
import backgroundImage from "./assets/images/lightgradient.jpeg"; // path for background
import "./styles/App.css"; // css file

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        textAlign: "center",
        paddingTop: "20%",
        color: "#fff",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
      }}
    >
      <h1 style={{ fontSize: "4rem", marginBottom: "40px" }}>PeerPrep</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <button
          onClick={() => navigate("/dashboard")}
          className="button-custom"
        >
          Dashboard (Under Construction 🚧)
        </button>

        <button
          onClick={() => navigate("/questions")}
          className="button-custom"
        >
          Available Questions
        </button>
      </div>
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
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Define other routes here */}
        </Routes>
      </Router>
    </div>
  );
};

export default App;
