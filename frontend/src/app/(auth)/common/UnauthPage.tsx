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
    <div className="max-w-3xl p-4 mx-auto mt-20">
      <h1 className="text-secondary text-h1 font-bold">Oops...</h1>
      <p className="text-primary-300 my-5">You are unauthorized to view this page.</p>

      <button onClick={handleLogin} className="bg-yellow-500 hover:bg-yellow-300 px-4 py-2 rounded-lg">Login</button>
    </div>
  );
};

export default UnauthPage;