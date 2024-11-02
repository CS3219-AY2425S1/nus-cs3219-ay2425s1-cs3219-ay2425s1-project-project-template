"use client";

import { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/app/common/Sidebar";

const inter = Inter({
  subsets: ["latin"],
});

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" className={`${inter.className} h-full`}>
      <body className="h-full">
      <div className="flex h-full overflow-y-auto">
        <Sidebar />
        <div className="w-full overflow-y-scroll">{children}</div>
      </div>
      </body>
    </html>
  );
};

export default Layout;
