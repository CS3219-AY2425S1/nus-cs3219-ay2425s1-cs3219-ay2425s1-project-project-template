import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PeerPrep",
  description: "A CS3219 Project by Group 15!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full`}>
      <body className="h-full">
        <GoogleOAuthProvider clientId="785838083864-7jmrr23k3homjemh5n2fvk7ouk759eb6.apps.googleusercontent.com">
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
