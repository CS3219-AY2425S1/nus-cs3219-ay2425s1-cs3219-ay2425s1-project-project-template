"use client";

import { AuthProvider } from "@/components/auth/AuthContext";
import { ReactNode } from "react";
import AuthLayout from "./layouts/AuthLayout";
import UnauthLayout from "./layouts/UnauthLayout";

const Layout = ({ children }: { children: ReactNode }) => {

  return <AuthProvider>
    <AuthLayout>{children}</AuthLayout>
    <UnauthLayout>{children}</UnauthLayout>
  </AuthProvider>
};

export default Layout;
