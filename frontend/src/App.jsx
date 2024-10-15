import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MatchingServicePage from "./pages/MatchingService";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage"; // Assuming ErrorPage exists

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/matching-service" element={<MatchingServicePage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}
