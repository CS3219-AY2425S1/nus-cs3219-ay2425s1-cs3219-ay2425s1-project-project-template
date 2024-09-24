import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './index.css';
import RegistrationController from "./pages/user/RegistrationController";
import LoginController from "./pages/user/LoginController";

const App: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const toggleView = () => {
    setIsRegistering((prev) => !prev);
  };
  
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginController />} />
          <Route path="/register" element={<RegistrationController />} />
      </Routes>
    </Router>
  );
};

export default App;
