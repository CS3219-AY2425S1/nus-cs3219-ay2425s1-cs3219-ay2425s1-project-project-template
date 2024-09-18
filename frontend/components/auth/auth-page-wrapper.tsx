"use client";

import React from "react";
import { ReactNode } from "react";
import { useAuth } from "@/app/auth/auth-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type AuthCheck = (user: object) => boolean;

interface AuthPageWrapperProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  authCheck?: AuthCheck; // Return true if user has access
}

const AuthPageWrapper: React.FC<AuthPageWrapperProps> = ({ children, ...props }) => {
  const auth = useAuth();
  const router = useRouter();

  return (
    <div>
      {!props.authCheck || props.authCheck(auth?.user as object) ? children : (
      <div className="flex items-start justify-center h-2/6">
        <div className="text-center mt-[20vh]">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Uh Oh! You&apos;re not supposed to be here!
          </h1>
          <Button
            size="lg"
            onClick={() => {
              auth?.user
                ? router.push("/") // TODO: Change redirect later based on user login
                : router.push("/auth/login");
            }}
          >
            Return Home
          </Button>
        </div>
      </div>
    )}
    </div>
  );
};

export default AuthPageWrapper;
