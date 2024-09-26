"use client";

import { useAuth } from "@/components/auth/AuthContext";
import LandingPage from "./dashboard/pages/LandingPage";
import Dashboard from "./dashboard/pages/Dashboard";

const Home = () => {
  const { user } = useAuth();
  console.log(user);

  return (
    user?.access_token ? <Dashboard/> : <LandingPage/>
  );
};

export default Home;
