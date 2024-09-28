import { ThemeProvider } from "./theme-context";
import { AuthProvider } from "./auth-context";

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
}
