import type { Metadata } from "next";
import { Albert_Sans } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/common/theme-provider";

const albert_sans = Albert_Sans({
  subsets: ["latin"],
  variable: "--font-albert-sans",
});

export const metadata: Metadata = {
  title: "PeerPrep",
  description: "A platform for real-time collaborative coding interviews",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
