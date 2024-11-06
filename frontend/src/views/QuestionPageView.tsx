import React, { useState, useEffect } from "react";
import MatchingOptions from "@/components/custom/MatchingOptions/MatchingOptions";
import QuestionTable from "@/components/custom/QuestionTable/QuestionTable";
import { Separator } from "@/components/ui/separator";
import { Title } from "@/components/ui/title";
import profileIcon from "@/assets/profile.png";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getUsernameByUid } from "@/services/UserFunctions";
import "@/css/styles.css";
import { fetchAdminStatus } from "@/services/UserFunctions";
import { auth, signOut } from "../config/firebaseConfig";

const QuestionPageView: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setShowDropdown(false);
  };

  const fetchUsernameAndAdminStatus = async () => {
    try {
      const usernameData = await getUsernameByUid();
      const isAdmin = await fetchAdminStatus();
      setUsername(usernameData);
      setIsAdmin(isAdmin);
    } catch (error) {
      console.error("Failed to retrieve username or admin status:", error);
      setUsername("");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user from Firebase Authentication

      navigate("/"); // Navigate to the home page or login page after logout
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  useEffect(() => {
    fetchUsernameAndAdminStatus();
    setLoading(false); // End loading if no user_id found
  }, []);

  return (
    <main
      className="h-screen w-screen p-5"
      style={{ height: "100%", backgroundColor: "white" }}
    >
      <div className="flex items-center justify-between mb-4">
        <Title title="Question Bank" />
        <img
          src={profileIcon}
          alt="Profile"
          className="w-10 h-10 cursor-pointer"
          onClick={toggleDropdown}
        />
        {showDropdown && (
          <div className="dropdown-menu">
            <Button
              variant="ghost"
              className="w-full text-left"
              onClick={() => handleNavigation("/history")}
            >
              View History
            </Button>
            <Button
              variant="ghost"
              className="w-full text-left"
              onClick={handleLogout}
            >
              Logout
            </Button>
            <Button
              variant="ghost"
              className="w-full text-left text-red-500"
              onClick={() => handleNavigation("/delete-account")}
            >
              Delete Account
            </Button>
          </div>
        )}
      </div>

      <Separator className="my-2" />
      <div>
        {loading ? (
          <p>Loading user information...</p>
        ) : username ? (
          <p>Welcome, {username}!</p>
        ) : (
          <p>Not logged in</p>
        )}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div
          className="p-4 col-span-3 md:col-span-1 rounded-lg shadow-lg"
          style={{ height: "100vh" }}
        >
          <MatchingOptions />
        </div>
        <div className="p-4 col-span-3 md:col-span-2 rounded-lg shadow-lg">
          <QuestionTable isAdmin={isAdmin} />
        </div>
      </div>
    </main>
  );
};

export default QuestionPageView;
