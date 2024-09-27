import ReactQueryProvider from "@/components/ReactQueryProvider";
import Suspense from "@/components/Suspense";
import { Skeleton } from "@/components/ui/Skeleton";
import { LoginStateProvider } from "@/contexts/LoginStateContext";
import "./globals.css";
import { Toaster } from "@/components/ui/Toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LoginStateProvider>
          <Suspense fallback={<Skeleton className="w-screen h-screen" />}>
            <ReactQueryProvider>{children}</ReactQueryProvider>
            <Toaster />
          </Suspense>
        </LoginStateProvider>
      </body>
    </html>
  );
}
