import { LoginStateProvider } from "@/contexts/LoginStateContext";
import "./globals.css";
import ReactQueryProvider from "@/components/ReactQueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LoginStateProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </LoginStateProvider>
      </body>
    </html>
  );
}
