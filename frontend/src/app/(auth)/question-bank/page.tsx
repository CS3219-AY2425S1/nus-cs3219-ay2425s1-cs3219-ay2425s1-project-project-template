"use client";

import { AuthStatus, useAuth } from "@/components/auth/AuthContext";
import { useState, useEffect } from "react";
import LandingPage from "@/app/(auth)/home/components/landing-page/LandingPage";
import QuestionDashboard from "./QuestionDashboard";
import { getToken } from "@/api/user";

const QuestionDashboardPage = () => {
  const token = getToken();
  const { authStatus } = useAuth();
  const [loading, setLoading] = useState(true);

  // Simulate token fetching or resolving logic
  useEffect(() => {
    if (!!token) {
      setLoading(false);
    } else {
      window.location.href = "/login";
    }
  }, [token]);

  if (loading) {
    return null;
  }

  return authStatus === AuthStatus.ADMIN ? <QuestionDashboard /> : <LandingPage />;
};

export default QuestionDashboardPage;