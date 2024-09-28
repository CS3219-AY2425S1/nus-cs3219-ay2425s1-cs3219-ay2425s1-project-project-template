"use client";

import { useAuth } from "@/components/auth/AuthContext";
import LandingPage from "./components/landing-page/LandingPage";
import Dashboard from "./components/dashboard/Dashboard";

const Home = () => {
  const { user } = useAuth();
  console.log(user);

  return user?.access_token ? <Dashboard /> : <LandingPage />;
};

export default Home;
