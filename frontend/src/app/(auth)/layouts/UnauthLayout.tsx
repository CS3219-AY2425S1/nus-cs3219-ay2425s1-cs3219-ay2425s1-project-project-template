"use client";

import { ReactNode } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import Header from "@/components/ui/Header";
import Link from "next/link";

const UnauthLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  return (!user &&
    <div>
      <nav className="max-w-6xl p-4 mx-auto flex justify-center items-center">
        <Header/>
        <Link href="/link1" className="my-auto mx-4 text-primary-300 hover:bg-yellow-500 hover:text-primary-900 p-2 rounded-md">link_1</Link>
        <Link href="/link2" className="my-auto mx-4 text-primary-300 hover:bg-yellow-500 hover:text-primary-900 p-2 rounded-md">link_2</Link>
      </nav>
      <div>{children}</div>
    </div>
  );
};

export default UnauthLayout;
