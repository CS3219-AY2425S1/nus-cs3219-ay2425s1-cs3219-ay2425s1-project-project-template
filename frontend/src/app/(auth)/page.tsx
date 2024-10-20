"use client";

import Navbar from "@/app/(auth)/home/components/navbar/Navbar";
import LandingPage from "@/app/(auth)/home/components/landing-page/LandingPage";
import { getToken } from "@/api/user";
import AuthDashboard from "./components/dashboard/Dashboard";
import { useEffect, useState } from "react";

const Home = () => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setUserToken(token);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return null; //Can render a loading spinner instead
  }
  
  return !!userToken ? (
    <AuthDashboard />
  ) : (
    <>
      <Navbar />
      <LandingPage />
    </>
  );
};

export default Home;
