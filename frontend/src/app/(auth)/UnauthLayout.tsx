"use client";

import { ReactNode, useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";

const UnauthLayout = ({ children }: { children: ReactNode }) => {
  const { user, login } = useAuth();
  const googleLogin = useGoogleLogin({
    onSuccess: login,
    onError: (error) => {
      console.error("Login Failed:", error);
    },
  });

  const handleLogin = () => {
    googleLogin();
  };

  return (!user &&
    <div className="flex h-full overflow-y-auto">
      <button onClick={handleLogin}>hi</button>
    </div>
  );
};

export default UnauthLayout;
