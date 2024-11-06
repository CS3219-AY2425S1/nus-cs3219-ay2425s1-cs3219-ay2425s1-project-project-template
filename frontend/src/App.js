
import "./App.css";
import { useEffect, useState } from 'react';
import axios from "axios";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { Question } from "./pages/Question";
import { UserPage } from "./pages/UserPage";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Match } from "./pages/Match";
import { Collaboration } from "./pages/Collaboration";

function App() {
  const [isAuthenticated, setIsAuthenticated] =  useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const authenticateURL = "http://localhost:3002/auth/verify-token";
  const navigate = useNavigate();

  const checkAuthenticated = async (accessToken) => {
    try {
      const response = await axios.get(authenticateURL, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      if (response.status === 200) {
        // OK
        console.log("Valid JWT token");
        return true;
      } else if (response.status === 401) {
        console.log(`Invalid JWT Token, need to login again: ${response.status}`);
        return false;
      } else if (response.status === 500) {
        console.log("Database or server error");
        return false;
      } else {
        console.log("Unknown status code error!");
        return false;
      }
    } catch (error) {
      if (error.status === 401) {
        console.log(`Invalid JWT Token, need to login again: ${error.status}`);
        return false;
      } else {
        console.log("Unknown error!");
        return false;
      }
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const awaitAuthenticated = async () => {
      try {
        const authenticated = await checkAuthenticated(token);
        setIsAuthenticated(authenticated);
        setIsLoaded(true);
      } catch (error) {
        console.log("Error: " + error);
        setIsAuthenticated(false);
      }
    }
    awaitAuthenticated();
  }, [])

  const PrivateRoute = ({ element, isAuthenticated }) => {
    return isAuthenticated ? element : <Navigate to="/login" replace />;
  };

  if (!isLoaded) {
    return (<div></div>)
  }

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />
        <Route path='/home' element={<PrivateRoute element={<HomePage />} isAuthenticated={isAuthenticated} />} />
        <Route path='/login' element={<Login onLoginSuccess={() => setIsAuthenticated(true)}/>} />
        <Route path='/signup' element={<Register />} />
        <Route path='/questions/:id' element={<PrivateRoute element={<Question />} isAuthenticated={isAuthenticated} />} />
        <Route path="/profile" element={<PrivateRoute element={<UserPage />} isAuthenticated={isAuthenticated} />} />
        <Route path="/match" element={<PrivateRoute element={<Match />} isAuthenticated={isAuthenticated} />} />
        <Route path="/collab" element={<PrivateRoute element={<Collaboration />} isAuthenticated={isAuthenticated} />} />
        <Route path="*" element={<p>404: Page Not Found!</p>} />
      </Routes>
    </div>
  );
}

export default App;

