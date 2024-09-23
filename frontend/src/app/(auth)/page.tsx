"use client";

import { useAuth } from "@/components/auth/AuthContext";
import AuthDashboard from "./(home)/pages/AuthDashboard";
import UnauthPage from "./UnauthPage";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    user ? <AuthDashboard/> : <UnauthPage/>
  );
};

export default Dashboard;
