import React, { useState } from "react";
import MatchingOptions from "@/components/custom/MatchingOptions/MatchingOptions";
import QuestionTable from "@/components/custom/QuestionTable/QuestionTable";
import { Separator } from "@/components/ui/separator";
import { Title } from "@/components/ui/title";
import profileIcon from "@/assets/profile.png"; // Adjust the path if necessary
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import "@/css/styles.css";

const QuestionPageView: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setShowDropdown(false);
  };

  return (
    <main className="h-screen w-screen p-5">
      <div className="flex items-center justify-between mb-4">
        <Title title="Question Bank" />
        <div className="profile-icon-container">
          <img
            src={profileIcon}
            alt="Profile"
            className="profile-icon"
            onClick={toggleDropdown}
          />
          {showDropdown && (
            <div className="dropdown-menu">
              <Button
                variant="ghost"
                className="w-full text-left"
                onClick={() => {
                  sessionStorage.removeItem("authToken"); // Clear the token
                  sessionStorage.removeItem("uid") // Clear the uid
                  handleNavigation("/"); // Navigate to the home page
                }}
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
      </div>

      <Separator className="my-2" />

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3 p-4 rounded-lg shadow-lg">
          <QuestionTable />
        </div>

        <div className="col-span-1 p-4 rounded-lg shadow-lg">
          <MatchingOptions />
        </div>
      </div>
    </main>
  );
};

export default QuestionPageView;