"use client";

import { ReactNode } from "react";
import { useAuth } from "@/components/auth/AuthContext";

const UnauthLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  return (!user &&
    <div>{children}</div>
  );
};

export default UnauthLayout;
