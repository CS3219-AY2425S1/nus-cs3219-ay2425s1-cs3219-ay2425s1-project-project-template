"use client";

import Header from "@/components/header";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    alert(token);

    if (!token) {
      router.push("/auth/login");
    }
  });

  return (
    <div className="h-screen w-screen flex flex-col max-w-6xl mx-auto py-10">
      <Header />
      Home Page
    </div>
  );
}
