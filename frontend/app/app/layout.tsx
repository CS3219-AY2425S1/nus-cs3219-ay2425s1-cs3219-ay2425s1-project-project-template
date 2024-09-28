"use client";

import AuthPageWrapper from "@/components/auth/auth-page-wrapper";
import { Navbar } from "@/components/navbar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthPageWrapper requireLoggedIn>
      <Navbar />
      {children}
    </AuthPageWrapper>
  );
}
