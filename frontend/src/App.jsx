import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MatchingService from "./pages/MatchingService";
import Navbar from "./components/Navbar";
import ErrorPage from "./error-page"; // Optional error page

export default function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/matching-service" element={<MatchingService />} />
          <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}
