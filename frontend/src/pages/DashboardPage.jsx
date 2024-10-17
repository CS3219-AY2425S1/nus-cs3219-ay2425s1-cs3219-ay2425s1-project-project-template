import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Calendar from "../components/dashboard/Calendar"; 
import SessionBox from "../components/dashboard/SessionBox"; 
import ConfirmationModal from "../components/dashboard/ConfirmationModal"; 
import withAuth from "../hoc/withAuth"; 
import { useAuth } from "../AuthContext"; 
import DropdownMenu from "../components/dashboard/DropdownMenu"; 

const DashboardPage = () => {
  const navigate = useNavigate(); 
  const { logout, userId, accessToken } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [username, setUsername] = useState(''); 
  const [dailyChallenge, setDailyChallenge] = useState({ difficulty: "", topic: "" });
  const hasActiveSession = false; 

  // LeetCode Topics and Difficulties
  const difficulties = ["Easy", "Medium", "Hard"];
  const topics = [
    "Array", "String", "Linked List", "Tree", "Graph", "Dynamic Programming", 
    "Backtracking", "Binary Search", "Two Pointers", "Sorting", "Greedy", "Hash Table"
  ];

  // Logout handler
  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = (confirm) => {
    if (confirm) {
      handleLogout();
    }
    setShowLogoutConfirm(false); 
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8081/users/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }

        const data = await response.json();
        setUsername(data.data.username); 
      } catch (error) {
        console.error(error);
      }
    };

    if (userId && accessToken) {
      fetchUserData();
    }
  }, [userId, accessToken]); 

  // Generate a random daily challenge
  useEffect(() => {
    const generateDailyChallenge = () => {
      const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      setDailyChallenge({ difficulty: randomDifficulty, topic: randomTopic });
    };

    generateDailyChallenge(); // Generate on component mount
  }, []);

  return (
    <div style={{ paddingTop: "30px", display: "flex", justifyContent: "center", position: 'relative' }}>
      <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "20px", 
          maxWidth: "600px", 
          marginRight: "20px" 
        }}>
        {/* Welcome Message */}
        <div style={{ 
            color: '#fff', 
            marginBottom: '20px',
            fontSize: '24px' 
        }}>
            Welcome back, @{username}!
        </div>
        <SessionBox
          headerText="Current Active Session"
          sessionText={hasActiveSession ? "Current active session with ____" : "No active session. Ready for more?"}
          buttonText={hasActiveSession ? "Rejoin Session" : "New Question"}
          buttonLink={hasActiveSession ? "/rejoin" : "/new-session"}
        />
        <SessionBox
          headerText="Go to Question Page"
          sessionText="Navigate to the question page to view, add, edit or delete questions."
          buttonText="Manage Questions"
          buttonLink="/questions"
        />
      </div>

      <div style={{ marginLeft: "20px", marginTop: "70px" }}>  
        <Calendar
          currentMonth={currentMonth}
          currentYear={currentYear}
          setCurrentMonth={setCurrentMonth}
          setCurrentYear={setCurrentYear}
        />

        {/* Daily Challenge Section */}
        <div
          style={{
            borderRadius: "10px",
            backgroundColor: "#fff",
            padding: "20px",
            width: "400px",
            height: "200px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            marginTop: "40px",
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '20px' 
          }}
        >
          <h2 style={{ margin: "0 0 10px 0" }}>Daily Coding Challenge</h2>
          <p style={{ margin: "0", color: "#333", textAlign: 'center' }}>
            <strong>Difficulty:</strong> {dailyChallenge.difficulty}
          </p>
          <p style={{ margin: "0", color: "#333", textAlign: 'center' }}>
            <strong>Topic:</strong> {dailyChallenge.topic}
          </p>
          <button
            onClick={() => navigate('/new-session')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2a4b5e'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#1a3042'}
            style={{
              marginTop: "20px",
              padding: "15px 30px",
              backgroundColor: '#1a3042',
              color: "#fff",
              border: "none",
              borderRadius: "15px",
              cursor: "pointer",
              fontSize: '16px',
              fontFamily: 'Figtree',
              transition: "background-color 0.3s",
            }}
          >
            Try Challenge
          </button>
        </div>

      </div>

      <DropdownMenu 
        dropdownVisible={dropdownVisible}
        toggleDropdown={toggleDropdown}
        navigate={navigate}
        confirmLogout={confirmLogout}
      />

      <ConfirmationModal 
        show={showLogoutConfirm} 
        onConfirm={() => handleConfirmLogout(true)} 
        onCancel={() => handleConfirmLogout(false)} 
      />
    </div>
  );
};

const WrappedDashboardPage = withAuth(DashboardPage);
export default WrappedDashboardPage;
