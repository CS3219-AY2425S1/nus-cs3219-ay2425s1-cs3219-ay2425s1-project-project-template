"use client";

import Navbar from "@/app/(auth)/home/components/navbar/Navbar";
import LandingPage from "@/app/(auth)/home/components/landing-page/LandingPage";
import { getToken } from "@/api/user";
import AuthDashboard from "./components/dashboard/Dashboard";

const Home = () => {
    const token = getToken();
    return (
        !!token ? <AuthDashboard/> : <>
            <Navbar />
            <LandingPage />
        </>
    );
};

export default Home;