"use client";

import { useAuth } from "@/components/auth/AuthContext";
import LandingPage from "@/app/(home)/components/landing-page/LandingPage";
import LeetcodeDashboard from "./LeetcodeDashboard";

const Home = () => {
  const { token } = useAuth();

  return (
    token ? <LeetcodeDashboard/> : <LandingPage/>
  );
};

export default Home;
