"use client";

import { useAuth } from "@/components/auth/AuthContext";
import AuthDashboard from "./pages/AuthDashboard";
import UnauthPage from "../common/UnauthPage";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    user ? <AuthDashboard/> : <UnauthPage/>
  );
};

export default Dashboard;
