"use client";
import {
  ReactNode,
  createContext,
  useEffect,
  useState,
  useContext,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { validateToken } from "@/app/actions/auth";

interface TAuthContext {
  token: string | null;
  username: string | null;
  updateToken: (token: string) => void;
  deleteToken: () => void;
}

export const AuthContext = createContext<TAuthContext>({
  token: null,
  updateToken: () => {},
  deleteToken: () => {},
  username: null,
});

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const cookies = useCookies();

  const updateToken = (token: string) => {
    const expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + 1000 * 60 * 60 * 12);
    cookies.set("token", token, {
      sameSite: "strict",
      secure: true,
      expires: expireDate,
    });
    setToken(token);
  };

  const deleteToken = () => {
    cookies.remove("token");
    setToken(null);
  };

  // Loads token from cookies on mount
  useEffect(() => {
    const token = cookies.get("token");
    if (token) {
      setToken(token);
    }
  }, [cookies]);

  // Checks if token is valid on page load
  useEffect(() => {
    const authenticateToken = async () => {
      let success = false;
      if (token) {
        const response = await validateToken(token);
        if (response) {
          success = true;
        }
      }
      return success;
    };

    authenticateToken().then((success) => {
      if (!success && !pathname.startsWith("/auth")) {
        if (token) {
          alert("Session expired. Please log in again.");
        } else {
          alert("Please log in to access this page.");
        }
        deleteToken();
        router.push("/auth/login");
        return;
      }

      if (success && (pathname.startsWith("/auth") || pathname === "/")) {
        router.push("/home");
      }
    });
  }, [pathname]);

  // Updates username when token changes
  useEffect(() => {
    if (token) {
      // Decode the token to get the username
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const decodedUsername = decodedToken.username;
        setUsername(decodedUsername);
        cookies.set("username", decodedUsername);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      setUsername(null);
      cookies.remove("username");
    }
  }, [cookies, token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        updateToken,
        deleteToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
