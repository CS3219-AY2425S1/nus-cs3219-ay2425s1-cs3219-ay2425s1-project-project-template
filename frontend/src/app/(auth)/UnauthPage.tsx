"use client";

import { useAuth } from "@/components/auth/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";

const UnauthPage = () => {
  const { user, login } = useAuth();

  const googleLogin = useGoogleLogin({
    onSuccess: (response) => login(response),
    onError: (error) => {
      console.error("Login Failed:", error);
    },
  });

  const handleLogin = () => {
    // caching logic
    googleLogin();
  }

  return (!user &&
    <div className="max-w-3xl p-4 mx-auto">
      <h1 className="text-white text-h1 font-bold">Oops...</h1>

      <button onClick={handleLogin} className="">You are unauthorized to view this page.</button>
    </div>
  );
};

export default UnauthPage;