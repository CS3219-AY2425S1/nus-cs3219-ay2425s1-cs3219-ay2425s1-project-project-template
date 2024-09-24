"use client";

import { useAuth } from "@/components/auth/AuthContext";
import AuthDashboard from "./pages/Dashboard";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    user && <AuthDashboard/>
  );
};

export default Dashboard;
