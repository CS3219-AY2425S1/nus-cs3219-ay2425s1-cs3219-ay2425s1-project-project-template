import { Route, Routes, Navigate } from "react-router-dom";
import { Box, Spinner } from "@chakra-ui/react";
import "./App.css";
import QuestionPage from "./pages/QuestionPage";
import QuestionDetails from "../components/question/QuestionDetails";
import HomeNavBar from "../components/HomeNavBar";
import Login from "./pages/SignIn/login";
import Home from "./home";
import Signup from "./pages/SignUp/signup";
import MatchingPage from "./pages/MatchingPage";
import { useEffect, useState } from "react";
import CodeEditor from '../components/collab/CodeEditor';
import RoomPage from "./pages/RoomPage";
import AccountPage from "./pages/AccountPage";
import AboutUsPage from "./pages/AboutUsPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ChangePassword from "../components/account/functions/ChangePassword"
import ChangePasswordModal from "../components/account/functions/ChangePasswordModal"
import DeleteAccount from "../components/account/functions/DeleteAccount"

interface UserData {
  id: string
  username: string
  email: string
  isAdmin: boolean
  mustUpdatePassword: boolean
}

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | undefined>();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token in localStorage found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:3001/auth/verify-token", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.message === "Token verified") {
          setIsAuthenticated(true);  // Token is valid
          setUserData(data.data);

          if (data.data.mustUpdatePassword) {
            setIsChangePasswordModalOpen(true);
          }
        } else {
          localStorage.removeItem("token");
          setIsAuthenticated(false);  // Invalid token
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);  // Error during verification
      }
      setLoading(false);
    };

    verifyToken();
  }, []);


  const handleLoginSuccess = (data: UserData) => {
    setIsAuthenticated(true);
    setUserData(data);
    if (data.mustUpdatePassword) {
      setIsChangePasswordModalOpen(true);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserData(undefined);
  };

  const handlePasswordChanged = () => {
    // setUserData((prevUserData) => ({
    //   ...prevUserData,
    //   mustUpdatePassword: false,
    // }));
    setIsChangePasswordModalOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box className="app" fontFamily="Poppins, sans-serif">
      <HomeNavBar
        isAuthenticated={isAuthenticated}
        username={userData ? userData.username : ''}
        onLogout={handleLogout}
      />
      <Box pt="80px">
        <Routes>
          {/* Only allow login/signup routes if the user is not authenticated */}
          {!isAuthenticated ? (
            <>
              <Route
                path="/login"
                element={
                  <Login
                    handleLoginSuccess={handleLoginSuccess}
                  />
                }
              />
              <Route path="/signup" element={<Signup />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/" replace />} /> // Redirect authenticated users
          )}

          {/* Public routes */}
          <Route path="/" element={<QuestionPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/questions" element={<QuestionPage />} />
          <Route path="/questions/:id" element={<QuestionDetails />} />
          <Route path="/aboutus" element={<AboutUsPage />} />
          <Route path="/forgot-password" element={<ResetPasswordPage />} />

          {isAuthenticated ? (
            <>
              <Route path="/match-me" element={<MatchingPage />} />
              <Route path="/editor" element={<CodeEditor />} />
              <Route path="/room" element={<RoomPage />} />
              <Route path="/account" element={<AccountPage
                username={userData ? userData.username : ''}
                id={userData ? userData.id : ''}
                email={userData ? userData.email : ''} />}>
                <Route path="password" element={<ChangePassword userId={userData?.id} />} />
                <Route path="delete" element={<DeleteAccount userId={userData?.id} onLogout={handleLogout} />} />
              </Route>
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} /> // Redirect authenticated users
          )}


        </Routes>
      </Box>
      {/* Render the Update Password Modal if required */}
      {userData?.mustUpdatePassword && (
        <ChangePasswordModal
          isOpen={isChangePasswordModalOpen}
          onClose={() => setIsChangePasswordModalOpen(false)}
          userId={userData.id}
          onPasswordUpdated={handlePasswordChanged}
        />
      )}
    </Box>
  );
}

export default App;
