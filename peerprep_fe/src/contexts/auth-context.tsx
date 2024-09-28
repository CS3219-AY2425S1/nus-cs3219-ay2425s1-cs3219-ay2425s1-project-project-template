"use client";

import {
  ReactNode,
  createContext,
  useEffect,
  useState,
  useContext,
} from "react";
import { useRouter } from "next/navigation";

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

  const updateToken = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const deleteToken = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  useEffect(() => {
    if (!token) {
      const storedToken = localStorage.getItem("token");
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
