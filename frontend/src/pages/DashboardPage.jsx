// DashboardPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Calendar from "../components/dashboard/Calendar"; 
import SessionBox from "../components/dashboard/SessionBox"; 
import withAuth from "../hoc/withAuth"; 

const DashboardPage = () => {
  const [username, setUsername] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  // Boolean to toggle active session
  const hasActiveSession = false; 

  // Fetch the username on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('accessToken');
      console.log("Access Token:", token); // Log the token for debugging

      if (!token) {
        console.error("No access token found. Redirecting to login.");
        return; // Early return if there's no token
      }

      try {
        const response = await fetch('http://localhost:8081/auth/verify-token', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log("Response Status:", response.status); 

        if (!response.ok) {
          throw new Error("Failed to verify token");
        }

        const data = await response.json();
        console.log("User Data:", data); 
        setUsername(data.username); 
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div style={{ paddingTop: "70px", display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginRight: "10px" }}>
        
        {/* Welcome back message */}
        {username && <h2>Welcome back, {username}!</h2>}

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

const WrappedDashboardPage = withAuth(DashboardPage);
export default WrappedDashboardPage;
