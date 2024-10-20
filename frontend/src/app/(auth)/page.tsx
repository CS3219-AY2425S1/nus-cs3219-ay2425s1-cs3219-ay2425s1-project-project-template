"use client";

import Navbar from "@/app/(auth)/home/components/navbar/Navbar";
import LandingPage from "@/app/(auth)/home/components/landing-page/LandingPage";
import { getToken } from "@/api/user";
import AuthDashboard from "./components/dashboard/Dashboard";
import { useEffect, useState } from "react";

const Home = () => {
  const [userToken, setUserToken] = useState<string | null>(null);
  useEffect(() => {
    const token = getToken();
    if (token) {
      setUserToken(token);
    }
  }, []);

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
