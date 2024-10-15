"use client";

import { useAuth } from "@/components/auth/AuthContext";
import { useState, useEffect } from "react";
import LandingPage from "@/app/(home)/components/landing-page/LandingPage";
import LeetcodeDashboard from "./LeetcodeDashboard";

const Home = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);

  // Simulate token fetching or resolving logic
  useEffect(() => {
    if (token !== undefined) {
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return null;
  }

  return token ? <LeetcodeDashboard /> : <LandingPage />;
};

export default Home;