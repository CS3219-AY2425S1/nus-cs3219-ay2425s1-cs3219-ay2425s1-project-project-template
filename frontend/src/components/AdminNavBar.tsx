import React from "react";
import { useLocation } from "react-router-dom";
import ProfileButton from "./ProfileButton.tsx";

const AdminNavBar: React.FC = () => {
  const location = useLocation();
  return (
    <nav className="bg-off-white w-full p-4 flex items-center justify-between">
      {/* Logo or Brand */}
      <div className="container flex justify-start">
        <img
          src="/src/assets/logo.svg"
          alt="PeerPrep logo"
          className="h-16 w-64"
        />
      </div>
      {/* Conditionally render extra div based on location */}
      {location.pathname == "/question" && (
        <div className="container text-2xl text-off-white">
            <button className="bg-green rounded-[25px] p-4">Add question</button>
        </div>
      )}
      {/* Profile button */}
      <div>
        <ProfileButton/>
      </div>
    </nav>
  );
};

export default AdminNavBar;
