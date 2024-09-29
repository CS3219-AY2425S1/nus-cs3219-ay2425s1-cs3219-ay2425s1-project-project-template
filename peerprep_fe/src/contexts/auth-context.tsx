"use client";

import {
  ReactNode,
  createContext,
  useEffect,
  useState,
  useContext,
} from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";

interface TAuthContext {
  token: string | null;
  updateToken: (token: string) => void;
  deleteToken: () => void;
}

export const AuthContext = createContext<TAuthContext>({
  token: null,
  updateToken: () => {},
  deleteToken: () => {},
});

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
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

  useEffect(() => {
    if (!token) {
      const storedToken = cookies.get("token");
      // TODO: Add token validation
      if (storedToken) {
        setToken(storedToken);
      } else {
        router.push("/auth/login");
      }
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, updateToken, deleteToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
