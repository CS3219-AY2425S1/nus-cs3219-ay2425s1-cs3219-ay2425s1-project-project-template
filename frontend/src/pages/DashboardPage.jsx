import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Calendar from "../components/dashboard/Calendar"; 
import SessionBox from "../components/dashboard/SessionBox"; 
import ConfirmationModal from "../components/dashboard/ConfirmationModal"; 
import withAuth from "../hoc/withAuth"; 
import { useAuth } from "../AuthContext"; 

const DashboardPage = () => {
  const navigate = useNavigate(); 
  const { logout, userId, accessToken } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const [username, setUsername] = useState(''); 
  const hasActiveSession = false; 

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

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
        {/* Welcome Message Div */}
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
          buttonLink={hasActiveSession ? "/rejoin" : "/new-question"}
        />
        <SessionBox
          headerText="Go to Question Page"
          sessionText="Navigate to the question page to view, add, edit or delete questions."
          buttonText="Manage Questions"
          buttonLink="/questions"
        />
      </div>

      <div style={{ marginLeft: "20px", marginTop: "70px"}}>  
        <Calendar
          currentMonth={currentMonth}
          currentYear={currentYear}
          setCurrentMonth={setCurrentMonth}
          setCurrentYear={setCurrentYear}
        />
      </div>

      <div style={{ position: 'absolute', top: '30px', right: '30px' }}>
        <div 
          onClick={toggleDropdown}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
          }}
        >
        </div>
        
        {dropdownVisible && (
          <div ref={dropdownRef} style={{
            position: 'absolute',
            top: '50px',
            right: '0',
            backgroundColor: 'white',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
            minWidth: '150px', 
            width: '150px',
          }}>
            <div 
              onClick={() => navigate('/manage-profile')}
              style={{
                padding: '10px 15px',
                cursor: 'pointer',
                borderBottom: '1px solid #ccc',
                textAlign: 'center',
                transition: 'color 0.3s',
                color: 'black',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#007bff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'black'}
            >
              Manage Profile
            </div>
            <div 
              onClick={confirmLogout}
              style={{
                padding: '10px 15px',
                cursor: 'pointer',
                backgroundColor: 'white',
                color: '#f44336',
                borderBottomLeftRadius: '5px',
                borderBottomRightRadius: '5px',
                borderTopLeftRadius: '0',
                borderTopRightRadius: '0',
                textAlign: 'center',
                transition: 'color 0.3s, background-color 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#d32f2f';
                e.currentTarget.style.backgroundColor = '#fce4e4';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#f44336';
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              Logout
            </div>
          </div>
        )}
      </div>

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
