"use client";

import LandingPage from "./components/landing-page/LandingPage";
import LeetcodeDashboard from "./leetcode-dashboard/LeetcodeDashboard";
import { AuthStatus, useAuth } from "@/components/auth/AuthContext";

const Home = () => {
  const { authStatus } = useAuth();
  return authStatus === AuthStatus.ADMIN ? <LeetcodeDashboard/> : <LandingPage/>;
};

export default Home;
