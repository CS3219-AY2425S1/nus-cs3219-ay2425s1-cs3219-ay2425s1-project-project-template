import React from "react";
import { useRouter } from "next/router";
import { Button } from "@nextui-org/button";

import LoginForm from "@/components/forms/LoginForm";
import { useLogin } from "@/hooks/api/auth";
import DefaultLayout from "@/layouts/default";
import { useUser } from "@/hooks/users";
import { User } from "@/types/user";

const LoginPage = () => {
  const router = useRouter();
  const { setUser } = useUser();
  const { mutate: login, isPending, isError, error } = useLogin();

  const handleLogin = (email: string, password: string) => {
    login(
      { email, password },
      {
        onSuccess: (data) => {
          const user: User = {
            id: data.id,
            username: data.username,
            email: data.email,
            isAdmin: data.isAdmin,
          };

          setUser(user);
          router.push("/match");
        },
        onError: (error) => {
          alert(`Login failed: ${error?.message}`);
        },
      },
    );
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <DefaultLayout isLoggedIn={false}>
      <div className="flex items-start justify-center pt-[25vh]">
        <div
          className="w-full max-w-lg p-8 rounded-lg shadow-lg"
          style={{ backgroundColor: "#19191b" }}
        >
          <h2 className="text-3xl font-semibold text-center text-white">
            Welcome to PeerPrep!
          </h2>

          <LoginForm onSubmit={handleLogin} />

          {isError && <p className="text-red-500 mt-4">{error?.message}</p>}
          {isPending && <p className="text-gray-400 mt-4">Logging in...</p>}

          <div className="mt-6 text-center">
            <h3 className="text-white">Don&apos;t have an account?</h3>
            <Button className="mt-2" onClick={handleRegister}>
              Register
            </Button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default LoginPage;
