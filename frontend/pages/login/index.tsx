import LoginForm from "@/components/forms/LoginForm";
import { useLogin } from "@/hooks/auth";
import { useRouter } from "next/router";
import React from "react";

const LoginPage = () => {
  const router = useRouter();
  const { mutate: login, isPending, isError, error } = useLogin();

  const handleLogin = (email: string, password: string) => {
    // Call the login mutation function with email and password
    login(
      { email, password },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: (err) => {
          console.error("Login failed:", err);
        },
      }
    );
  };

  return (
    <div>
      <h2>Login Page</h2>
      <LoginForm onSubmit={handleLogin} />
      {isError && <p>{error?.message}</p>}
      {isPending && <p>Logging in...</p>}
    </div>
  );
};

export default LoginPage;
