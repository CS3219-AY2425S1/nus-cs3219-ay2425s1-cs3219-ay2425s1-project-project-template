import React from "react";
import NavBar from "../components/AdminNavBar.tsx";
import Dashboard from "../components/Dashboard/Dashboard.tsx";

const DashboardPageForUsers: React.FC = () => {
  return (
    <div className="w-screen h-screen flex flex-col">
      <NavBar />
      <Dashboard />
    </div>
  );
};

export default DashboardPageForUsers;
