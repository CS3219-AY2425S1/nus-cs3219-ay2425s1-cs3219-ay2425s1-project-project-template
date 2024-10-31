"use client";

import LandingPage from "@/app/(auth)/home/components/landing-page/LandingPage";
import { AuthStatus, useAuth } from "@/components/auth/AuthContext";
import QuestionDashboard from "./question-bank/QuestionDashboard";
import AuthDashboard from "./components/dashboard/Dashboard";

const Home = () => {
  const { authStatus } = useAuth();
  
  return <>{authStatus === AuthStatus.ADMIN ?
    <QuestionDashboard/> : 
    authStatus === AuthStatus.AUTHENTICATED ?
    <AuthDashboard/> :
    authStatus === AuthStatus.UNAUTHENTICATED ?
    <LandingPage/> : <></>}
    </>
};

export default Home;
