// src/pages/DashboardPage.js


import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Calendar from "../components/dashboard/Calendar"; // Import the Calendar component

const DashboardPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const navigate = useNavigate(); // Initialize useNavigate

  // Handle back button navigation
  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div style={{ paddingTop: "70px", position: "relative" }}>
      <h1 style={{ visibility: "hidden" }}>Dashboard Page</h1>
      <button
        style={{
          position: "absolute",
          top: "40px",
          left: "35px",
        }}
        className="button-custom" // Add this to use the same custom button style
        onClick={handleBack}
      >
        <i className="fas fa-arrow-left"></i> Back
      </button>
      <Calendar
        currentMonth={currentMonth}
        currentYear={currentYear}
        setCurrentMonth={setCurrentMonth}
        setCurrentYear={setCurrentYear}
      />
    </div>
  );
};

export default DashboardPage;
