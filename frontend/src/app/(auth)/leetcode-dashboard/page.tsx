"use client";

import { AuthStatus, useAuth } from "@/components/auth/AuthContext";
import { useState, useEffect } from "react";
import LandingPage from "@/app/(home)/components/landing-page/LandingPage";
import LeetcodeDashboard from "./LeetcodeDashboard";
import { getToken } from "@/api/user";

const LeetcodeDashboardPage = () => {
  const token = getToken();
  const { authStatus } = useAuth();
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

  return authStatus === AuthStatus.ADMIN ? <LeetcodeDashboard /> : <LandingPage />;
};

export default LeetcodeDashboardPage;