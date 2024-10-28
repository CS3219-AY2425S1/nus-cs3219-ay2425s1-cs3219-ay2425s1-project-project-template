import React, { useState, useEffect } from "react";
import MatchingOptions from "@/components/custom/MatchingOptions/MatchingOptions";
import QuestionTable from "@/components/custom/QuestionTable/QuestionTable";
import { Separator } from "@/components/ui/separator";
import { Title } from "@/components/ui/title";
import profileIcon from "@/assets/profile.png";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import "@/css/styles.css";

const QuestionPageView: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isMediumScreen, setIsMediumScreen] = useState<boolean>(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setShowDropdown(false);
  };

  // Effect to track window size
  useEffect(() => {
    const handleResize = () => {
      setIsMediumScreen(window.innerWidth >= 768); // Adjust breakpoint as needed
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, []);

  return (
    <main className="h-screen w-screen p-5">
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
              onClick={() => {
                sessionStorage.removeItem("authToken");
                sessionStorage.removeItem("uid");
                handleNavigation("/");
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

      <Separator className="my-2" />

      {/* Conditional Layout Rendering */}
      {isMediumScreen ? (
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3 p-4 rounded-lg shadow-lg">
            <QuestionTable />
          </div>
          <div className="col-span-1 p-4 rounded-lg shadow-lg">
            <MatchingOptions />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 rounded-lg shadow-lg">
            <MatchingOptions />
          </div>
          <div className="p-4 rounded-lg shadow-lg">
            <QuestionTable />
          </div>
        </div>
      )}
    </main>
  );
};

export default QuestionPageView;
