import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Calendar from "../components/dashboard/Calendar"; // Import the Calendar component
import CurrentActiveSession from "../components/dashboard/CurrentActiveSession"; // Import the CurrentActiveSession component

const DashboardPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const navigate = useNavigate(); // Initialize useNavigate

  // Handle back button navigation
  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  // Boolean to toggle active session
  const hasActiveSession = false; 

  return (
    <div style={{ paddingTop: "70px", position: "relative", display: "flex" }}>
      <h1 style={{ visibility: "hidden" }}>Dashboard Page</h1>

      {/* Remove the logout button */}
      {/* <button
        style={{
          position: "absolute",
          top: "40px",
          left: "35px",
        }}
        className="button-custom"
        onClick={handleBack}
      >
        <i className="fas fa-arrow-left"></i> Logout
      </button> */}

      {/* Current Active Session Component */}
      <CurrentActiveSession hasActiveSession={hasActiveSession} />

      {/* Calendar component */}
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
