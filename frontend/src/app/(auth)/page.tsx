"use client";

import { AuthStatus, useAuth } from "@/components/auth/AuthContext";
import LandingPage from "./components/landing-page/LandingPage";
// import Dashboard from "./components/dashboard/Dashboard";
import LeetcodeDashboard from "./leetcode-dashboard/LeetcodeDashboard";

const Home = () => {
  const { authStatus } = useAuth();

  return (
    authStatus === AuthStatus.ADMIN ? <LeetcodeDashboard/> : <LandingPage/>
  );
};

export default Home;
