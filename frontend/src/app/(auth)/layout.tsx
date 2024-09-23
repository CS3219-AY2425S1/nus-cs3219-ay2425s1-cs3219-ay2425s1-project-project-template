"use client";

import { AuthProvider, useAuth } from "@/components/auth/AuthContext";
import { ReactNode } from "react";
import AuthLayout from "./AuthLayout";
import UnauthLayout from "./UnauthLayout";

const Layout = ({ children }: { children: ReactNode }) => {

  return <AuthProvider>
    <AuthLayout>{children}</AuthLayout>
    <UnauthLayout>{children}</UnauthLayout>
  </AuthProvider>
};

export default Layout;
