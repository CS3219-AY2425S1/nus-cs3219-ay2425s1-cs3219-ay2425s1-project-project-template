"use client";

import { ReactNode, Suspense } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/app/common/Sidebar";
import LoadingPage from "./common/LoadingPage";

const inter = Inter({
  subsets: ["latin"],
});

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" className={`${inter.className} h-full`}>
      <body className="h-full">
      <div className="flex h-full overflow-y-auto">
        <Sidebar />
        <Suspense fallback={<LoadingPage/>}>
          <div className="w-full overflow-y-scroll">{children}</div>
        </Suspense>
      </div>
      </body>
    </html>
  );
};

export default Layout;
