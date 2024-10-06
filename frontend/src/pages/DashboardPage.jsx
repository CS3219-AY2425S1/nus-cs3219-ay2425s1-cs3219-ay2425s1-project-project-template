import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Calendar from "../components/dashboard/Calendar"; 
import SessionBox from "../components/dashboard/SessionBox"; 

const DashboardPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const navigate = useNavigate(); 

  // Boolean to toggle active session
  const hasActiveSession = false; 

  return (
    <div style={{ paddingTop: "70px", display: "flex", justifyContent: "center" }}>
      {/* left: session boxes stacked */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginRight: "10px" }}> {/* reduced the gap and margin */}

        {/* Current Active Session Component */}
        <SessionBox
          headerText="Current Active Session"
          sessionText={hasActiveSession ? "Current active session with ____" : "No active session. Ready for more?"}
          buttonText={hasActiveSession ? "Rejoin Session" : "New Question"}
          buttonLink={hasActiveSession ? "/rejoin" : "/new-question"}
        />

        {/* Go to Question Page Box */}
        <SessionBox
          headerText="Go to Question Page"
          sessionText="Navigate to the question page to view, add, edit or delete questions."
          buttonText="Manage Questions"
          buttonLink="/questions"
        />
      </div>

      {/* right: calendar */}
      <div style={{ marginLeft: "0px" }}> 
        <Calendar
          currentMonth={currentMonth}
          currentYear={currentYear}
          setCurrentMonth={setCurrentMonth}
          setCurrentYear={setCurrentYear}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
