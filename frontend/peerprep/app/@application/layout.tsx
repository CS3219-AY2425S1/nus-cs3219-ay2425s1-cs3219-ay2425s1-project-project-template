import "@/styles/globals.css";
import { Metadata, Viewport } from "next";

import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { isSessionAdmin } from "../api/auth/actions";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await isSessionAdmin();

  return (
    <section>
      <div className="relative flex flex-col h-screen">
        <Navbar />
        <div className="flex flex-grow mx-6">
          <Sidebar isAdmin={isAdmin} />
          <main className="flex-grow max-w-screen">{children}</main>
        </div>
        <footer className="w-full flex items-center justify-center py-3" />
      </div>
    </section>
  );
}
