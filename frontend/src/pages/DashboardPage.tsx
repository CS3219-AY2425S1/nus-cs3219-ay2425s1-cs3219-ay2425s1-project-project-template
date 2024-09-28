import React from "react";
import AdminNavBar from "../components/AdminNavBar.tsx";
import Dashboard from "../components/Dashboard/Dashboard.tsx";

const DashboardPage: React.FC = () => {
  return (
    <div className="w-screen h-screen flex flex-col">
      <AdminNavBar />
      <Dashboard />
    </div>
  );
};

export default DashboardPage;
