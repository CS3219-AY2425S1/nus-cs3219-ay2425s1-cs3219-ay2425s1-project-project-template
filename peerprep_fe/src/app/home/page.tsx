"use client";

import Header from "@/components/header";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/button";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    alert(token);

    if (!token) {
      router.push("/auth/login");
    }
    // TODO: Validate token is still valid
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col max-w-6xl mx-auto py-10">
      <Header>
        <Button
          text="Logout"
          onClick={() => {
            logout();
            router.push("/auth/login");
          }}
        />
      </Header>
      Home Page
    </div>
  );
}

export async function logout() {
  localStorage.removeItem("token");
}
