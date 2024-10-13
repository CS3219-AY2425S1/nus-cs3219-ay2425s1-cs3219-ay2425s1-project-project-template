import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Calendar from "../components/dashboard/Calendar"; 
import SessionBox from "../components/dashboard/SessionBox"; 
import ConfirmationModal from "../components/dashboard/ConfirmationModal"; 
import withAuth from "../hoc/withAuth"; 
import { useAuth } from "../AuthContext"; 

const DashboardPage = () => {
  const navigate = useNavigate(); 
  const { logout } = useAuth(); 
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const hasActiveSession = false; 

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
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div style={{ paddingTop: "100px", display: "flex", justifyContent: "center", position: 'relative' }}>
      <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "20px", 
          maxWidth: "600px", 
          marginRight: "20px" 
        }}>
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

      <div style={{ marginLeft: "20px" }}>  
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
                backgroundColor: '#f44336',
                color: 'white',
                borderBottomLeftRadius: '5px',
                borderBottomRightRadius: '5px',
                borderTopLeftRadius: '0',
                borderTopRightRadius: '0',
                textAlign: 'center',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f44336'}
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
